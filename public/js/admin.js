//state variables
var current_pending_id = "";
var current_event_id = "";


window.onload = async () => {
    try{
        var ps = await db.collection("pending").get();
        var es = await db.collection("events").where("unix", ">=", (new Date).getTime())/*.orderBy("unix")*/.get();
        ps.forEach(doc=>{
            var data = doc.data();
            renderPending(doc.id, data);
        });
        es.forEach(doc=>{
            var data = doc.data();
            events[doc.id] = data;
            renderEvent(doc.id, data);
        })
    }catch(err){
        console.log(err)
        window.location.assign("/");
    }
}
const trashcan = `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path class="fill-path" fill-rule="evenodd" clip-rule="evenodd"d="M11.43 1.897H15.31C15.7 1.897 16 2.217 16 2.606C16 2.994 15.7 3.291 15.31 3.291H14.47L13.6 13.92C13.58 15.177 12.57 16.183 11.31 16.183H4.66C3.41 16.183 2.4 15.177 2.38 13.92L1.53 3.269H0.69C0.3 3.269 0 2.971 0 2.583C0 2.194 0.3 1.897 0.69 1.897H4.57V1.051C4.57 0.457 5.12 0 5.81 0H10.19C10.88 0 11.43 0.457 11.43 1.051V1.897ZM10.06 1.371H5.94V1.897H10.06V1.371ZM6.22 12.503H6.19C5.83 12.503 5.53 12.206 5.51 11.84L5.26 6.263C5.23 5.874 5.53 5.554 5.92 5.554H5.94C6.31 5.554 6.61 5.851 6.63 6.217L6.88 11.794C6.88 12.16 6.61 12.48 6.22 12.503ZM9.81 12.503C10.17 12.503 10.47 12.206 10.49 11.84L10.74 6.263C10.74 5.897 10.47 5.577 10.08 5.554H10.06C9.69 5.554 9.39 5.851 9.37 6.217L9.12 11.794C9.12 12.16 9.39 12.48 9.78 12.503H9.81Z"fill="#242424"></path></svg>`;

//html functions
//static button functions
document.querySelector("#authorize-all-pending").onclick = async () => {
    try {
        await confirm(true);
        acceptAllRequests();
    } catch (err) {
        console.log(err);
    };
};
document.querySelector("#reject-all-pending").onclick = async () => {
    try {
        await confirm(false);
        rejectAllRequests();
    } catch (err) {
        console.log(err);
    };
};

document.querySelector("#add-event").onclick = () => {
    showCreateEvent();
};
document.querySelector("#delete-all-events").onclick = async () => {
    try {
        await confirm(false);
        deleteAllEvents();
    } catch (err) {
        console.log(err);
    }
}

//creating elements on page
const eventsContainer = document.querySelector(".events_admin-container");
const pendingContainer = document.querySelector(".pending-container");

function renderEvent(id, data) {
    console.log(data);
    var {event_name, dateString} = data;
    var events_admin = createElement("div", ["events_admin"]); events_admin.id = id;

    var checkbox = document.createElement("input"); checkbox.type = "checkbox";
    var eventNameDiv = createElement("div", ["name", "labelled-text"]);
    var dateDiv = createElement("div", ["date", "labelled-text"]);
    var btnGroup = createElement("div", ["btn-group"]);

    var editButton = createElement("button", ["action-button"], "EDIT");
    var deleteButton = createElement("button", ["action-button", "delete-button"]);
    deleteButton.innerHTML = trashcan;

    editButton.onclick = ()=>{
        current_event_id = `${id}`;
        showCreateEvent(true, id, events[id]);
    };
    deleteButton.onclick = ()=>{
        deleteEvent(id).then(()=>{
            events_admin.remove();
        }).catch(()=>{
            console.log("couldn't delete event");
        });
    }

    //name div
    eventNameDiv.append(createElement("small", [], `ID: ${id}`));
    eventNameDiv.append(createElement("h2", [], event_name));

    //date div
    dateDiv.append(createElement("small", [], "DATE"));
    dateDiv.append(createElement("p", [], dateString));

    btnGroup.append(editButton, deleteButton);
    events_admin.append(checkbox, eventNameDiv, dateDiv, btnGroup);
    eventsContainer.append(events_admin);
}

function renderPending(id, data) {
    var {uid, name, hours, details} = data;
    var pending = createElement("div", ["pending"]); pending.id = id;

    var checkbox = document.createElement("input"); checkbox.type = "checkbox";
    var memberNameDiv = createElement("div", ["member-name", "labelled-text"]);
    var hoursDiv = createElement("div", ["hours", "labelled-text"]);
    var btnGroup = createElement("div", ["btn-group"]);

    var viewButton = createElement("button", ["action-button"], "View");
    var deleteButton = createElement("button", ["action-button", "delete-button"]);
    deleteButton.innerHTML = trashcan;

    viewButton.onclick = ()=>{
        current_pending_id = `${id}`;
        showDetails(id, data);
    }
    deleteButton.onclick = ()=>{
        pending.remove();
    }

    var memID = createElement("small", [], `ID: ${id}`);
    var n = createElement("h1", [], name);

    var hourLabel = createElement("small", [], "HOURS");
    var h = createElement("h1", [], hours);

    memberNameDiv.append(memID, n);
    hoursDiv.append(hourLabel, h);
    btnGroup.append(viewButton, deleteButton);
    pending.append(checkbox, memberNameDiv, hoursDiv, btnGroup);
    pendingContainer.append(pending);
}

//api functions
var events = [];
var requests = [];

//hour requests
function acceptRequest(pending_id) {
    let docRef = db.collection("pending").doc(pending_id);

    return db.runTransaction(function (transaction) {
        return transaction.get(docRef).then(function (doc) {
            if (!doc.exists) {
                throw "Document does not exist";
            }
            //read to who and how many hours
            var memID = doc.data().uid;
            var hours = doc.data().hours;

            //add to hours and remove from pending for user
            transaction.update(db.collection("hours").doc(memID), {
                "hours": firebase.firestore.FieldValue.increment(hours),
                "pending_hours": firebase.firestore.FieldValue.increment(-hours)
            });
            //delete the request after we're done with it
            transaction.delete(docRef);
        })
    });
}
function declineRequest(pending_id) {
    let docRef = db.collection("pending").doc(pending_id);
    return db.runTransaction(function (transaction) {
        return transaction.get(docRef).then(function (doc) {
            if (!doc.exists) {
                throw "Document does not exist";
            }
            var memID = doc.data().uid;
            var hours = doc.data().hours;
            //remove queued hours
            transaction.update(db.collection("hours").doc(memID), {
                "pending_hours": firebase.firestore.FieldValue.increment(-hours)
            });

            //delete the request after we're done with it
            transaction.delete(docRef);
        })
    });
    
}

function acceptAllRequests() {

}

async function rejectAllRequests() {
    document.querySelectorAll(".pending").forEach(pending=>{
        pending.querySelector(".delete-button").click();
    });
}

//Events
// data = {
//     event_name, 
//     description,
//     photo_url,
//     unix,
//     dateString
// };
function createEvent(data) {
    return db.collection("events").add(data);
}

function updateEvent(event_id, data) {
    return db.collection("events").doc(event_id).update(data);
}

function deleteEvent(event_id) { //also have to delete all signups preferably
    return db.collection("events").doc(event_id).delete();
}

function deleteAllEvents() {
    document.querySelectorAll(".events_admin").forEach(event=>{
        event.querySelector(".delete-button").click();
    });
}

//helper functions
function createElement(type, className = [], text = "") {
    var temp = document.createElement(type);
    // console.log(className);
    if (className.length) {
        className.forEach(cn => temp.classList.add(cn));
    }
    if (text) temp.innerText = text;
    return temp;
}
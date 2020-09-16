const trashcan = `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path class="fill-path" fill-rule="evenodd" clip-rule="evenodd"d="M11.43 1.897H15.31C15.7 1.897 16 2.217 16 2.606C16 2.994 15.7 3.291 15.31 3.291H14.47L13.6 13.92C13.58 15.177 12.57 16.183 11.31 16.183H4.66C3.41 16.183 2.4 15.177 2.38 13.92L1.53 3.269H0.69C0.3 3.269 0 2.971 0 2.583C0 2.194 0.3 1.897 0.69 1.897H4.57V1.051C4.57 0.457 5.12 0 5.81 0H10.19C10.88 0 11.43 0.457 11.43 1.051V1.897ZM10.06 1.371H5.94V1.897H10.06V1.371ZM6.22 12.503H6.19C5.83 12.503 5.53 12.206 5.51 11.84L5.26 6.263C5.23 5.874 5.53 5.554 5.92 5.554H5.94C6.31 5.554 6.61 5.851 6.63 6.217L6.88 11.794C6.88 12.16 6.61 12.48 6.22 12.503ZM9.81 12.503C10.17 12.503 10.47 12.206 10.49 11.84L10.74 6.263C10.74 5.897 10.47 5.577 10.08 5.554H10.06C9.69 5.554 9.39 5.851 9.37 6.217L9.12 11.794C9.12 12.16 9.39 12.48 9.78 12.503H9.81Z"fill="#242424"></path></svg>`;

const pendingContainer = document.querySelector(".pending-container");
const eventsContainer = document.querySelector(".events_admin-container");

const modalBackground = document.querySelector(".modal-background");
const hideModalButtons = document.querySelectorAll(".hide-modal");

hideModalButtons.forEach(button => button.addEventListener("click", function (event) {
    event.preventDefault();
    closeModals();
}));

const createEventModal = document.querySelector(".create-event-modal");
const confirmModal = document.querySelector(".delete-event-modal");

const addEventButton = document.querySelector("#addEvent");

const confirmButton = document.querySelector("#confirm");
const cancelButton = document.querySelector("#cancel");

//collection of events and pending
var pending = {};

var events = {};

//show create menu
addEventButton.addEventListener("click", function () {
    document.querySelector("#confirmCreate").style.display = "inline-block";
    document.querySelector("#confirmEdit").style.display = "none";
    clearForm();
    showCreateEvent();
});

//authorize all pending
document.querySelector("#authorize-all-pending").addEventListener("click", function () {
    //show confirmation modal
    //decline all the pendings
    document.querySelectorAll(".pending").forEach(pending => {
        pending.querySelector(".action-button").click();
    });
});
//delete all pending
document.querySelector("#delete-all-pending").addEventListener("click", function () {
    //show confirmation modal
    confirm().then(() => {
        //decline all the pendings
        document.querySelectorAll(".pending").forEach(pending => {
            pending.querySelector(".delete-button").click();
        });
        //remove all of them
        console.log("confirmed");
    }).catch(() => {
        console.log("cancelled");
    });
});

//delete all events
document.querySelector("#delete-all-events").addEventListener("click", function () {
    //show confirmation modal
    confirm().then(() => {
        //decline all the pendings
        document.querySelectorAll(".events_admin").forEach(event => {
            event.querySelector(".delete-button").click();
        });
        //remove all of them
        console.log("confirmed");
    }).catch(() => {
        console.log("cancelled");
    });
});

//create event
document.querySelector("#confirmCreate").addEventListener("click", function () {
    var data = getFormData();
    addEvent(data.photo, data.dateString, data.unix, data.name, data.desc);
});

//edit button
document.querySelector("#confirmEdit").addEventListener("click", function (event) {
    event.preventDefault();
    var data = getFormData();
    // console.log(data.eventID, data.photo, data.unix, data.name, data.desc);
    updateEvent(data.eventID, data.photo, data.dateString, data.unix, data.name, data.desc);
});
function showCreateEvent() {
    modalBackground.style.display = "flex";
    createEventModal.style.display = "flex";
}

function showConfirm() {
    modalBackground.style.display = "flex";
    confirmModal.style.display = "flex";
}

function closeModals() {
    modalBackground.style.display = "none";
    createEventModal.style.display = "none";
    confirmModal.style.display = "none";
}

function confirm() {
    showConfirm();
    return new Promise((resolve, reject) => {
        console.log("reee");
        confirmButton.addEventListener("click", removeable);
        cancelButton.addEventListener("click", removeable);
        function removeable(event) {
            confirmButton.removeEventListener("click", removeable);
            cancelButton.removeEventListener("click", removeable);
            closeModals();
            if (event.target == confirmButton) {
                resolve();
            } else {
                reject();
            }
        }
    });
}

window.onload = function () {

    //check if user is admin
    renderPending();
    renderEvents();


    //if unsuccessfull, means the user is not an admin, and then throw them out

    // for (var i = 0; i < 3; i++) {
    // createPending("5lNOO5fbbCPQCLGtiT8j0QjuaPm2", "Jane Doe", "16");

    // createEvent("5lNOO5fbbCPQCLGtiT8j0QjuaPm2", "Mock Waterloo Math Contest", "12/25/2020", "151");
    // }
}

function createPending(docID, id, name, hours) {
    var pending = createElement("div", ["pending"]); pending.id = docID;

    var checkbox = document.createElement("input"); checkbox.type = "checkbox";
    var memberNameDiv = createElement("div", ["member-name", "labelled-text"]);
    var hoursDiv = createElement("div", ["hours", "labelled-text"]);
    var btnGroup = createElement("div", ["btn-group"]);

    var authorizeButton = createElement("button", ["action-button"], "AUTHORIZE");
    var deleteButton = createElement("button", ["action-button", "delete-button"]);
    deleteButton.innerHTML = trashcan;

    //add listeners to the buttons
    authorizeButton.addEventListener("click", () => {
        console.log(pending);
        accept(docID).then(() => {
            pending.remove();
            delete pending[docID];
        }).catch((err) => { console.log("an error occured trying to accept the request", err) });
    });

    deleteButton.addEventListener("click", () => {
        decline(docID).then(() => {
            pending.remove();
            delete pending[docID];
        }).catch((err) => { console.log("an error occured trying to remove the request", err) });
    });

    var memID = createElement("small", [], `ID: ${id}`);
    var n = createElement("h1", [], name);

    var hourLabel = createElement("small", [], "HOURS");
    var h = createElement("h1", [], hours);

    memberNameDiv.append(memID); memberNameDiv.append(n);

    hoursDiv.append(hourLabel); hoursDiv.append(h);

    btnGroup.append(authorizeButton, deleteButton);

    pending.append(checkbox); pending.append(memberNameDiv); pending.append(hoursDiv); pending.append(btnGroup);

    pendingContainer.append(pending);
}

function createEvent(id, name, dateString, count) {
    var events_admin = createElement("div", ["events_admin"]); events_admin.id = id;

    var checkbox = document.createElement("input"); checkbox.type = "checkbox";
    var eventNameDiv = createElement("div", ["name", "labelled-text"]);
    var dateDiv = createElement("div", ["date", "labelled-text"]);
    var countDiv = createElement("div", ["count", "labelled-text"]);
    var btnGroup = createElement("div", ["btn-group"]);

    var editButton = createElement("button", ["action-button"], "EDIT");
    var deleteButton = createElement("button", ["action-button", "delete-button"]);
    deleteButton.innerHTML = trashcan;

    //add button listners
    editButton.addEventListener("click", () => {
        //show the modal
        document.querySelector("#confirmCreate").style.display = "none";
        document.querySelector("#confirmEdit").style.display = "inline-block";

        var data = events[id];
        //load the data in
        updateFormData(id, data.event_name, data.unix, data.dateString, data.photo_url, data.description);
        showCreateEvent();
        console.log(events_admin);
    });
    deleteButton.addEventListener("click", () => {
        removeEvent(id).then(() => {
            events_admin.remove();
            delete events_admin[id];
        }).catch((err) => { console.log("an error occured trying to remove the request", err) });
    });

    //name div
    eventNameDiv.append(createElement("small", [], `ID: ${id}`));
    eventNameDiv.append(createElement("h2", [], name));

    //date div
    dateDiv.append(createElement("small", [], "DATE"));
    dateDiv.append(createElement("p", [], dateString));

    //count div
    countDiv.append(createElement("small", [], "MEMBERS"));
    countDiv.append(createElement("p", [], count));

    btnGroup.append(editButton); btnGroup.append(deleteButton);

    events_admin.append(checkbox); events_admin.append(eventNameDiv); events_admin.append(dateDiv); events_admin.append(countDiv); events_admin.append(btnGroup);

    eventsContainer.append(events_admin);
}

function createElement(type, className = [], text = "") {
    var temp = document.createElement(type);
    // console.log(className);
    if (className.length) {
        className.forEach(cn => temp.classList.add(cn));
    }
    if (text) temp.innerText = text;
    return temp;
}

function renderPending() {
    //get from firebase
    db.collection("pending").get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            var data = doc.data();
            pending[doc.id] = data;
            createPending(doc.id, data.uid, data.name, data.hours);
        });
    });
}


function renderEvents() {
    db.collection("events").where("unix", ">=", Date.now()).orderBy("unix").get()
        .then(qs => {
            qs.forEach(doc => {
                var data = doc.data();
                events[doc.id] = data;
                //store event data in a global array
                createEvent(doc.id, data.event_name, data.dateString, data.member_count.toString());
                console.log(data.member_count);
            })
        });
}


//pending operations
function accept(pending_id) {
    let docRef = db.collection("pending").doc(pending_id);

    return db.runTransaction(function (transaction) {
        return transaction.get(docRef).then(function (doc) {
            if (!doc.exists) {
                throw "Document does not exist";
            }
            var memID = doc.data().uid;
            var hours = doc.data().hours;
            transaction.update(db.collection("hours").doc(memID), {
                "hours": firebase.firestore.FieldValue.increment(hours),
                "pending_hours": firebase.firestore.FieldValue.increment(-hours)
            });
            transaction.delete(docRef);
        })
    });
}
function decline(pending_id) {
    let docRef = db.collection("pending").doc(pending_id);

    return db.runTransaction(function (transaction) {
        return transaction.get(docRef).then(function (doc) {
            if (!doc.exists) {
                throw "Document does not exist";
            }
            var memID = doc.data().uid;
            var hours = doc.data().hours;
            transaction.update(db.collection("hours").doc(memID), {
                "pending_hours": firebase.firestore.FieldValue.increment(-hours)
            });
            transaction.delete(docRef);
        })
    });
    // .then(() => {
    //     console.log("success")
    //     callback();
    // }).catch(err => {
    //     console.log("unsucessful", err);
    // });
}

//event operations
function addEvent(img_src = "", dateString = "", unix = 0, title = "", description = "", count = 0) {
    db.collection("events").add({
        "photo_url": img_src,
        "dateString": dateString,
        "unix": unix,
        "event_name": title,
        "description": description,
        "member_count": count
    }).then((doc) => {
        events[doc.id] = {
            "photo_url": img_src,
            "dateString": dateString,
            "unix": unix,
            "event_name": title,
            "description": description,
            "member_count": count
        }
        createEvent(doc.id, title, dateString, 0);
    }).catch((err) => {
        console.log("unsuccessful", err);
    });
}
function updateEvent(event_id, img_src, dateString, unix, title, description) {
    db.collection("events").doc(event_id).update({
        "photo_url": img_src,
        "dateString": dateString,
        "unix": unix,
        "event_name": title,
        "description": description
    }).then(() => {
        var eventDiv = document.querySelector(`#${event_id}`);
        //update name
        eventDiv.querySelector(".name > h2").innerText = title;
        //update datestring
        eventDiv.querySelector(".date > p").innerText = dateString;
    }).catch((err) => {
        console.log("unsuccessful", err);
    });
}
function removeEvent(event_id) {
    return db.collection("events").doc(event_id).delete().then(() => {
        console.log("event deleted");
    }).catch(err => {
        console.log("couldn't remove", event_id, err);
    });
}

function getFormData() {
    var data = {}
    var names = ["eventID", "name", "date", "dateString", "photo", "desc"];
    names.forEach(name => {
        data[name] = document.querySelector(`#${name}`).value;
    })

    //get unix from date
    var date = new Date(data.date);
    data.unix = date.getTime();
    return data;
}

function updateFormData(docID, title, unix, dateString, img_src, desc) {
    //convert unix to date format
    //yyyy-mm-dd
    var date = new Date(unix).toISOString().split("T")[0];
    var pairs = {
        "eventID": docID,
        "name": title,
        "date": date,
        "dateString": dateString,
        "photo": img_src,
        "desc": desc
    }
    for (var [key, text] of Object.entries(pairs)) {
        document.querySelector(`#${key}`).value = text;
    };
}
function clearForm() {
    document.querySelector("form").reset();
}
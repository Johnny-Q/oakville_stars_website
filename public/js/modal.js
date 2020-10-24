//modals
const modalBackground = document.querySelector(".modal-background");
const createEventModal = document.querySelector(".create-event-modal");
const confirmModal = document.querySelector(".confirm-modal");
const detailsModal = document.querySelector(".request-details-modal");

//close modals when click outside of modal
window.onclick = (event) => {
    if (event.target == modalBackground) {
        closeModals(event);
    }
}

//modal buttons
//all hide modal buttons
document.querySelectorAll(".hide-modal").forEach(btn => {
    btn.onclick = closeModals;
});

//create/edit event modal
document.querySelector("#confirmCreate").onclick = (event) => {
    event.preventDefault();
    //add
    let data = getEventFormData();
    createEvent(data).then((docRef)=>{
        events[docRef.id] = data;
        renderEvent(docRef.id, data);
        closeModals(event);
    }).catch(()=>{
        console.log("Couldn't create event.");
    });
};
document.querySelector("#confirmEdit").onclick = (event) => {
    event.preventDefault();
    //set
    let data = getEventFormData();
    updateEvent(current_event_id, data).then(()=>{
        events[current_event_id] = data;
        
        //update html
        var eventDiv = document.querySelector(`#${current_event_id}`);

        //update name
        eventDiv.querySelector(".name > h2").innerText = data.event_name;

        //update datestring
        eventDiv.querySelector(".date > p").innerText = data.dateString;
        
        
        closeModals(event);
    }).catch(()=>{
        console.log("Couldn't update event.");
    });
}

//view request details
document.querySelector("#acceptRequest").onclick = (event) => {
    event.preventDefault();
    //accept
    if (current_pending_id) {
        acceptRequest(current_pending_id).then(() => {
            document.querySelector(`#${current_pending_id}`).remove();
            closeModals(event);
        }).catch(() => {
            console.log("Couldn't Accept");
        });
    }
}
document.querySelector("#declineRequest").onclick = (event) => {
    event.preventDefault();
    //reject
    if (current_pending_id) {
        declineRequest(current_pending_id).then(() => {
            document.querySelector(`#${current_pending_id}`).remove();
            closeModals(event);
        }).catch(() => {
            console.log("Couldn't decline");
        });
        console.log(current_pending_id);
    }
}

//modal control functions
function showCreateEvent(editing = false, id, data = {}) {
    if (editing) {
        //fill in values
        // document.querySelector("#event-id").value = id;
        var date = new Date(data.unix).toISOString().split("T")[0];
        document.querySelector("#event-date").value = date;
        for (var [key, val] of Object.entries(data)) {
            var element = document.querySelector(`#event-${key}`);
            if (element) element.value = val;
        }
    }
    document.querySelector("#confirmCreate").style.display = editing ? "none" : "inline-block";
    document.querySelector("#confirmEdit").style.display = editing ? "inline-block" : "none";

    modalBackground.style.display = "flex";
    createEventModal.style.display = "flex";
}

function showDetails(id, data) {
    //change id, name, hours, and details
    document.querySelector(".request-details-modal > .name > small").innerText = `ID: ${id}`;
    document.querySelector(".request-details-modal > .name > h1").innerText = data.name;
    document.querySelector(".request-details-modal > .hours > h1").innerText = data.hours;
    document.querySelector(".request-details-modal > .details > p").innerText = data.details;

    modalBackground.style.display = "flex";
    detailsModal.style.display = "grid";
}
function showConfirm(positive) {
    //change delete button from delete all to accept all
    var confirmButton = document.querySelector("#confirm");
    confirmButton.innerText = positive ? "Accept All" : "Delete All";
    confirmButton.classList.remove(positive ? "caution-button" : "positive-button");
    confirmButton.classList.add(positive ? "positive-button" : "caution-button");

    modalBackground.style.display = "flex";
    confirmModal.style.display = "flex";
}
function confirm(positive) {
    const confirmButton = document.querySelector("#confirm");
    const cancelButton = document.querySelector("#cancel");
    showConfirm(positive);
    return new Promise((resolve, reject) => {
        // console.log("reee");
        confirmButton.onclick = (event) => {
            resolve();
            closeModals(event);
            confirmButton.onclick = null;
            cancelButton.onclick = null;
        }
        cancelButton.onclick = (event) => {
            reject();
            closeModals(event);
            confirmButton.onclick = null;
            cancelButton.onclick = null;
        };
    });
}

function closeModals(event) {
    if (event) event.preventDefault();
    modalBackground.style.display = "none";
    createEventModal.style.display = "none";
    confirmModal.style.display = "none";
    detailsModal.style.display = "none";

    current_pending_id = '';
    current_event_id = '';
}


//helper functions
function getEventFormData() {
    var keys = [/*"id",*/"event_name", "date", "dateString", "photo_url", "description"];
    var data = {};
    for (let i = 0; i < keys.length; i++) {
        data[keys[i]] = document.querySelector(`#event-${keys[i]}`).value;
    }
    if(current_event_id){
        data.id = current_event_id;
    }
    var date = new Date(data.date);
    data.unix = date.getTime();
    return data;
}

function randomPromise() {
    return new Promise((resolve, reject) => {
        if (Math.random() < (1 / 10)) {
            resolve();
        }
        reject();
    });
}
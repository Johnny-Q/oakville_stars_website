//@ts-nocheck
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
(document.querySelectorAll(".hide-modal") as NodeList).forEach((btn: HTMLElement) => {
    btn.onclick = closeModals;
});

//create/edit event modal
document.querySelector("#confirmCreate").onclick = async (event) => {
    event.preventDefault();
    //add
    let [data, file] = getEventFormData();
    //upload the file
    try {
        if (file) {
            let path = await storage_wrapper.uploadEventImage(file);
            data.photo_url = path;
        } else {
            data.photo_url = "event_photos/blank.jpg";
        }
        let docRef = await admin_wrapper.createEvent(data);
        data.doc_id = docRef.id;
        events[docRef.id] = data;
        renderAdminEvent(data);
        closeModals(event);
    } catch (err) {
        console.log(err);
    }
};
document.querySelector("#confirmEdit").onclick = async (event) => {
    event.preventDefault();
    //set
    let [data, file] = getEventFormData();
    data.doc_id = current_event_id;
    //upload the file
    try {
        if (file) {
            let path = await storage_wrapper.uploadEventImage(file);
            data.photo_url = path;
        }
        
        await admin_wrapper.updateEvent(data, current_event_id);
        events[current_event_id] = data;

        //update html
        var eventDiv = document.querySelector(`#event_${current_event_id}`);

        //update name
        eventDiv.querySelector(".name > h2").innerText = data.event_name;

        //update datestring
        eventDiv.querySelector(".date > p").innerText = data.dateString;

        closeModals(event);
    } catch (err) {
        console.log(err);
    }
}

//view request details
document.querySelector("#acceptRequest").onclick = (event) => {
    event.preventDefault();
    //accept
    if (current_pending_id) {
        admin_wrapper.acceptRequest(current_pending_id).then(() => {
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
        admin_wrapper.declineRequest(current_pending_id).then(() => {
            document.querySelector(`#${current_pending_id}`).remove();
            closeModals(event);
        }).catch(() => {
            console.log("Couldn't decline");
        });
        console.log(current_pending_id);
    }
}

//modal control functions
function showCreateEvent(editing = false, data = {}) {
    if (editing) {
        //fill in values
        // document.querySelector("#event-id").value = id;
        var date = new Date(data.unix).toISOString().split("T")[0];
        for (var [key, val] of Object.entries(data)) {
            var element = document.querySelector(`#event-${key}`);
            if (element) element.value = val;
        }
        document.querySelector("#event-date").value = date;
    }
    else {
        current_event_id = "";
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
    document.querySelector(".request-details-modal > .details > .row > p.date").innerText = data.date;

    modalBackground.style.display = "flex";
    detailsModal.style.display = "grid";
}
function showConfirm(positive) {
    //change delete button from delete all to accept all
    var confirmButton = document.querySelector("#confirm");
    confirmButton.innerText = positive ? "Accept All" : "Delete All";
    confirmButton.classList.remove(positive ? "caution_button" : "positive_button");
    confirmButton.classList.add(positive ? "positive_button" : "caution_button");

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
function getEventFormData(): [EventDetails, File] {
    var keys = [/*"id",*/"event_name", "date", "dateString", "description"];
    var data = {};
    for (let i = 0; i < keys.length; i++) {
        data[keys[i]] = document.querySelector(`#event-${keys[i]}`).value;
    }

    //get the photo
    let file = document.querySelector(`#event-photo_picker`).files[0];

    //if we're editing something currently
    if (current_event_id) {
        data.id = current_event_id;
    }

    var date = new Date(data.date);
    data.unix = date.getTime();
    return [data, file];
}

function randomPromise() {
    return new Promise((resolve, reject) => {
        if (Math.random() < (1 / 10)) {
            resolve("");
        }
        reject();
    });
}

class ModalManager {
    constructor() {
        //create the modals to add to the page

        //
    }
}
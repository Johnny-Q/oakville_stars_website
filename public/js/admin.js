const trashcan = `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path class="fill-path" fill-rule="evenodd" clip-rule="evenodd"d="M11.43 1.897H15.31C15.7 1.897 16 2.217 16 2.606C16 2.994 15.7 3.291 15.31 3.291H14.47L13.6 13.92C13.58 15.177 12.57 16.183 11.31 16.183H4.66C3.41 16.183 2.4 15.177 2.38 13.92L1.53 3.269H0.69C0.3 3.269 0 2.971 0 2.583C0 2.194 0.3 1.897 0.69 1.897H4.57V1.051C4.57 0.457 5.12 0 5.81 0H10.19C10.88 0 11.43 0.457 11.43 1.051V1.897ZM10.06 1.371H5.94V1.897H10.06V1.371ZM6.22 12.503H6.19C5.83 12.503 5.53 12.206 5.51 11.84L5.26 6.263C5.23 5.874 5.53 5.554 5.92 5.554H5.94C6.31 5.554 6.61 5.851 6.63 6.217L6.88 11.794C6.88 12.16 6.61 12.48 6.22 12.503ZM9.81 12.503C10.17 12.503 10.47 12.206 10.49 11.84L10.74 6.263C10.74 5.897 10.47 5.577 10.08 5.554H10.06C9.69 5.554 9.39 5.851 9.37 6.217L9.12 11.794C9.12 12.16 9.39 12.48 9.78 12.503H9.81Z"fill="#242424"></path></svg>`;
const eventsContainer = document.querySelector(".events_admin-container");
const pendingContainer = document.querySelector(".pending-container");
let current_event_id = "";
let current_pending_id = "";
let events = {};
let requests = {};
class AdminWrapper extends FirebaseDBWrapper {
    constructor(db) {
        super(db);
    }
    async getAllEvents() {
        let query = this.db.collection("/events").orderBy("unix");
        let event_refs = (await query.get()).docs;
        let event_data = [];
        event_refs.forEach(event => {
            event_data.push(this.addIdToData(event));
        });
        return event_data;
    }
    async createEvent(event_details) {
        if (!auth.currentUser)
            throw "Not signed in";
        return this.db.collection("/events").add(event_details);
    }
    async updateEvent(event_details, event_id) {
        if (!auth.currentUser)
            throw "Not signed in";
        return this.db.doc(`/events/${event_id}`).update(event_details);
    }
    async deleteEvent(event_id) {
        if (!auth.currentUser)
            throw "Not signed in";
        return this.db.doc(`/events/${event_id}`).delete();
    }
    async getHourRequests(limit = 0, startAfterId = "") {
        if (!auth.currentUser)
            throw "Not signed in";
        let query = this.db.collection("requests");
        if (startAfterId) {
            let snapshot = await this.db.doc(`/requests/${startAfterId}`).get();
            query = query.startAfter(snapshot);
        }
        if (limit) {
            query = query.limit(limit);
        }
        let hour_requests = (await query.get()).docs;
        let data = [];
        hour_requests.forEach(request => {
            data.push(this.addIdToData(request));
        });
        return data;
    }
    async acceptRequest(request_id) {
        if (!auth.currentUser)
            throw "Not signed in";
        let docRef = db.collection("requests").doc(request_id);
        return db.runTransaction(function (transaction) {
            return transaction.get(docRef).then(function (doc) {
                if (!doc.exists) {
                    throw "Document does not exist";
                }
                let memID = doc.data().uid;
                let hours = doc.data().hours;
                transaction.update(db.collection("hours").doc(memID), {
                    "hours": firebase.firestore.FieldValue.increment(hours),
                    "pending_hours": firebase.firestore.FieldValue.increment(-hours)
                });
                transaction.delete(docRef);
            });
        });
    }
    async declineRequest(request_id) {
        if (!auth.currentUser)
            throw "Not signed in";
        let docRef = db.collection("requests").doc(request_id);
        return db.runTransaction(function (transaction) {
            return transaction.get(docRef).then(function (doc) {
                if (!doc.exists) {
                    throw "Document does not exist";
                }
                let memID = doc.data().uid;
                let hours = doc.data().hours;
                transaction.update(db.collection("hours").doc(memID), {
                    "pending_hours": firebase.firestore.FieldValue.increment(-hours)
                });
                transaction.delete(docRef);
            });
        });
    }
}
let admin_wrapper = new AdminWrapper(db);
function renderAdminEvent(event_details) {
    let id = event_details.doc_id;
    console.log(event_details);
    let { event_name, dateString } = event_details;
    let events_admin = createElement("div", ["events_admin"]);
    events_admin.id = `event_${event_details.doc_id}`;
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    let eventNameDiv = createElement("div", ["name", "labelled-text"]);
    let dateDiv = createElement("div", ["date", "labelled-text"]);
    let btnGroup = createElement("div", ["btn_group"]);
    let editButton = createElement("button", ["action_button"], "EDIT");
    let deleteButton = createElement("button", ["action_button", "delete_button"]);
    deleteButton.innerHTML = trashcan;
    editButton.onclick = () => {
        current_event_id = `${id}`;
        showCreateEvent(true, events[event_details.doc_id]);
    };
    deleteButton.onclick = () => {
        admin_wrapper.deleteEvent(id).then(() => {
            events_admin.remove();
        }).catch(() => {
            console.log("couldn't delete event");
        });
    };
    eventNameDiv.append(createElement("small", [], `ID: ${id}`));
    eventNameDiv.append(createElement("h2", [], event_name));
    dateDiv.append(createElement("small", [], "DATE"));
    dateDiv.append(createElement("p", [], dateString));
    btnGroup.append(editButton, deleteButton);
    events_admin.append(checkbox, eventNameDiv, dateDiv, btnGroup);
    eventsContainer.append(events_admin);
}
function renderRequest(hour_request) {
    let { uid, name, hours, details, "doc_id": id } = hour_request;
    let pending = createElement("div", ["pending"]);
    pending.id = id;
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    let memberNameDiv = createElement("div", ["member-name", "labelled-text"]);
    let hoursDiv = createElement("div", ["hours", "labelled-text"]);
    let btnGroup = createElement("div", ["btn_group"]);
    let viewButton = createElement("button", ["action_button"], "View");
    let deleteButton = createElement("button", ["action_button", "delete_button"]);
    deleteButton.innerHTML = trashcan;
    viewButton.onclick = () => {
        current_pending_id = `${id}`;
        showDetails(id, hour_request);
    };
    deleteButton.onclick = () => {
        admin_wrapper.declineRequest(id).then(() => {
            pending.remove();
        }).catch(err => {
            console.log(err);
        });
    };
    let memID = createElement("small", [], `ID: ${id}`);
    let n = createElement("h1", [], name);
    let hourLabel = createElement("small", [], "HOURS");
    let h = createElement("h1", [], hours);
    memberNameDiv.append(memID, n);
    hoursDiv.append(hourLabel, h);
    btnGroup.append(viewButton, deleteButton);
    pending.append(checkbox, memberNameDiv, hoursDiv, btnGroup);
    pendingContainer.append(pending);
}
document.querySelector("#authorize-all-pending").onclick = async () => {
    try {
        await confirm(true);
        acceptAllRequests();
    }
    catch (err) {
        console.log(err);
    }
    ;
};
document.querySelector("#reject-all-pending").onclick = async () => {
    try {
        await confirm(false);
        rejectAllRequests();
    }
    catch (err) {
        console.log(err);
    }
    ;
};
document.querySelector("#add-event").onclick = () => {
    current_event_id = "";
    showCreateEvent(false);
};
document.querySelector("#delete-all-events").onclick = async () => {
    try {
        await confirm(false);
        deleteAllEvents();
    }
    catch (err) {
        console.log(err);
    }
};
function acceptAllRequests() {
    for (let [key, val] of Object.entries(requests)) {
        admin_wrapper.acceptRequest(key);
    }
}
function rejectAllRequests() {
    document.querySelectorAll(".pending").forEach(pending => {
        pending.querySelector(".delete_button").click();
    });
}
function deleteAllEvents() {
    document.querySelectorAll(".events_admin").forEach(event => {
        event.querySelector(".delete_button").click();
    });
}
auth.onAuthStateChanged(async (user) => {
    if (user) {
        try {
            var ps = await admin_wrapper.getHourRequests();
            var es = await admin_wrapper.getAllEvents();
            console.log(ps, es);
            ps.forEach(hour_request => {
                requests[hour_request.doc_id] = hour_request;
                renderRequest(hour_request);
            });
            es.forEach(event_data => {
                events[event_data.doc_id] = event_data;
                renderAdminEvent(event_data);
            });
        }
        catch (err) {
            console.log(err);
            window.location.assign("/");
        }
    }
    else {
        window.location.assign("/");
    }
});

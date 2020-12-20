const firebaseConfig = {
    apiKey: "AIzaSyDkn3sh33RTb6nRPtNAD9p-JZc6Qbb-frg",
    authDomain: "test-json-cbef3.firebaseapp.com",
    databaseURL: "https://test-json-cbef3.firebaseio.com",
    projectId: "test-json-cbef3",
    storageBucket: "test-json-cbef3.appspot.com",
    messagingSenderId: "610759909312",
    appId: "1:610759909312:web:e3fb6f03a77529824a7225"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
class FirebaseDBWrapper {
    constructor(db) {
        this.db = db;
    }
    async getUpcomingEvents(limit = 0, startAfterId = "") {
        var query = this.db.collection("events").where("unix", ">", Date.now()).orderBy("unix");
        if (startAfterId) {
            let snapshot = await this.db.doc(`/events/${startAfterId}`).get();
            query = query.startAfter(snapshot);
        }
        if (limit) {
            query = query.limit(limit);
        }
        let event_refs = (await query.get()).docs;
        let event_data = [];
        event_refs.forEach(event => {
            event_data.push(this.addIdToData(event));
        });
        return event_data;
    }
    async getPastEvents(limit = 0, startAfterId = "") {
        var query = this.db.collection("events").where("unix", "<=", Date.now()).orderBy("unix");
        if (startAfterId) {
            let snapshot = await this.db.doc(`/events/${startAfterId}`).get();
            query = query.startAfter(snapshot);
        }
        if (limit) {
            query = query.limit(limit);
        }
        let event_refs = (await query.get()).docs;
        let event_data = [];
        event_refs.forEach(event => {
            event_data.push(this.addIdToData(event));
        });
        return event_data;
    }
    async getEventData(event_id) {
        let doc = this.db.doc(`/events/${event_id}`);
        let event = await doc.get();
        if (event.exists) {
            return this.addIdToData(event);
        }
        else {
            throw "doesn't exist";
        }
    }
    async isSignedUp(event_id) {
        if (!auth.currentUser)
            throw "Not signed in";
        let event_ref = this.db.doc(`/signups/${auth.currentUser.uid}_${event_id}`);
        let event = await event_ref.get();
        return event.exists;
    }
    async createSignupForEvent(event_id) {
        if (!auth.currentUser)
            throw "Not signed in";
        let doc_ref = this.db.doc(`/signups/${auth.currentUser.uid}_${event_id}`);
        return doc_ref.set({
            "event_id": event_id,
            "uid": auth.currentUser.uid
        });
    }
    async deleteSignupForEvent(event_id) {
        if (!auth.currentUser)
            throw "Not signed in";
        return db.doc(`/signups/${auth.currentUser.uid}_${event_id}`).delete();
    }
    async getCurrentHours() {
        if (!auth.currentUser)
            throw "Not signed in";
        let doc_ref = this.db.doc(`/hours/${auth.currentUser.uid}`);
        let hours = await doc_ref.get();
        return this.addIdToData(hours);
    }
    async createHoursRequest(hours_request) {
        if (!auth.currentUser)
            throw "Not signed in";
        let pending_request_ref = this.db.collection("requests").doc();
        let member_hours_ref = this.db.doc(`/hours/${auth.currentUser.uid}`);
        let batch = this.db.batch();
        batch.set(pending_request_ref, hours_request);
        batch.update(member_hours_ref, {
            "pending_hours": firebase.firestore.FieldValue.increment(hours_request.hours)
        });
        return batch.commit();
    }
    async getCurrentInformation() {
        if (!auth.currentUser)
            throw "Not signed in";
        let member_info_ref = this.db.doc(`/members/${auth.currentUser.uid}`);
        let member_info = await member_info_ref.get();
        return this.addIdToData(member_info);
    }
    async updateCurrentInformation(member_info) {
        if (!auth.currentUser)
            throw "Not signed in";
        let member_info_ref = this.db.doc(`/members/${auth.currentUser.uid}`);
        return member_info_ref.update(member_info);
    }
    async createAccountInformation(member_info) {
        if (!auth.currentUser)
            throw "Not signed in";
        let batch = this.db.batch();
        let member_info_ref = this.db.doc(`/members/${auth.currentUser.uid}`);
        let member_hours_ref = this.db.doc(`/hours/${auth.currentUser.uid}`);
        batch.set(member_info_ref, member_info);
        batch.set(member_hours_ref, {
            "name": member_info.child_fullname,
            "hours": 0,
            "pending_hours": 0
        });
        return batch.commit();
    }
    async getTeamMembers() {
        let team_members_ref = this.db.collection("/team_members").orderBy("unix_added");
        let team_members = await team_members_ref.get();
        let data = [];
        team_members.forEach(member => {
            data.push(this.addIdToData(member));
        });
        return data;
    }
    addIdToData(snapshot) {
        if (!snapshot.exists)
            return {};
        let temp = snapshot.data();
        temp.doc_id = snapshot.id;
        return temp;
    }
}
class FirebaseAuthWrapper {
    constructor(auth, db) {
        this.last_request = 0;
        this.auth = auth;
        this.db = db;
    }
    async createAccount(email, password, member_info) {
        await this.auth.createUserWithEmailAndPassword(email, password);
        return this.db.createAccountInformation(member_info);
    }
}
class FirebaseStorageWrapper {
    constructor(storage) {
        this.storage = storage;
    }
    async uploadEventImage(file) {
        let file_name = this.validate(file.name) + Date.now().toString();
        let file_path = `event_photos/${file_name}.${file.type.split("/")[1]}`;
        let ref = this.storage.ref(file_path);
        await ref.put(file);
        return file_path;
    }
    async getImage(path) {
        let ref = this.storage.ref(path);
        return await ref.getDownloadURL();
    }
    validate(name) {
        return name.replaceAll("/", "_");
    }
}
let db_wrapper = new FirebaseDBWrapper(db);
let auth_wrapper = new FirebaseAuthWrapper(auth, db_wrapper);
let storage_wrapper = new FirebaseStorageWrapper(storage);
auth.onAuthStateChanged(async (user) => {
    if (user) {
        console.log(auth.currentUser);
        let current_hours = await db_wrapper.getCurrentHours();
        auth.currentUser.name = current_hours.name;
        document.querySelectorAll(".signin-open").forEach((e) => e.innerText = "PROFILE");
        signinForm.style.display = "none";
        profileInfo.style.display = "flex";
        auth.currentUser.uid = user.uid;
        document.querySelector(".profile-info > div > h3").innerText = current_hours.name;
        document.querySelector(".confirmed-hours").innerText = `${current_hours.hours} confirmed`;
        document.querySelector(".pending-hours").innerText = `${current_hours.pending_hours} pending`;
    }
    else {
        document.querySelectorAll(".signin-open").forEach((e) => e.innerText = "SIGN IN");
        signinForm.style.display = "block";
        profileInfo.style.display = "none";
    }
});
function createElement(type, classNames = [], text = "") {
    let temp = document.createElement(type);
    classNames.forEach(name => {
        temp.classList.add(name);
    });
    if (text) {
        temp.innerText = text;
    }
    return temp;
}

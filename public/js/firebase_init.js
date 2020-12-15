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
        let event_ref = this.db.doc(`/events/${event_id}`);
        let event = await event_ref.get();
        return await event.exists;
    }
    async createSignupForEvent(event_id) {
        if (!auth.currentUser)
            throw "Not signed in";
        let doc_ref = this.db.doc(`/events/${auth.currentUser.uid}_${event_id}`);
        return doc_ref.set({
            "event_id": event_id,
            "uid": auth.currentUser.uid
        });
    }
    async getCurrentHours() {
        if (!auth.currentUser)
            throw "Not signed in";
        let doc_ref = this.db.doc(`/hours/${auth.currentUser.uid}`);
        let hours = await doc_ref.get();
        return this.addIdToData(hours);
    }
    async createHoursRequest(hours, hours_request) {
        if (!auth.currentUser)
            throw "Not signed in";
        let pending_request_ref = this.db.collection("pending").doc();
        let member_hours_ref = this.db.doc(`/pending/${auth.currentUser.uid}`);
        let batch = this.db.batch();
        batch.set(pending_request_ref, hours_request);
        batch.update(member_hours_ref, {
            "pending_hours": firebase.firestore.FieldValue.increment(hours)
        });
        return batch.commit();
    }
    async getCurrentInformation() {
        if (!auth.currentUser)
            throw "Not signed in";
        let member_info_ref = this.db.doc(`/members/${auth.currentUser.uid}`);
        let member_info = await member_info_ref;
        return this.addIdToData(member_info);
    }
    async updateCurrentInformation(member_info) {
        if (!auth.currentUser)
            throw "Not signed in";
        let member_info_ref = this.db.doc(`/members/${auth.currentUser.uid}`);
        return member_info_ref.update(member_info);
    }
    async getTeamMembers() {
        let team_members_ref = this.db.collection("/team_members");
        let team_members = team_members_ref.get();
        let data = [];
        team_members.forEach(member => {
            data.push(this.addIdToData(member));
        });
        return data;
    }
    addIdToData(snapshot) {
        let temp = snapshot.data();
        temp.doc_id = snapshot.id;
        return temp;
    }
}
class FirebaseStorageWrapper {
}

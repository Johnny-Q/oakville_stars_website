const firebaseConfig = {
    apiKey: "AIzaSyDkn3sh33RTb6nRPtNAD9p-JZc6Qbb-frg",
    authDomain: "test-json-cbef3.firebaseapp.com",
    databaseURL: "https://test-json-cbef3.firebaseio.com",
    projectId: "test-json-cbef3",
    storageBucket: "test-json-cbef3.appspot.com",
    messagingSenderId: "610759909312",
    appId: "1:610759909312:web:e3fb6f03a77529824a7225"
};

// Initialize Firebase
//@ts-expect-error
firebase.initializeApp(firebaseConfig);

//@ts-expect-error
const auth = firebase.auth();
//signInWithEmailAndPassword
//createUserWithEmailAndPassword

//@ts-expect-error
const db = firebase.firestore();
//@ts-expect-error
const storage = firebase.storage();

//update user events if we're signed in
// auth.onAuthStateChanged(user=>{
//     if(user){
//         //try to get resources
//         console.log("user signed in", user.uid);

//     }else{
//         //not signed in
//         console.log("no user");
//     }
// });

/**
 * @description simple CRUD wrapper functions to abstract working with firestore
 * @todo focus on reading first
 * 
 */
class FirebaseDBWrapper {
    db;
    constructor(db) {
        this.db = db;
    }
    /*
    .collection("collection_name").doc("doc_name");
    .doc("collection_name/doc_name");
    */

    //----------   EVENTS LOGIC   ---------------
    /**
     * 
     * @param limit 
     * @param startAfterId doc_id of the last event gotten
     */
    async getUpcomingEvents(limit = 0, startAfterId: string = ""): Promise<Array<any>> {
        //base query, if there is pagination, will build up on it
        var query = this.db.collection("events").where("unix", ">", Date.now()).orderBy("unix");
        if (startAfterId) {
            let snapshot = await this.db.doc(`/events/${startAfterId}`).get();
            query = query.startAfter(snapshot);
        }
        if (limit) {
            query = query.limit(limit);
        }
        let event_refs = (await query.get()).docs;
        let event_data: Array<EventDetails> = [];
        event_refs.forEach(event => {
            event_data.push(this.addIdToData(event));
        });
        return event_data;
        // return [event_data, event_refs[event_refs.length - 1]];
        // return event_refs;
    }

    /**
     * @returns returns the data as well as the doc reference to the last doc so other objects can update their pagination
     * @param startAfterId 
     * @param limit 
     */
    async getPastEvents(limit = 0, startAfterId = ""): Promise<Array<any>> {
        //base query, if there is pagination, will build up on it
        var query = this.db.collection("events").where("unix", "<=", Date.now()).orderBy("unix");
        if (startAfterId) {
            let snapshot = await this.db.doc(`/events/${startAfterId}`).get();
            query = query.startAfter(snapshot);
        }
        if (limit) {
            query = query.limit(limit);
        }
        let event_refs = (await query.get()).docs;
        let event_data: Array<EventDetails> = [];
        event_refs.forEach(event => {
            event_data.push(this.addIdToData(event));
        });
        return event_data;
        // return [event_data, event_refs[event_refs.length - 1]];
        // return event_refs;w
    }

    /**
     * returns the event data in json format for a specfied event
     * @param event_id the firebase doc id for the event
     */
    async getEventData(event_id): Promise<EventDetails> {
        let doc = this.db.doc(`/events/${event_id}`);
        let event = await doc.get();

        if (event.exists) {
            return this.addIdToData(event);
        } else {
            throw "doesn't exist";
        }
    }

    /**
     * will only run if signed up, will throw an error if the user is not signed up
     * @param event_id doc id of the event
     */
    async isSignedUp(event_id): Promise<Boolean> {
        if (!auth.currentUser) throw "Not signed in";
        let event_ref = this.db.doc(`/events/${event_id}`);
        let event = await event_ref.get();
        return await event.exists;
    }

    /**
     * creates a doc
     * @param event_id firebase doc id of the event
     */
    async createSignupForEvent(event_id): Promise<any> {
        if (!auth.currentUser) throw "Not signed in";
        let doc_ref = this.db.doc(`/events/${auth.currentUser.uid}_${event_id}`);
        return doc_ref.set({
            "event_id": event_id,
            "uid": auth.currentUser.uid
        });
    }

    //-----------  MEMBER ACCOUNT LOGIC  -----------
    async getCurrentHours(): Promise<MemberHours> {
        if (!auth.currentUser) throw "Not signed in";

        let doc_ref = this.db.doc(`/hours/${auth.currentUser.uid}`);
        let hours = await doc_ref.get();

        return this.addIdToData(hours);
    }

    async createHoursRequest(hours: number, hours_request: HourRequest): Promise<any> {
        if (!auth.currentUser) throw "Not signed in";
        //create a doc with an autogenerated id for use in the batched write
        let pending_request_ref = this.db.collection("pending").doc();
        let member_hours_ref = this.db.doc(`/pending/${auth.currentUser.uid}`);

        let batch = this.db.batch();
        batch.set(pending_request_ref, hours_request);
        batch.update(member_hours_ref, {
            //@ts-expect-error
            "pending_hours": firebase.firestore.FieldValue.increment(hours)
        });

        return batch.commit();
    }

    async getCurrentInformation(): Promise<MemberInformation> {
        if (!auth.currentUser) throw "Not signed in";

        let member_info_ref = this.db.doc(`/members/${auth.currentUser.uid}`);
        let member_info = await member_info_ref;

        return this.addIdToData(member_info);
    }

    async updateCurrentInformation(member_info: MemberInformation): Promise<any> {
        if (!auth.currentUser) throw "Not signed in";

        let member_info_ref = this.db.doc(`/members/${auth.currentUser.uid}`);

        return member_info_ref.update(member_info);
    }

    //------------ TEAM MEMBER LOGIC ------------
    /**
     * might replace this for static implementation
     */
    async getTeamMembers(): Promise<Array<TeamMember>> {
        let team_members_ref = this.db.collection("/team_members");
        let team_members = team_members_ref.get();
        let data = [];

        team_members.forEach(member => {
            data.push(this.addIdToData(member));
        });

        return data;
    }

    addIdToData(snapshot): any{
        let temp = snapshot.data();
        temp.doc_id = snapshot.id;
        return temp;
    }
}

/**
 * @description handle retreiving photos and uploading photos
 */
class FirebaseStorageWrapper {

}

/**
 * @param date the iso date format of the event
 * @param dateString the custom displayed datestring
 * 
 */
interface EventDetails {
    doc_id: string,
    date: string,
    dateString: string,
    description: string,
    event_name: string,
    photo_url: string,
    unix: number
}

interface MemberInformation {

}

interface HourRequest {
    doc_id: string,
    details: string,
    hours: number,
    name: string,
    uid: string
}

interface MemberHours {
    doc_id: string,
    name: string,
    pending_hours: number,
    hours: number
}

/**
 * [user id]_[event id]
 */
interface Signup {
    doc_id: string,
    event_id: string,
    uid: string
}

interface TeamMember {
    doc_id: string,
    name: string,
    image_url: string
}
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
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

//users
//add hours to pending
//add document
function addPending(uid, hours) {
    db.collection("pending").add({
        "uid": uid,
        "hours": hours
    });
    db.collection("hours").doc(uid).update({
        "pending_hours": firebase.firestore.FieldValue.increment(hours)
    });
}

//sign up for events
//add document to intermediate table
function signUp(uid, event_id) {
    db.collection("signups").doc(`${uid}_${event_id}`).set({
        "uid": uid,
        "event_id": event_id
    })
}

//get current hours
//query hours collection
function getCurrentHours(uid) {
    db.collection("hours").doc(uid).get().then(function (doc) {
        if (doc.exists) {
            console.log("document data", doc.data());
        } else {
            console.log("no doc");
        }
    }).catch(err => {
        console.log(err);
    });
}

//admin
//add/remove events
function addEvent(name, day, month, year) {
    var d = new Date(`${year}-${month}-${day}T00:00:00`);
    db.collection("events").add({
        "name": name,
        "date": d
    })
}
function removeEvent(event_id) {
    db.collection("events").doc(event_id).delete().then(() => {
        console.log("event deleted");
    }).catch(err => {
        console.log("couldn't remove", event_id, err);
    });
}

//get pending hours
function getPending() {
    db.collection("pending").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
    });
}

//authorize / unauthorize pending hours
//make this into a transaction
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
    }).then(() => {
        console.log("success")
        //delete elements on screen
    }).catch(err=>{
        console.log("unsucessful", err);
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
    }).then(() => {
        console.log("success")
        //delete elements on screen
    }).catch(err=>{
        console.log("unsucessful", err);
    });
}
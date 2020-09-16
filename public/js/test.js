//users
//add hours to pending
//add document
function requestHours(uid, hours) {
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
function generateRandomEvents(amount = 0) {
    while (amount--) {
        var date = faker.date.future();
        var dateString = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
        var unix = date.getTime();

        var img_src = faker.image.image();

        var title = faker.lorem.word();
        var desc = faker.lorem.paragraph();


        addEvent(img_src, dateString, unix, title, desc);
    }
    // console.log(img_src, dateString, unix, title, desc);
}



// function addEvent(name, day, month, year) {
//     var d = new Date(`${year}-${month}-${day}T00:00:00`);
//     db.collection("events").add({
//         "name": name,
//         "date": d
//     })
// }
function addEvent(img_src, dateString, unix, title, description, count = 0) {
    db.collection("events").add({
        "photo_url": img_src,
        "dateString": dateString,
        "unix": unix,
        "event_name": title,
        "description": description,
        "member_count": count
    });
}
function removeEvent(event_id) {
    db.collection("events").doc(event_id).delete().then(() => {
        console.log("event deleted");
    }).catch(err => {
        console.log("couldn't remove", event_id, err);
    });
}

function getEvents() {
    db.collection("events").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            console.log(doc.id, " => ", doc.data().event_name);
        })
    })
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
    }).catch(err => {
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
    }).catch(err => {
        console.log("unsucessful", err);
    });
}
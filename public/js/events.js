/*
<div class="card">
    <div class="card-header">
        <img src="IMG SRC"alt="">
    </div>
    <div class="card-body">
        <small>DATE</small>
        <h3>TITLE</h3>
        <p>DESCTIPTION</p>
    </div>
    <button class="action-button">
        Sign Up
    </button>
</div>
*/
window.onload = function () {
    getCards(true, 6);
    getLists(true, 3);
}

const cardContainer = document.querySelector(".card-container");
const listContainer = document.querySelector(".list-container");

//for pagination
var lastCard = null;
var lastList = null;

document.querySelector(".current-events-paginate").onclick = () => {
    getCards(true, 3);
};

document.querySelector(".past-events-paginate").onclick = () => {
    getLists(true, 3);
};

function renderCard(img_src, dateString, title, description, eventID, signedup = false) {
    var cardDiv = createElement("div", "card");
    var cardHeader = createElement("div", "card-header");
    var cardBody = createElement("div", "card-body");
    var button = createElement("button", "action-button", signedup ? "Unregister" : "Sign Up");

    if (signedup) {
        button.classList.add("disabled");
        button.onclick = unregisterClick;
    } else {
        button.onclick = signUpClick;
    }

    function unregisterClick(event) {
        console.log("asdf");
        if (Object.keys(currUser).length > 0) {
            unregister(eventID, currUser.uid).then(() => {
                button.classList.remove("disabled");
                button.innerText = "Sign Up";
                button.onclick = signUpClick;
            });
        }
    }
    function signUpClick(event) {
        console.log("ree");
        if (Object.keys(currUser).length > 0) {
            signUp(eventID, currUser.uid).then(() => {
                button.classList.add("disabled");
                button.innerText = "Unregister";
                button.onclick = unregisterClick;
            });
        } else {
            console.log("no user");
        }
    }

    var img = document.createElement("img"); img.src = img_src;
    cardHeader.append(img);

    var date = createElement("small", "", dateString);
    var eventName = createElement("h3", "", title);
    var desc = createElement("p", "", description);
    cardBody.append(date); cardBody.append(eventName); cardBody.append(desc);

    cardDiv.append(cardHeader); cardDiv.append(cardBody); cardDiv.append(button);

    cardContainer.append(cardDiv);
}


function renderList(dateString, title, description) {
    var list = createElement("div", "list");
    var date = createElement("h1", "date", dateString);
    var details = createElement("div", "details");

    var eventName = createElement("h3", "", title);
    var desc = createElement("p", "", description);

    details.append(eventName); details.append(desc);

    list.append(date); list.append(details);

    listContainer.append(list);
}

//firebase functions
function getCards(paginate = false, limit = 3) {
    var query = db.collection("events").where("unix", ">=", Date.now()).orderBy("unix");
    var error = false;
    if (paginate) {
        if (lastCard !== null) {
            console.log("applied start After");
            try {
                query = query.startAfter(lastCard);
            } catch (err) {
                error = true;
            }
        }
        if (!error) {
            query = query.limit(limit);
        } else {
            document.querySelector(".current-events-paginate").style.display = "none";
        }
    }
    if (!error) {
        query.get()
            .then(qs => {
                lastCard = qs.docs[qs.docs.length - 1];
                qs.forEach(d => {
                    var data = d.data();
                    //check if the user is signed up for this event
                    if (auth.currentUser != null) {
                        console.log("checking");
                        db.collection("signups").doc(`${auth.currentUser.uid}_${d.id}`).get().then(doc => {
                            if (doc.exists) {
                                console.log("detected sign up");
                                renderCard(data.photo_url, data.dateString, data.event_name, data.description, d.id, true);
                            } else {
                                renderCard(data.photo_url, data.dateString, data.event_name, data.description, d.id);
                            }
                        })
                    } else {
                        renderCard(data.photo_url, data.dateString, data.event_name, data.description, d.id);
                    }
                })
            });
    }
}


function getLists(paginate = false, limit = 3) {
    var query = db.collection("events").where("unix", "<=", Date.now())
        .orderBy("unix");
    var error = false;
    if (paginate) {
        query = query.limit(limit);
        if (lastList !== null) {
            console.log("applied start After");
            try {
                query = query.startAfter(lastCard);
            } catch (err) {
                error = true;
            }
        }
        if (!error) {
            query = query.limit(limit);
        } else {
            document.querySelector(".past-events-paginate").style.display = "none";
        }
    }
    if (!error) {
        query.get()
            .then(qs => {
                lastList = qs.docs[qs.docs.length - 1];
                qs.forEach(d => {
                    var data = d.data();
                    renderList(data.dateString, data.event_name, data.description);
                })
            });
    }
}

function signUp(eventID, userID) {
    return db.collection("signups").doc(`${userID}_${eventID}`).set({
        "uid": userID,
        "event_id": eventID
    });
}

function unregister(eventID, userID) {
    return db.collection("signups").doc(`${userID}_${eventID}`).delete();
}

function createElement(type, className = "", text = "") {
    var temp = document.createElement(type);
    if (className) temp.classList.add(className);
    if (text) temp.innerText = text;
    return temp;
}
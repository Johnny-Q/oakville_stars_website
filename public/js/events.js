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
    renderCards(true, 6);
    renderLists(true, 3);
}

const cardContainer = document.querySelector(".card-container");
const listContainer = document.querySelector(".list-container");

var lastCard = null;
var lastList = null;

function createCard(img_src, dateString, title, description, signedup = false) {
    var cardDiv = createElement("div", "card");
    var cardHeader = createElement("div", "card-header");
    var cardBody = createElement("div", "card-body");
    var button = createElement("button", "action-button", signedup?"Signed Up":"Sign Up");

    var img = document.createElement("img"); img.src = img_src;
    cardHeader.append(img);

    var date = createElement("small", "", dateString);
    var eventName = createElement("h3", "", title);
    var desc = createElement("p", "", description);
    cardBody.append(date); cardBody.append(eventName); cardBody.append(desc);

    cardDiv.append(cardHeader); cardDiv.append(cardBody); cardDiv.append(button);

    cardContainer.append(cardDiv);
}

function createList(dateString, title, description) {
    var list = createElement("div", "list");
    var date = createElement("h1", "date", dateString);
    var details = createElement("div", "details");

    var eventName = createElement("h3", "", title);
    var desc = createElement("p", "", description);

    details.append(eventName); details.append(desc);

    list.append(date); list.append(details);

    listContainer.append(list);
}

function createElement(type, className = "", text = "") {
    var temp = document.createElement(type);
    if (className) temp.classList.add(className);
    if (text) temp.innerText = text;
    return temp;
}

function renderCards(paginate = false, limit = 3) {
    var query = db.collection("events").where("unix", ">=", Date.now()).orderBy("unix");

    if (paginate) {
        if (lastCard !== null) {
            console.log("applied start After");
            query = query.startAfter(lastCard);
        }
        query = query.limit(limit);
    }
    query.get()
        .then(qs => {
            lastCard = qs.docs[qs.docs.length - 1];
            qs.forEach(d => {
                var data = d.data();
                //check if the user is signed up for this event
                if (auth.currentUser != null) {
                    console.log("checking");
                    db.collection("signups").doc(`${auth.currentUser.uid}_${d.id}`).get().then(doc=>{
                        if(doc.exists){
                            console.log("detected sign up");
                            createCard(data.photo_url, data.dateString, data.event_name, data.description, true);
                        }else{
                            createCard(data.photo_url, data.dateString, data.event_name, data.description);
                        }
                    })
                } else {
                    createCard(data.photo_url, data.dateString, data.event_name, data.description);
                }
            })
        });
}


function renderLists(paginate = false, limit = 3) {
    var query = db.collection("events").where("unix", "<=", Date.now())
        .orderBy("unix")
    if (paginate) {
        query = query.limit(limit);
        if (lastList !== null) {
            console.log("applied start After");
            query = query.startAfter(lastList);
        }
    }
    query.get()
        .then(qs => {
            lastList = qs.docs[qs.docs.length - 1];
            qs.forEach(d => {
                var data = d.data();
                createList(data.dateString, data.event_name, data.description);
            })
        });
}

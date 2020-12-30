let events_grid = document.querySelector(".event_grid");
let events_row = document.querySelectorAll(".event_grid")[1];
let past_events_startAfter = "";
let isPlaceholderHidden = false;
let placeholder = document.querySelector(".no_results");
let paginate_button = document.querySelector("#past_events_paginate");
async function renderGridEvent(event_details, signedUp) {
    let event = createElement("div", ["event"]);
    let div_img = createElement("div", ["img"]);
    let img = createElement("img");
    img.src = await storage_wrapper.getImage(event_details.photo_url);
    div_img.append(img);
    let card_body = createElement("div", ["card_body"]);
    let desc_div = createElement("div", ["description"]);
    let header = createElement("div", ["header"]);
    let title = createElement("h2");
    title.innerText = event_details.event_name;
    let date_string = createElement("h3");
    date_string.innerText = event_details.dateString;
    header.append(title, date_string);
    let description = createElement("p");
    description.innerText = event_details.description;
    desc_div.append(header, description);
    let signup = createElement("button", ["action_button"]);
    if (signedUp) {
        signup.innerText = "Unregister";
        signup.classList.add("disabled");
        signup.onclick = unregister;
    }
    else {
        signup.innerText = "Register";
        signup.onclick = register;
    }
    card_body.append(desc_div, signup);
    event.append(div_img, card_body);
    function register() {
        if (auth.currentUser) {
            db_wrapper.createSignupForEvent(event_details.doc_id).then(() => {
                signup.classList.add("disabled");
                signup.innerText = "Unregister";
                signup.onclick = unregister;
            });
        }
    }
    function unregister() {
        if (auth.currentUser) {
            db_wrapper.deleteSignupForEvent(event_details.doc_id).then(() => {
                signup.classList.remove("disabled");
                signup.innerText = "Register";
                signup.onclick = register;
            });
        }
    }
    return event;
}
function renderRowEvent(event_details) {
    let event = createElement("div", ["event"]);
    let date_string = createElement("h1", ["date_string"]);
    date_string.innerText = event_details.dateString;
    let row_body = createElement("div", ["row_body"]);
    let header = createElement("div", ["header"]);
    let title = createElement("h3");
    title.innerText = event_details.event_name;
    let description = createElement("p");
    description.innerText = event_details.description;
    header.append(title);
    row_body.append(header, description);
    event.append(date_string, row_body);
    return event;
}
function renderPastEvent(event_details) {
    let event = createElement("div", ["event"]);
    let div_img = createElement("div", ["img"]);
    let img = createElement("img");
    storage_wrapper.getImage(event_details.photo_url).then(url => {
        img.src = url;
    });
    div_img.append(img);
    let card_body = createElement("div", ["card_body"]);
    let desc_div = createElement("div", ["description"]);
    let header = createElement("div", ["header"]);
    let title = createElement("h2");
    title.innerText = event_details.event_name;
    let date_string = createElement("h3");
    date_string.innerText = event_details.dateString;
    header.append(title, date_string);
    let description = createElement("p");
    description.innerText = event_details.description;
    desc_div.append(header, description);
    card_body.append(desc_div);
    event.append(div_img, card_body);
    return event;
}
auth.onAuthStateChanged(user => {
    db_wrapper.getUpcomingEvents().then(events => {
        if (!events.length) {
            placeholder.style.display = "block";
        }
        events.forEach(async (event_details) => {
            console.log(event_details);
            let signedUp = false;
            if (user) {
                signedUp = await db_wrapper.isSignedUp(event_details.doc_id);
            }
            events_grid.append(await renderGridEvent(event_details, signedUp));
        });
    });
    db_wrapper.getPastEvents(3).then(events => {
        if (!events.length) {
            document.querySelectorAll(".section_title")[1].style.display = "none";
            return;
        }
        events.forEach(event_details => {
            events_row.append(renderPastEvent(event_details));
        });
        if (events.length == 3) {
            past_events_startAfter = events[events.length - 1].doc_id;
            console.log(past_events_startAfter);
        }
    });
});
paginate_button.onclick = () => {
    db_wrapper.getPastEvents(3, past_events_startAfter).then(events => {
        if (!past_events_startAfter)
            return;
        if (!events.length) {
            past_events_startAfter = "";
            paginate_button.remove();
            return;
        }
        events.forEach(event_details => {
            events_row.append(renderPastEvent(event_details));
        });
        if (events.length == 3) {
            past_events_startAfter = events[events.length - 1].doc_id;
            console.log(past_events_startAfter);
        }
        else {
            past_events_startAfter = "";
            paginate_button.remove();
        }
    });
};

let events_grid = document.querySelector(".event_grid");
//@ts-expect-error
// let events_row = document.querySelector(".events_row") as HTMLElement;
let events_row = document.querySelectorAll(".event_grid")[1] as HTMLElement;
let past_events_startAfter = "";
//@ts-expect-error
let isPlaceholderHidden = false;
//@ts-expect-error
let placeholder = document.querySelector(".no_results") as HTMLElement; //No results message
let paginate_button = document.querySelector("#past_events_paginate");

async function renderGridEvent(event_details: EventDetails, signedUp: boolean) {
    /*
    <div class="event">
        <div class="img">
            <img src="https://firebasestorage.googleapis.com/v0/b/test-json-cbef3.appspot.com/o/hero.JPG?alt=media&token=fa00476f-e030-461d-80b2-09a3c654d80d"
                alt="">
        </div>
        <div class="card_body">
            <div class="description">
                <h2>Title</h2>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda enim corporis minima qui
                    sed.
                    Dignissimos nihil fugiat repudiandae aspernatur iste officia natus ipsam, vitae deleniti cum
                    ab
                    omnis voluptatem libero delectus id beatae, aliquid tempora accusantium! Eum exercitationem
                    vitae doloribus autem, tempora modi maiores, sapiente necessitatibus similique, est in non!
                </p>
            </div>
            <button class="action_button">Sign Up</button>
        </div>
    </div>
    */
    let event = createElement("div", ["event"]);
    let div_img = createElement("div", ["img"]);
    let img = createElement("img") as HTMLImageElement;
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

    // events_grid.append(event);

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

//@ts-expect-error
function renderRowEvent(event_details: EventDetails) {
    /*
    <div class="event">
        <h1 class="date_string">
            December 25th, 2020
        </h1>
        <div class="row_body">
            <div class="header">
                <h3>Title</h3>
                <h3>xx:xx-xx:xx</h3>
            </div>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt, amet! Iste, at ex. Pariatur
                odio
                autem eveniet nihil facilis consequuntur minus enim ratione quas quod optio quam placeat ea
                alias
                adipisci consequatur officiis vel, dolorem amet, laboriosam laborum animi. Quia quibusdam natus
                voluptatem dicta nemo temporibus reprehenderit! Amet, quis necessitatibus.
            </p>
        </div>
    </div>
    */
    let event = createElement("div", ["event"]);
    let date_string = createElement("h1", ["date_string"]);
    date_string.innerText = event_details.dateString;
    let row_body = createElement("div", ["row_body"]);
    let header = createElement("div", ["header"]);
    let title = createElement("h3");
    title.innerText = event_details.event_name;
    // let time = createElement("h3");
    let description = createElement("p");
    description.innerText = event_details.description;

    header.append(title);
    row_body.append(header, description);

    event.append(date_string, row_body);

    // events_row.append(event);
    return event
}

function renderPastEvent(event_details: EventDetails): HTMLElement{
    let event = createElement("div", ["event"]);
    let div_img = createElement("div", ["img"]);
    let img = createElement("img") as HTMLImageElement;
    storage_wrapper.getImage(event_details.photo_url).then(url=>{
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
    //load the events on page
    db_wrapper.getUpcomingEvents().then(events => {
        if (!events.length) {
            placeholder.style.display = "block";
            // isPlaceholderHidden = true;
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
            //@ts-expect-error
            document.querySelectorAll(".section_title")[1].style.display = "none";
            return;
        }
        events.forEach(event_details => {
            // console.log(event_details);
            // renderRowEvent(event_details);
            events_row.append(renderPastEvent(event_details));
        });
        
        if(events.length == 3){
            //set the paginate
            past_events_startAfter = events[events.length-1].doc_id;
            console.log(past_events_startAfter);
        }
    });
})

paginate_button.onclick = ()=>{
    db_wrapper.getPastEvents(3, past_events_startAfter).then(events => {
        if(!past_events_startAfter) return;
        if (!events.length) {
            past_events_startAfter = "";
            paginate_button.remove();
            return;
        }
        events.forEach(event_details => {
            // console.log(event_details);
            // renderRowEvent(event_details);
            events_row.append(renderPastEvent(event_details));
        });
        
        if(events.length == 3){
            //set the paginate
            past_events_startAfter = events[events.length-1].doc_id;
            console.log(past_events_startAfter);
        }else{ //if we get less than 3 events, it means we've reached the end
            past_events_startAfter = "";
            paginate_button.remove();
        }
    });
}
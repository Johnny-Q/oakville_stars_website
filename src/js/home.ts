//load the dynamic hero image
let hero_img = document.querySelector(".hero > img") as HTMLImageElement;
storage_wrapper.getImage("hero.jpg").then(url => {
    console.log(url);
    hero_img.src = url;
});

//@ts-expect-error
let isPlaceholderHidden = false;
//@ts-expect-error
let placeholder = document.querySelector(".no_results") as HTMLElement;
//load the events on page
db_wrapper.getUpcomingEvents(3).then(events => {
    if (!events.length) {
        placeholder.style.display = "block";
    }
    events.forEach(event_details => {
        console.log(event_details);
        renderRowEvent(event_details);
    });
});

//@ts-expect-error
let events_row = document.querySelector(".events_row");
//@ts-ignore
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

    events_row.append(event);
}

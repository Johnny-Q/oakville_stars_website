let hero_img = document.querySelector(".hero > img");
storage_wrapper.getImage("hero.jpg").then(url => {
    console.log(url);
    hero_img.src = url;
});
let isPlaceholderHidden = false;
let placeholder = document.querySelector(".no_results");
db_wrapper.getUpcomingEvents(3).then(events => {
    if (!events.length) {
        placeholder.style.display = "block";
    }
    events.forEach(event_details => {
        console.log(event_details);
        renderRowEvent(event_details);
    });
});
let events_row = document.querySelector(".events_row");
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
    events_row.append(event);
}

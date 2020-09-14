var authorizeHTML = `<button class="action-button">AUTHORIZE</button><button class="action-button delete-button"><svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path class="fill-path" fill-rule="evenodd" clip-rule="evenodd"d="M11.43 1.897H15.31C15.7 1.897 16 2.217 16 2.606C16 2.994 15.7 3.291 15.31 3.291H14.47L13.6 13.92C13.58 15.177 12.57 16.183 11.31 16.183H4.66C3.41 16.183 2.4 15.177 2.38 13.92L1.53 3.269H0.69C0.3 3.269 0 2.971 0 2.583C0 2.194 0.3 1.897 0.69 1.897H4.57V1.051C4.57 0.457 5.12 0 5.81 0H10.19C10.88 0 11.43 0.457 11.43 1.051V1.897ZM10.06 1.371H5.94V1.897H10.06V1.371ZM6.22 12.503H6.19C5.83 12.503 5.53 12.206 5.51 11.84L5.26 6.263C5.23 5.874 5.53 5.554 5.92 5.554H5.94C6.31 5.554 6.61 5.851 6.63 6.217L6.88 11.794C6.88 12.16 6.61 12.48 6.22 12.503ZM9.81 12.503C10.17 12.503 10.47 12.206 10.49 11.84L10.74 6.263C10.74 5.897 10.47 5.577 10.08 5.554H10.06C9.69 5.554 9.39 5.851 9.37 6.217L9.12 11.794C9.12 12.16 9.39 12.48 9.78 12.503H9.81Z"fill="#242424"></path></svg></button>`;
var editHTML = `<button class="action-button">EDIT</button><button class="action-button delete-button"><svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path class="fill-path" fill-rule="evenodd" clip-rule="evenodd"d="M11.43 1.897H15.31C15.7 1.897 16 2.217 16 2.606C16 2.994 15.7 3.291 15.31 3.291H14.47L13.6 13.92C13.58 15.177 12.57 16.183 11.31 16.183H4.66C3.41 16.183 2.4 15.177 2.38 13.92L1.53 3.269H0.69C0.3 3.269 0 2.971 0 2.583C0 2.194 0.3 1.897 0.69 1.897H4.57V1.051C4.57 0.457 5.12 0 5.81 0H10.19C10.88 0 11.43 0.457 11.43 1.051V1.897ZM10.06 1.371H5.94V1.897H10.06V1.371ZM6.22 12.503H6.19C5.83 12.503 5.53 12.206 5.51 11.84L5.26 6.263C5.23 5.874 5.53 5.554 5.92 5.554H5.94C6.31 5.554 6.61 5.851 6.63 6.217L6.88 11.794C6.88 12.16 6.61 12.48 6.22 12.503ZM9.81 12.503C10.17 12.503 10.47 12.206 10.49 11.84L10.74 6.263C10.74 5.897 10.47 5.577 10.08 5.554H10.06C9.69 5.554 9.39 5.851 9.37 6.217L9.12 11.794C9.12 12.16 9.39 12.48 9.78 12.503H9.81Z"fill="#242424"></path></svg></button>`;

const pendingContainer = document.querySelector(".pending-container");
const eventsContainer = document.querySelector(".events_admin-container");

function createPending(id, name, hours) {
    var pending = createElement("div", ["pending"]);
    var checkbox = document.createElement("input"); checkbox.type="checkbox";
    var memberNameDiv = createElement("div", ["member-name", "labelled-text"]);
    var hoursDiv = createElement("div", ["hours", "labelled-text"]);
    var btnGroup = createElement("div", ["btn-group"]);
    btnGroup.innerHTML = authorizeHTML;

    var memID = createElement("small", [], `ID: ${id}`);
    var n = createElement("h1", [], name);

    var hourLabel = createElement("small", [], "HOURS");
    var h = createElement("h1", [], hours);

    memberNameDiv.append(memID); memberNameDiv.append(n);

    hoursDiv.append(hourLabel); hoursDiv.append(h);

    pending.append(checkbox); pending.append(memberNameDiv); pending.append(hoursDiv); pending.append(btnGroup);

    pendingContainer.append(pending);
}

function createEvent(id, name, dateString, count) {
    var events_admin = createElement("div", ["events_admin"]);
    var checkbox = document.createElement("input"); checkbox.type = "checkbox";
    var eventNameDiv = createElement("div", ["name", "labelled-text"]);
    var dateDiv = createElement("div", ["date", "labelled-text"]);
    var countDiv = createElement("div", ["count", "labelled-text"]);
    var btnGroup = createElement("div", ["btn-group"]);
    btnGroup.innerHTML = editHTML;
    
    //name div
    eventNameDiv.append(createElement("small", [], `ID: ${id}`));
    eventNameDiv.append(createElement("h2", [], name));

    //date div
    dateDiv.append(createElement("small", [], "DATE"));
    dateDiv.append(createElement("p", [], dateString));

    //count div
    countDiv.append(createElement("small", [], "MEMBERS"));
    countDiv.append(createElement("p", [], count));

    events_admin.append(checkbox);events_admin.append(eventNameDiv);events_admin.append(dateDiv);events_admin.append(countDiv);events_admin.append(btnGroup);

    eventsContainer.append(events_admin);
}

function createElement(type, className = [], text = "") {
    var temp = document.createElement(type);
    console.log(className);
    if (className.length) {
        className.forEach(cn => temp.classList.add(cn));
    }
    if (text) temp.innerText = text;
    return temp;
}

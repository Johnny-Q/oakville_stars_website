const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser");
const admin = require("firebase-admin");
const csrf = require("csurf");
const faker = require("faker");
//middlewares
app.use(bodyparser.json());
app.use(cookieparser());
// app.use(csrf({ cookie: true }));

//rendering
app.engine("html", require("ejs").renderFile);
app.use(express.static("public"));
app.set("views", "public/views");

//csrf
// app.all("*", (req, res, next) => {
//     res.cookie("XSRF-TOKEN", req.csrfToken());
//     next();
// });

//static pages
app.get("/", (req, res) => {
    res.render("home.html");
});
app.get("/contact", (req, res) => {
    res.render("contact.html");
});
app.get("/fonts", (req, res) => {
    res.render("fonts.html");
});
app.get("/admin", (req, res) => {
    res.render("admin.html");
});
app.get("/events", (req, res) => {
    res.render("events.html");
});
app.get("/about", (req, res) => {
    res.render("about.html");
});
app.get("/register", (req, res) => {
    res.render("register.html");
});
app.get("/member_information", (req, res) => {
    res.render("member_information.html");
});

//components
let component_names = [
    "hero",
    "desktop_nav",
    "team_grid",
    "events_grid",
    "events_row",
    "blank",
    "mobile_nav",
    "account_popup",
    "modals"
];
component_names.forEach(name => {
    app.get(`/components/${name}`, (req, res) => {
        res.render(`./components/${name}.html`);
    });
});

let form_component_names = [
    "labelled_input"
];
form_component_names.forEach(name => {
    app.get(`/components/form/${name}`, (req, res) => {
        res.render(`./components/form/${name}.html`);
    });
});

app.listen(3000, () => {
    console.log("started on port 3000");
});
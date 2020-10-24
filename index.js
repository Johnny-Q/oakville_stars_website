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
app.set("views", "public/");

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
app.get("/about", (req, res)=>{
    res.render("about.html");
});
app.get("/register", (req, res)=>{
    res.render("register.html");
});

//components
app.get("/signin", (req, res)=>{
    res.render("signin.html");
});
app.get("/copy", (req, res)=>{
    res.render("copy.html");
});
app.get("/elements", (req, res)=>{
    res.render("form_elements.html");
});
app.get("/modal", (req, res)=>{
    res.render("modal.html");
});
app.listen(3000);
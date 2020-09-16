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
app.use(csrf({ cookie: true }));

//rendering
app.engine("html", require("ejs").renderFile);
app.use(express.static("public"));

//csrf
app.all("*", (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
});

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

//components
app.get("/modal", (req, res)=>{
    res.render("modal.html");
});
app.get("/new_event", (req, res)=>{
    res.render("newevent.html");
});

//signup
app.get("/signup", (req, res) => {
    res.render("signup.html");
});
app.post("/signup", (req, res) => {

});

//login
app.get("/login", (req, res) => {
    const idToken = req.body.idToken.toString();

    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    admin
        .auth()
        .createSessionCookie(idToken, { expiresIn })
        .then(
            (sessionCookie) => {
                const options = { maxAge: expiresIn, httpOnly: true };
                res.cookie("session", sessionCookie, options);
                res.end(JSON.stringify({ status: "success" }));
            },
            (error) => {
                res.status(401).send("UNAUTHORIZED REQUEST!");
            }
        );
    res.render("login.html");
});
app.post("/login", (req, res) => {

});

//faker
app.get("/date", (req, res)=>{
    var date = faker.date.future();
    
    res.send((new Date(date).getTime().toString()));
});

//profile
app.get("/profile/:userID", (req, res) => {
    const sessionCookie = req.cookies.session || "";

    admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked */)
        .then(() => {
            res.render("profile.html");
        })
        .catch((error) => {
            res.redirect("/login");
        });
});

app.post("/logout", (req, res) => {
    res.clearCookie("session");
    res.redirect("/login");
});

//admin

app.listen(3000);
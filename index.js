const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser");
const admin = require("firebase-admin");
const csrf = require("csurf");

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
app.get("/test", (req, res) => {
    res.render("test.html");
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
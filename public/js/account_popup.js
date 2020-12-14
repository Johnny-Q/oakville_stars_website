const account_popup = document.querySelector(".account_popup");
const signInClose = document.querySelector(".signin-close");
const openSignin = document.querySelectorAll(".signin-open");
if (account_popup) {
    openSignin.forEach(element => {
        element.addEventListener("click", function () {
            account_popup.style.width = "100%";
        });
    });
    signInClose.addEventListener("click", function () {
        account_popup.style.width = '0';
    });
}
const signinForm = document.querySelector(".signin-form");
const profileInfo = document.querySelector(".profile-info");
const signinButton = document.querySelector("#signin");
var currUser = {};
let lastRequest = 0;
let login_error = document.querySelector(".login_error");
signinButton.onclick = (event) => {
    event.preventDefault();
    if (Date.now() - lastRequest > 2 * 1000) {
        lastRequest = Date.now();
        var email = document.querySelector("#signin-email").value;
        var pass = document.querySelector("#signin-password").value;
    }
};
document.querySelector("#signout-button").addEventListener("click", (event) => {
    event.preventDefault();
    window.location.assign("/");
});
document.querySelector("#view-profile").addEventListener("click", (event) => {
    event.preventDefault();
    window.location.assign("/profile_information");
});
var hour_input = document.querySelector(".hours_input");
var date_input = document.querySelector(".date_input");
var details_textarea = document.querySelector(".request_details");
let hours_error = document.querySelector(".invalid_hours");
document.querySelector(".add-hours").addEventListener("click", async (event) => {
    if (hour_input.value && date_input && details_textarea.value) {
        var hours = parseInt(hour_input.value);
        var details = details_textarea.value;
        if (0 < hours && hours < 100) {
            let docRef;
        }
        else {
            hours_error.style.display = "block";
            hours_error.innerText = "Invalid input.";
        }
    }
    else {
        hours_error.style.display = "block";
        hours_error.innerText = "Please fill out all fields.";
    }
});

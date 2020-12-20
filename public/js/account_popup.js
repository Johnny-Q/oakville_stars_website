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
        auth.signInWithEmailAndPassword(email, pass).then(() => {
            window.location.reload();
        }).catch(err => {
            let msg = "";
            switch (err.code) {
                case "auth/user-not-found":
                    msg = "invalid credentials";
                    break;
                case "auth/wrong-password":
                    msg = "invalid credentials";
                    break;
                case "auth/invalid-email":
                    msg = "Please enter a valid email.";
                    break;
                case "auth/too-many-requests":
                    msg = "Too many requests. Account temporarily locked. Please contact an admin.";
                    break;
                default:
                    msg = "Unknown error. Please Refresh.";
                    break;
            }
            login_error.style.display = "block";
            login_error.innerText = msg;
            console.log("error signing in", err);
        });
    }
};
document.querySelector("#signout-button").addEventListener("click", (event) => {
    event.preventDefault();
    auth.signOut();
    window.location.reload();
});
document.querySelector("#view-profile").addEventListener("click", (event) => {
    event.preventDefault();
    window.location.assign("/member_information");
});
var hour_input = document.querySelector(".hours_input");
var date_input = document.querySelector(".date_input");
var details_textarea = document.querySelector(".request_details");
let hours_error = document.querySelector(".invalid_hours");
document.querySelector(".add-hours").addEventListener("click", async (event) => {
    if (hour_input.value && date_input.value && details_textarea.value) {
        let hours = parseInt(hour_input.value);
        let details = details_textarea.value;
        let date = date_input.value;
        if (0 < hours && hours < 100) {
            let hour_request = {
                "name": auth.currentUser.name,
                "uid": auth.currentUser.uid,
                hours,
                details,
                date
            };
            db_wrapper.createHoursRequest(hour_request).then(() => {
                var currHourP = document.querySelector(".pending-hours");
                currHourP.innerText = `${parseInt(currHourP.innerText) + hours} pending`;
                hour_input.value = "";
                details_textarea.value = "";
                date_input.value = "";
                hours_error.style.display = "none";
            }).catch((err) => {
                console.log(err);
            });
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

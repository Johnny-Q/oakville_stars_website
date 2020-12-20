const account_popup = document.querySelector(".account_popup");
const signInClose = document.querySelector(".signin-close");
const openSignin = document.querySelectorAll(".signin-open");
//open / close animation
if (account_popup) {
    openSignin.forEach(element => {
        element.addEventListener("click", function () {
            // @ts-expect-error
            account_popup.style.width = "100%";
        })
    });

    signInClose.addEventListener("click", function () {
        // @ts-expect-error
        account_popup.style.width = '0';
    });
}

const signinForm = document.querySelector(".signin-form") as HTMLElement;
const profileInfo = document.querySelector(".profile-info") as HTMLElement;
const signinButton = document.querySelector("#signin") as HTMLElement;
var currUser = {};

let lastRequest = 0;
let login_error = document.querySelector(".login_error") as HTMLElement;
signinButton.onclick = (event) => {
    event.preventDefault();
    if (Date.now() - lastRequest > 2 * 1000) {
        lastRequest = Date.now();
        // @ts-expect-error
        var email = document.querySelector("#signin-email").value;
        // @ts-expect-error
        var pass = document.querySelector("#signin-password").value;

        auth.signInWithEmailAndPassword(email, pass).then(() => {
            // window.location.assign("/");
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

//add hours
var hour_input = document.querySelector(".hours_input") as HTMLInputElement;
var date_input = document.querySelector(".date_input") as HTMLInputElement;
var details_textarea = document.querySelector(".request_details") as HTMLTextAreaElement;
let hours_error = document.querySelector(".invalid_hours") as HTMLElement;
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
            }
            db_wrapper.createHoursRequest(hour_request).then(() => {
                //clear the inputs
                var currHourP = document.querySelector(".pending-hours") as HTMLElement;
                currHourP.innerText = `${parseInt(currHourP.innerText) + hours} pending`;
                hour_input.value = "";
                details_textarea.value = "";
                date_input.value = "";

                hours_error.style.display = "none";
            }).catch((err)=>{
                console.log(err);
            });
        } else {
            hours_error.style.display = "block";
            hours_error.innerText = "Invalid input.";
        }
    } else {
        hours_error.style.display = "block";
        hours_error.innerText = "Please fill out all fields.";
    }
});

const account_popup = document.querySelector(".account_popup");
const signInClose = document.querySelector(".signin-close");
const openSignin = document.querySelectorAll(".signin-open");
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


//change sign in to profile
// auth.onAuthStateChanged(function (user) {
//     if (user) {
//         // User is signed in.
//         document.querySelectorAll(".signin-open").forEach(e => e.innerText = "PROFILE");
//     } else {
//         // No user is signed in.
//         document.querySelectorAll(".signin-open").forEach(e => e.innerText = "SIGN IN");
//     }
// });


const signinForm = document.querySelector(".signin-form");
const profileInfo = document.querySelector(".profile-info");
const signinButton = document.querySelector("#signin") as HTMLElement;
var currUser = {};
// auth.onAuthStateChanged(function (user) {
//     if (user) {
//         // User is signed in.
//         signinForm.style.display = "none";
//         profileInfo.style.display = "flex";
//         currUser.uid = user.uid;

//         //update the name and hours
//         db.collection("hours").doc(user.uid).get().then(doc => {
//             var data = doc.data();
//             currUser.name = data.name;

//             //change text
//             document.querySelector(".profile-info > div > h3").innerText = data.name;
//             document.querySelector(".confirmed-hours").innerText = `${data.hours} confirmed`;
//             document.querySelector(".pending-hours").innerText = `${data.pending_hours} pending`;
//         });
//     } else {
//         // No user is signed in.
//         signinForm.style.display = "block";
//         profileInfo.style.display = "none";
//     }
// });

let lastRequest = 0;
let login_error = document.querySelector(".login_error");
signinButton.onclick = (event) => {
    event.preventDefault();
    if (Date.now() - lastRequest > 2 * 1000) {
        lastRequest = Date.now();
        // @ts-expect-error
        var email = document.querySelector("#signin-email").value;
        // @ts-expect-error
        var pass = document.querySelector("#signin-password").value;

        // auth.signInWithEmailAndPassword(email, pass).then(() => {
        //     window.location.assign("/");
        // }).catch(err => {
        //     let msg = "";
        //     switch (err.code) {
        //         case "auth/user-not-found":
        //             msg = "invalid credentials";
        //             break;
        //         case "auth/wrong-password":
        //             msg = "invalid credentials";
        //             break;
        //         case "auth/invalid-email":
        //             msg = "Please enter a valid email.";
        //             break;
        //         case "auth/too-many-requests":
        //             msg = "Too many requests. Account temporarily locked. Please contact an admin.";
        //             break;
        //         default:
        //             msg = "Unknown error. Please Refresh.";
        //             break;
        //     }
        //     login_error.style.display = "block";
        //     login_error.innerText = msg;
        //     console.log("error signing in", err);
        // });
    }
};

document.querySelector("#signout-button").addEventListener("click", (event) => {
    event.preventDefault();
    // auth.signOut();
    window.location.assign("/");
});
document.querySelector("#view-profile").addEventListener("click", (event) => {
    event.preventDefault();
    window.location.assign("/profile_information");
});

//add hours
var hour_input = document.querySelector(".hours_input");
var date_input = document.querySelector(".date_input");
var details_textarea = document.querySelector(".request_details");
let hours_error = document.querySelector(".invalid_hours");
document.querySelector(".add-hours").addEventListener("click", async (event) => {
    // @ts-expect-error
    if (hour_input.value && date_input && details_textarea.value) {
        // @ts-expect-error
        var hours = parseInt(hour_input.value);
        // @ts-expect-error
        var details = details_textarea.value;
        if (0 < hours && hours < 100) {
            let docRef;
            // try {
            //     docRef = await db.collection("pending").add({
            //         "uid": currUser.uid,
            //         "name": currUser.name,
            //         "hours": hours,
            //         "details": details
            //     });
            //     await db.collection("hours").doc(currUser.uid).update({
            //         "pending_hours": firebase.firestore.FieldValue.increment(hours)
            //     });
            //     var currHourP = document.querySelector(".pending-hours");
            //     currHourP.innerText = `${parseInt(currHourP.innerText) + hours} pending`;
            //     hour_input.value = "";
            //     details_textarea.value = "";

            //     hours_error.style.display = "none";
            // } catch (err) {
            //     //delete the doc in case something goes wrong?
            //     console.log(err);
            // }
        } else {
            // @ts-expect-error
            hours_error.style.display = "block";
            // @ts-expect-error
            hours_error.innerText = "Invalid input.";
        }
    } else {
        // @ts-expect-error
        hours_error.style.display = "block";
        // @ts-expect-error
        hours_error.innerText = "Please fill out all fields.";
    }
});

// function requestHours(uid, name, date, hours) {
//     return db.collection("pending").add({
//         "uid": uid,
//         "name": name,
//         "date": date,
//         "hours": hours
//     }).then(() => {
//         return db.collection("hours").doc(uid).update({
//             "pending_hours": firebase.firestore.FieldValue.increment(hours)
//         });
//     });
// }
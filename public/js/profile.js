const signinForm = document.querySelector(".signin-form");
const profileInfo = document.querySelector(".profile-info");
const signinButton = document.querySelector("#signin");

var currUser = {};

signinButton.addEventListener("click", (event) => {
    event.preventDefault();
    var email = document.querySelector("#signin-email").value;
    var pass = document.querySelector("#signin-password").value;

    auth.signInWithEmailAndPassword(email, pass).then(() => {
        window.location.assign("/");
    }).catch(err => {
        console.log("error signing in", err);
    });
});

document.querySelector("#signout-button").addEventListener("click", (event) => {
    event.preventDefault();
    auth.signOut();
    window.location.assign("/");
});


auth.onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        signinForm.style.display = "none";
        profileInfo.style.display = "flex";
        currUser.uid = user.uid;
        //update the name and hours
        db.collection("hours").doc(user.uid).get().then(doc => {
            var data = doc.data();

            currUser.name = data.name;
            //change text
            document.querySelector(".profile-info > h3").innerText = data.name;
            document.querySelector(".confirmed-hours").innerText = data.hours;
            document.querySelector(".pending-hours").innerText = data.pending_hours;
        });
    } else {
        // No user is signed in.
        signinForm.style.display = "block";
        profileInfo.style.display = "none";
    }
});



//add hours
var hour_input = document.querySelector(".input-button-group > input");
document.querySelector(".add-hours").addEventListener("click", (event) => {
    if (hour_input.value) {
        var hours = parseInt(hour_input.value);
        requestHours(currUser.uid, currUser.name, hours);
        hour_input.value = "";
        var currHourP = document.querySelector(".pending-hours");
        currHourP.innerText = parseInt(currHourP.innerText) + hours;
    }
});

function requestHours(uid, name, hours) {
    db.collection("pending").add({
        "uid": uid,
        "name": name,
        "hours": hours
    });
    db.collection("hours").doc(uid).update({
        "pending_hours": firebase.firestore.FieldValue.increment(hours)
    });
}
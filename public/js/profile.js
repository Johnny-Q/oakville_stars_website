const signinForm = document.querySelector(".signin-form");
const profileInfo = document.querySelector(".profile-info");
const signinButton = document.querySelector("#signin");

signinButton.addEventListener("click", (event)=>{
    event.preventDefault();
    var email = document.querySelector("#signin-email").value;
    var pass = document.querySelector("#signin-pass").value;

    auth.signInWithEmailAndPassword(email, pass).catch(err=>{
        console.log("error signing in", err);
    })
});

auth.onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        signinForm.style.display = "none";
        profileInfo.style.display ="flex";
    } else {
        // No user is signed in.
        signinForm.style.display = "block";
        profileInfo.style.display = "none";
    }
});
const hamburgerClick = document.querySelector(".hamburger-click");
const hamburger = document.querySelector(".hamburger");
const mobileNav = document.querySelector(".mobile");
const close = document.querySelectorAll(".close-nav");
if (hamburgerClick) {
    hamburgerClick.addEventListener("click", function () {
        console.log("clicked");
        mobileNav.style.width = '100%';
    });

    close.forEach(element => {
        element.addEventListener("click", function () {
            console.log("reee");
            mobileNav.style.width = "0";
        })
    });
}

const signIn = document.querySelector(".signin");
const signInClose = document.querySelector(".signin-close");
const openSignin = document.querySelectorAll(".signin-open");
if (signIn) {
    openSignin.forEach(element => {
        element.addEventListener("click", function () {
            signIn.style.width = "100%";
        })
    });

    signInClose.addEventListener("click", function () {
        signIn.style.width = '0';
    });
}


//change sign in to profile
auth.onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        document.querySelectorAll(".signin-open").forEach(e=>e.innerText = "PROFILE");
    } else {
        // No user is signed in.
        document.querySelectorAll(".signin-open").forEach(e=>e.innerText = "SIGN IN");
    }
});
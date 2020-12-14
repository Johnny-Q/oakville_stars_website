const hamburger = document.querySelector(".hamburger");
const mobile_nav = document.querySelector(".mobile");
const close_button = document.querySelectorAll(".close-nav");
if (hamburger && mobile_nav && close_button) {
    hamburger.addEventListener("click", function () {
        console.log("clicked");
        mobile_nav.style.width = '100%';
    });
    close_button.forEach(element => {
        element.addEventListener("click", function () {
            console.log("reee");
            mobile_nav.style.width = "0";
        });
    });
}

const hamburgerClick = document.querySelector(".hamburger-click");
const hamburger = document.querySelector(".hamburger");
const mobileNav = document.querySelector(".mobile");
const close = document.querySelector(".cross");
hamburgerClick.addEventListener("click", function(){
    console.log("clicked");
    mobileNav.style.width = '100%';
});

close.addEventListener("click", function(){
    console.log("clicked");
    mobileNav.style.width = "0";
});
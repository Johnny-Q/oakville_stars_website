function showLinks() {
    var e = document.querySelector(".dropdown-links");
    if (e.style.maxHeight) {
        e.style.maxHeight = null;
    }
    else {
        e.style.maxHeight = e.scrollHeight + "px";
    }
}

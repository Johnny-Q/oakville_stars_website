let refs = null;
window.onload = async function () {
    try {
        loadGalleryPaginate();
    } catch (err) {
        console.log("Error rendering photo gallery", err);
    }
}

const photo_gallery = document.querySelector(".photo-gallery");
function renderImage(url) {
    var imgHolder = document.createElement("div");
    imgHolder.classList.add("img-holder");
    var img = document.createElement("img");
    img.src = url;

    imgHolder.append(img);
    photo_gallery.append(imgHolder);
}

async function loadGalleryPaginate() {
    try {
        if (refs) { //calls after first
            if (refs.nextPageToken) { //only get more if we haven't reached the end (nextPageToken == undefined at end)
                refs = await storage.ref().child("gallery").list({
                    maxResults: 3,
                    pageToken: refs.nextPageToken
                });

                refs.items.forEach(async ref => {
                    renderImage(await ref.getDownloadURL());
                });
            }else{
                //reached the end
                //hide the button
            }
        } else { //first call
            refs = await storage.ref().child("gallery").list({ maxResults: 6 });

            refs.items.forEach(async ref => {
                renderImage(await ref.getDownloadURL());
            });
        }
    } catch (err) {
        console.log(err);
    }
}
document.querySelector(".paginate").onclick = loadGalleryPaginate;
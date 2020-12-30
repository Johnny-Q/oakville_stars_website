let editing = false;
let editButton = document.querySelector('.edit');
let passwordReset = document.querySelector(".password_reset");
let passwordResetLastClick = 0;
auth.onAuthStateChanged(user => {
    console.log(user);
    if (user && Object.keys(user).length) {
        db.collection("members").doc(user.uid).get().then((doc) => {
            let data = doc.data();
            for (let [key, val] of Object.entries(data)) {
                let e = document.querySelector(`[name='${key}']`);
                if (e) {
                    e.value = val;
                }
                else {
                    console.log(key);
                }
            }
        });
        editButton.addEventListener("click", function () {
            if (editing) {
                let data = {};
                document.querySelectorAll(".data").forEach(e => {
                    data[e.name] = e.value;
                });
                db_wrapper.updateCurrentInformation(data);
            }
            editing = !editing;
            document.querySelectorAll(".data").forEach(e => {
                e.disabled = !editing;
            });
            editButton.innerText = editing ? "Save" : "Edit Information";
        });
        passwordReset.onclick = () => {
            if (Date.now() - passwordResetLastClick < 10 * 1000)
                return;
            passwordResetLastClick = Date.now();
            auth.sendPasswordResetEmail(auth.currentUser.email).then(() => {
                passwordReset.innerText = "Check Email";
            }).catch(() => {
                passwordReset.innerText = "Error, refresh";
            });
        };
    }
    else {
        window.location.assign("/");
    }
});

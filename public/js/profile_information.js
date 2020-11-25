// let k = {
//     "child_dob":,
//     "child_fullname":,
//     "contact_email":,
//     "emergency_contact_name":,
//     "eergency_contact_phone":,
//     "level":,
//     "mail_address":,
//     "parent_fullname":,
//     "phone":,
//     "sepciality":
// }
let editing = false;
let editButton = document.querySelector('.edit');
auth.onAuthStateChanged(user => {
    console.log(user);
    if (Object.keys(user).length) {
        db.collection("members").doc(user.uid).get().then((doc) => {
            let data = doc.data();
            for (let [key, val] of Object.entries(data)) {
                let e = document.querySelector(`[name='${key}']`);
                if (e) {
                    e.value = val;
                } else {
                    console.log(key);
                }
            }
        });
        editButton.addEventListener("click", function () {
            if (editing) {
                let data = {};
                //save the info
                //get the data
                document.querySelectorAll(".data").forEach(e => {
                    data[e.name] = e.value;
                });
                db.collection("members").doc(user.uid).set(data);
            }
            //toggle edit mode
            editing = !editing;
            //enable/disable the inputs
            document.querySelectorAll(".data").forEach(e => {
                e.disabled = !editing;
            });
            editButton.innerText = editing ? "Save" : "Edit Information";
        });
    }
    else{
        window.location.assign("/");
    }
});

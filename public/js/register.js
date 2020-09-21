;//get the data from the inputs

//create a doc in members

var steps = [".member-info", ".tac", ".account-info"];
var step_titles = document.querySelectorAll(".form_step");
var curr_step = 0;

//continue button
document.querySelector(".continue-button").addEventListener("click", function (event) {
    event.preventDefault();
    curr_step++;
    //validate input
    //member-info, check if everything filled out
    switch (curr_step) {
        case 1:
            var valid = true;
            document.querySelectorAll(".member-info input").forEach(input => {
                if (input.value == "") valid = false;
            });
            document.querySelectorAll(".member-info select").forEach(input => {
                if (input.value == "") valid = false;
            });
            if (!valid) {
                curr_step--;
                document.querySelector(".member-info .validation-error").style.display = "block";
            } else {
                document.querySelector(".member-info .validation-error").style.display = "none";
            }
            break;
        case 2:
            var valid = true;
            document.querySelectorAll(".tac input").forEach(input => {
                if (!input.checked) valid = false;
            });
            if (!valid) {
                curr_step--;
                document.querySelector(".tac .validation-error").style.display = "block";
            } else {
                document.querySelector(".tac .validation-error").style.display = "none";
            }
            break;
        case 3:
            var valid = true;
            var msg = "Passwords do not match.";
            document.querySelectorAll(".account-info input").forEach(input => {
                if (input.value == "") valid = false;
            });
            if (valid) {
                //check passwords
                if (document.querySelector("input[name=reg_password_conf]").value == document.querySelector("input[name=reg_password]").value) {
                    var email = document.querySelector("input[name=reg_email]").value;
                    var pass = document.querySelector("input[name=reg_password").value;
                    //get form data
                    var data = {};
                    //inputs
                    document.querySelectorAll(".member-info input").forEach(input => {
                        var name = input.getAttribute("name");
                        data[name] = input.value;
                    });
                    document.querySelectorAll(".member-info select").forEach(input => {
                        var name = input.getAttribute("name");
                        data[name] = input.value;
                    });
                    console.log(data);
                    //get selects

                    //submit to firebase
                    auth.createUserWithEmailAndPassword(email, pass).then(() => {
                        console.log(auth.currentUser);
                        document.querySelector(".account-info .validation-error").style.display = "none";
                        //submit the details here
                        db.collection("members").doc(auth.currentUser.uid).set(data).then(() => {
                            db.collection("hours").doc(auth.currentUser.uid).set({
                                "hours": 0,
                                "pending_hours": 0,
                                "name": data.child_fullname
                            }).then(()=>{
                                window.location.assign("/");
                            }).catch(err=>{

                            });
                        }).catch(err=>{

                        });

                        //redirect to home page
                    }).catch((err) => {
                        console.log("error", err); s
                        msg = err.message;
                        curr_step--;
                        document.querySelector(".account-info .validation-error").innerText = msg;
                        document.querySelector(".account-info .validation-error").style.display = "block";
                    });
                } else {
                    msg = "Passwords do not match.";
                    valid = false;
                }
            } else {
                msg = "Please fill out all fields.";
            }
            if (!valid) {
                curr_step--;
                document.querySelector(".account-info .validation-error").innerText = msg;
                document.querySelector(".account-info .validation-error").style.display = "block";
            }
            break;
        default:
            break;
    }

    changeTab(curr_step);
});

document.querySelector(".goback-button").addEventListener("click", function (event) {
    event.preventDefault();
    curr_step--;
    changeTab(curr_step);
});

function changeTab(curr_step) {
    if (curr_step > 2) return;
    if (curr_step == 0) document.querySelector(".goback-button").style.display = "none";
    else document.querySelector(".goback-button").style.display = "inline-block";
    if (curr_step == 2) {
        document.querySelector(".continue-button").innerText = "Create Account";
    } else {
        document.querySelector(".continue-button").innerText = "Continue";
    }
    if (curr_step == 1) {//on tac
        //change grid from 1fr 1fr to 1fr 3fr
        document.querySelector(".register-page").style.gridTemplateColumns = "1fr 2fr";
    } else {
        document.querySelector(".register-page").style.gridTemplateColumns = "1fr 1fr";
    }

    for (var i = 0; i < steps.length; i++) {
        document.querySelector(steps[i]).style.display = i == curr_step ? "flex" : "none";
        step_titles[i].classList.toggle("active", i == curr_step);
    }
}
//@ts-nocheck
//get the data from the inputs

//create a doc in members

let steps = [".member-info", ".tac", ".account-info"];
let step_titles = document.querySelectorAll(".form_step");
let curr_step = 0;

let account_created = false;

//continue button
document.querySelector(".continue-button").addEventListener("click", function (event) {
    event.preventDefault();
    curr_step++;
    //validate input
    //member-info, check if everything filled out
    let valid = true;
    switch (curr_step) {
        case 1:
            //@ts-expect-error
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
            //@ts-expect-error
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
            //@ts-expect-error
            let msg = "Passwords do not match.";
            document.querySelectorAll(".account-info input").forEach(input => {
                if (input.value == "") valid = false;
            });
            if (valid) {
                //check passwords
                if (document.querySelector("input[name=reg_password_conf]").value == document.querySelector("input[name=reg_password]").value) {
                    let email = document.querySelector("input[name=reg_email]").value;
                    let pass = document.querySelector("input[name=reg_password").value;
                    //get form data
                    let data = {};
                    //inputs
                    document.querySelectorAll(".member-info input").forEach(input => {
                        let name = input.getAttribute("name");
                        data[name] = input.value;
                    });
                    //get selects
                    document.querySelectorAll(".member-info select").forEach(input => {
                        let name = input.getAttribute("name");
                        data[name] = input.value;
                    });
                    console.log(data);

                    //submit to firebase
                    if (!account_created) {
                        auth_wrapper.createAccount(email, pass, data).then(() => {
                            account_created = true;
                            window.location.assign("/");
                        }).catch((err) => {
                            if (err.code.indexOf("auth") != -1) {
                                //error with creating the account
                                msg = err.message;
                            }
                            else {
                                //error with initializing hours
                                msg = "Error setting up account. Please contact an admin";
                                account_created = true;

                                //disable all the input forms
                                document.querySelectorAll(".account-info input").forEach(input=>{
                                    input.disabled = true;
                                })

                            }
                            console.log(err);
                            valid = false;

                            if (!valid) {
                                console.log(msg);
                                curr_step--; //curr_step was at 4
                                //display the error message
                                document.querySelector(".account-info .validation-error").innerText = msg;
                                document.querySelector(".account-info .validation-error").style.display = "block";
                            }
                        });
                    }
                } else {
                    msg = "Passwords do not match.";
                    valid = false;
                }
            } else {
                msg = "Please fill out all fields.";
                valid = false;
            }

            if (!valid) {
                console.log(msg);
                curr_step--; //curr_step was at 4
                //display the error message
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

    // if (curr_step == 1) {//on tac
    //     //change grid from 1fr 1fr to 1fr 3fr
    //     document.querySelector(".register-page").style.gridTemplateColumns = "1fr 2fr";
    // } else {
    //     document.querySelector(".register-page").style.gridTemplateColumns = "1fr 2fr";
    // }

    for (let i = 0; i < steps.length; i++) {
        document.querySelector(steps[i]).style.display = i == curr_step ? "flex" : "none";
        step_titles[i].classList.toggle("active", i == curr_step);
    }
}
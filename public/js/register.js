let steps = [".member-info", ".tac", ".account-info"];
let step_titles = document.querySelectorAll(".form_step");
let curr_step = 0;
let account_created = false;
document.querySelector(".continue-button").addEventListener("click", function (event) {
    event.preventDefault();
    curr_step++;
    let valid = true;
    switch (curr_step) {
        case 1:
            document.querySelectorAll(".member-info input").forEach(input => {
                if (input.value == "")
                    valid = false;
            });
            document.querySelectorAll(".member-info select").forEach(input => {
                if (input.value == "")
                    valid = false;
            });
            if (!valid) {
                curr_step--;
                document.querySelector(".member-info .validation-error").style.display = "block";
            }
            else {
                document.querySelector(".member-info .validation-error").style.display = "none";
            }
            break;
        case 2:
            document.querySelectorAll(".tac input").forEach(input => {
                if (!input.checked)
                    valid = false;
            });
            if (!valid) {
                curr_step--;
                document.querySelector(".tac .validation-error").style.display = "block";
            }
            else {
                document.querySelector(".tac .validation-error").style.display = "none";
            }
            break;
        case 3:
            let msg = "Passwords do not match.";
            document.querySelectorAll(".account-info input").forEach(input => {
                if (input.value == "")
                    valid = false;
            });
            if (valid) {
                if (document.querySelector("input[name=reg_password_conf]").value == document.querySelector("input[name=reg_password]").value) {
                    let email = document.querySelector("input[name=reg_email]").value;
                    let pass = document.querySelector("input[name=reg_password").value;
                    let data = {};
                    document.querySelectorAll(".member-info input").forEach(input => {
                        let name = input.getAttribute("name");
                        data[name] = input.value;
                    });
                    document.querySelectorAll(".member-info select").forEach(input => {
                        let name = input.getAttribute("name");
                        data[name] = input.value;
                    });
                    console.log(data);
                    if (!account_created) {
                        auth_wrapper.createAccount(email, pass, data).then(() => {
                            account_created = true;
                            window.location.assign("/");
                        }).catch((err) => {
                            if (err.code.indexOf("auth") != -1) {
                                msg = err.message;
                            }
                            else {
                                msg = "Error setting up account. Please contact an admin";
                                account_created = true;
                                document.querySelectorAll(".account-info input").forEach(input => {
                                    input.disabled = true;
                                });
                            }
                            console.log(err);
                            valid = false;
                            if (!valid) {
                                console.log(msg);
                                curr_step--;
                                document.querySelector(".account-info .validation-error").innerText = msg;
                                document.querySelector(".account-info .validation-error").style.display = "block";
                            }
                        });
                    }
                }
                else {
                    msg = "Passwords do not match.";
                    valid = false;
                }
            }
            else {
                msg = "Please fill out all fields.";
                valid = false;
            }
            if (!valid) {
                console.log(msg);
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
    if (curr_step > 2)
        return;
    if (curr_step == 0)
        document.querySelector(".goback-button").style.display = "none";
    else
        document.querySelector(".goback-button").style.display = "inline-block";
    if (curr_step == 2) {
        document.querySelector(".continue-button").innerText = "Create Account";
    }
    else {
        document.querySelector(".continue-button").innerText = "Continue";
    }
    for (let i = 0; i < steps.length; i++) {
        document.querySelector(steps[i]).style.display = i == curr_step ? "flex" : "none";
        step_titles[i].classList.toggle("active", i == curr_step);
    }
}


$(document).ready(function () {
    const saveButton = $("#save-button");
    const changePasswordButton = $("#change-password-button");

    let saveChanges = function (e) {
        saveButton.attr("disabled", "disabled");

        const firstname = $("#firstname-input").val();
        const lastname = $("#lastname-input").val();
        const login = $("#login-input").val();
        const userId = decoded["Claim.Key.Id"];

        let data = {
            id: userId,
            firstName: firstname,
            lastName: lastname,
            login: login
        };

        let onResponse = function (response) {
            window.location.reload();
        }

        modifyUser(data, onResponse);
    }

    let changePassword = function (e) {
        let password = $("#password-input").val();

        const userId = decoded["Claim.Key.Id"];

        let data = {
            id: userId,
            password: password
        };

        let onResponse = function (response) {
            window.location.reload();
        }

        modifyUser(data, onResponse);
    }

    saveButton.on("click", saveChanges);
    changePasswordButton.on("click", changePassword);
})
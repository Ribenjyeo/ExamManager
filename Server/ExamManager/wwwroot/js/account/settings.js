
$(document).ready(function () {
    const saveButton = $("#save-button");
    const changePasswordButton = $("#change-password-button");

    let notifyMessage = function (title, msg, status){
        new Notify({
            status: status,
            title: title,
            text: msg,
            effect: 'fade',
            speed: 1000,
            customClass: '',
            customIcon: '',
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 5000,
            gap: 20,
            distance: 20,
            type: 3,
            position: 'right bottom',
            customWrapper: '',
        });
    }

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
            if (response.type === "BadResponse") {
                notifyMessage('Ошибка', response.message, 'error');
                return;
            }
            else if (response.type === "ErrorsResponse") {
                Object.keys(response.errors).map((msgsKey) => { response.errors[msgsKey].join(';\n ') });
                let msg = Object.values(response.errors).join(';\n ');
                notifyMessage('Ошибка', msg, 'error');
            }
            else {
                notifyMessage('Успешно', 'Данные изменены', 'success');
                updateUserData(response);
            }
            saveButton.removeAttr('disabled');
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
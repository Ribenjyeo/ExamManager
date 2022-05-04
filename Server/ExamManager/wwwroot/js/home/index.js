let submitButton = $("#submitButton");
let form = $("#form");

let changeInputSection = function () {
    let inputForm = $("#input-form");
    let footer = $(".footer");
    // Очистка формы
    inputForm.empty();

    let inputSection = $('<input id="login" class="normal" type="text" placeholder="Новый логин" />' +
        '<input id="new"  class="normal" type="password" placeholder="Новый пароль" /> ' +
        '<input id="confirm" class="normal" type="password" placeholder="Подтвердить пароль" />' +
        '<div id="default"></span>');
    // Заполнение формы новыми полями
    inputSection.appendTo(inputForm);

    //Очистка панели кнопок
    footer.empty();

    let footerButton = $('<input type="submit" name="sumbitButton" value="Изменить"/>');
    // Заполнение панели кнопками
    footerButton.appendTo(footer);

    // Изменение функции submit
    form.off('submit', handleLogin);
    form.on('submit', handleDefault);
}

const jwt_token = Cookies.get("token");

// Если пользователь авторизован
if (jwt_token) {
    let decoded = jwt_decode(jwt_token);

    let onResponse = function (response) {
        let resp = JSON.parse(response.responseText);

        if (resp["isDefault"]) {
            changeInputSection();
        }
        else {
            let write = function (response) {
                console.log(response.responseText);
            }
            handleRequest("/pages/home", "GET", null, write);
        }
    }

    handleRequest(`/user/${decoded["Claim.Key.Id"]}`, "GET", null, onResponse);    
}

// Запрос при авторизации
let handleLogin = function (event) {
    // Очистить сообщения об ошибках
    $(".field-validation-error").remove();

    event.preventDefault();
    submitButton.disabled = true;

    let data = JSON.stringify(
        {
            login: this.login.value,
            password: this.password.value
        });

    let onResponse = function(response) {
        onSuccess(JSON.parse(response.responseText));
    };
    handleRequest("/login", "POST", data, onResponse);
}

let onSuccess = function (response) {
    if (response.type === "BadResponse") {
        handleBadResponse(response);
    }
    else if (response.type === "JWTResponse") {
        handleJWTResponse(response);
    }
}

let handleBadResponse = function(response){
    $("#password").val("");

    // Вывести ошибки
    for (let error in response.errors) {
        let inputElement = $(`#${error.toLowerCase()}`);
        for (let errorText of response.errors[error]) {
            let errorMessage = $(`<span class="field-validation-error">${errorText}</span>`);
            inputElement.after(errorMessage);
            inputElement.addClass("input-validation-error");
            //inputElement.on('input', () => {
            //    inputElement.removeClass("input-validation-error");
            //    inputElement.on('input', null);
            //});
        }
    }
}

let handleJWTResponse = function(response){
    // Устанавливаем токен
    let jwtToken = response.token;
    Cookies.set("token", jwtToken);

    // Если пользователь авторизовался в первый раз
    if (response.isDefault) {
        changeInputSection();
    }
    else {
        window.location.replace("/pages/home");
    }
}

let handleDefault = function () {

    // Очистить сообщения об ошибках
    $(".field-validation-error").remove();

    event.preventDefault();
    submitButton.disabled = true;

    if (this.new.value !== this.confirm.value) {
        let errors = {
            "confirm": [ "Пароли должны совпадать" ]
        };
        handleBadResponse({ errors: errors });
        return;
    }

    let data = JSON.stringify(
        {
            id: jwt_decode(Cookies.get("token"))["Claim.Key.Id"],
            login: this.login.value,
            password: this.new.value,
            isDefault: false
        });

    let onResponse = function (response) {
        let data = JSON.parse(response.responseText);
        if (data.type === "BadResponse") {
            handleBadResponse(data);
        }
        else if (data.type === "UserDataResponse") {
            window.location.replace("/pages/home");
        }
    };
    handleRequest("/user/modify", "POST", data, onResponse);

    //let onResponse = function (response) {

    //}

    //handleRequest("/user/modify")
}


form.on('submit', handleLogin);
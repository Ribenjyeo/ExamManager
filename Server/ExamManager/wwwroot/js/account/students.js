// Выбор всех уникальных элементов на странице
let modal = document.querySelector("#create-student-modal");

// Поиск студента (выпадающий список)
const searchInput = $("#student-name");
searchInput.on("input", updateStudents);
searchInput.val("").trigger("input");

// При вводе имени студента
function updateStudents(e) {
    let studentName = e.target.value;

    let data = {
        name: studentName
    };

    // Если строка пустая, то возвращаем всех студентов
    if (studentName === "") {
        data.firstName = null;
        data.lastName = null;
    }

    let onResponse = function (response) {
        fillStudents(JSON.parse(response.responseText));
    };

    getUsers(JSON.stringify(data), onResponse);
}

// Заполнение таблицы студентов
function fillStudents(data) {
    let oldTable = $(".students-table>.body");
    if (oldTable) {
        oldTable.empty();
    }

    let studentsTableBody = $(".students-table>.body");

    let index = 1;
    for (user of data.users) {

        if (decoded["Claim.Key.Id"] == user.id) {
            continue;
        }

        let tableRow = $(`<div class="row" student="${user.id}">` +
            `<div class="number">${index}</div>` +
            `<div class="student-name">${user.lastName} ${user.firstName}</div>` +
            `<div class="description">${user.groupName == null ? "-" : user.groupName}</div >` +
            `<div class="description">${user.tasks.length}</div >` +
            '</div> ');


        let actionsColumn = $(`<div class="actions"> 
                               </div>`);

        let deleteButton = $(`<a class="delete">` +
            '<i class="fa fa-solid fa-trash"></i>' +
            '</a>');

        deleteButton.on("click", function (e) {
            let id = $(this).closest(".row").attr("student");
            deleteUser(id, function (reponse) {
                window.location.reload();
            });
        });

        actionsColumn.append(deleteButton);
        tableRow.append(actionsColumn);

        studentsTableBody.append(tableRow);
        index += 1;
    }
}

let deleteUser = function (id) {
    let data = {
        users: [
            {
                id: id,
                onlyLogin: false
            }
        ]
    }

    let onResponse = function (response) {
        window.location.reload();
    }

    deleteUsers(JSON.stringify(data), onResponse);
}

// Добавить нового студента
let createNewUser = function () {
    let firstName = $("#firstname").val();
    let lastName = $("#lastname").val();
    let login = $("#login").val();
    let password = $("#password").val();

    reloadInputs();

    let errors = {};
    if (firstName === "") {
        errors["firstname"] = ["Введите имя"];
    }
    if (lastName === "") {
        errors["lastname"] = ["Введите фамилию"];
    }
    if (login === "") {
        errors["login"] = ["Введите логин"];
    }
    if (password === "") {
        errors["password"] = ["Введите пароль"];
    }

    if (Object.keys(errors).length > 0) {
        handleErrors(errors);
        return;
    }

    let data = {
        users: [
            {
                login: login,
                password: password,
                firstName: firstName,
                lastName: lastName,
                role: 1,
                groupId: null
            }
        ]
    }

    let onResponse = function (response) {
        let responseText = JSON.parse(response.responseText);

        if (responseText.type === "BadResponse") {
            handleErrors(responseText.errors);
        }
        else {
            window.location.reload();
        }
    }

    createUsers(JSON.stringify(data), onResponse);
}

let importFile = function (e) {
    var input = document.getElementById(inputId);
    var files = input.files;
    var formData = new FormData();

    for (var i = 0; i != files.length; i++) {
        formData.append("files", files[i]);
    }
}

let showCreateUser = function () {
    let modalContainer = $('.create-student-modal > .container');

    modalContainer.empty();
    modalContainer.append(
        `<div class="header">Новый студент</div>
            <input type="text" class="modal-input" id="firstname" placeholder="Имя" autocomplete="off" />
            <input type="text" class="modal-input" id="lastname" placeholder="Фамилия" autocomplete="off" />
            <input type="text" class="modal-input" id="login" placeholder="Логин" autocomplete="off" />
            <input type="password" class="modal-input" id="password" placeholder="Пароль" />
            <div class="footer">
                <input id="create-student-button" type="button" class="btn-action" value="Добавить" />
                <input type="button"
                    class="btn-cancel"
                    id="close-button"
                    value="Отмена" />
        </div>`);
}

let reloadModal = function () {
    let headerContainer = $(`<div class="header">Добавить студентов</div>
    <div class="container">
        <input type="button" id="new-user" class="btn-info" value="Новый студент" />
        <input type="file" name="file" id="import" class="input-file" />
        <label for="import" class="input-file">
            <i class="icon fa fa-check"></i>
            <span class="js-fileName">Загрузить файл</span>
        </label>
    </div>
    <div class="footer">
        <input type="button" id="close-button" class="btn-cancel" value="Закрыть">
    </div>`);

    modalElement = $(".create-student-modal");
    modalElement.empty();
    modalElement.append(headerContainer);

    $("#close-button").on("click", () => {
        modal.close();
        reloadModal();
    });

    $("#new-user").on("click", showNewUser);

    $("#import").on('change', function (e) {
        let input = document.getElementById('import');
        let files = input.files;

        if (files.length > 0) {

            // Добавить перечисление файлов
            fillFiles(files);

            // Добавить кнопку создания студентов
            addCreateUsersButton();
        }
        else {
            let createUsers = $(".create-student-modal .footer #create-users");
            createUsers.remove();
        }
    });
}

// Показать окно с созданием нового пользователя
let showNewUser = function () {
    let headerContainer = $(`<div class="header">Новый студент</div>
      <div class="container-width">
        <input
          type="text"
          class="modal-input"
          id="firstname"
          placeholder="Имя"
          autocomplete="off"
        />
        <input
          type="text"
          class="modal-input"
          id="lastname"
          placeholder="Фамилия"
          autocomplete="off"
        />
        <input type="text" class="modal-input" id="login" placeholder="Логин" autocomplete="off" />
        <input
          type="text"
          class="modal-input"
          id="password"
          placeholder="Пароль"
        />
      </div>
      <div class="footer">
        <input type="button" id="create-user" class="btn-action" value="Добавить" />
        <input
          type="button"
          class="btn-cancel"
          id="close-button"
          value="Отмена"
        />
      </div>`);

    let modalElement = $(".create-student-modal");
    modalElement.empty();
    modalElement.append(headerContainer);

    $("#create-user").on("click", createNewUser);
    $("#close-button").on("click", reloadModal);
}

let reloadInputs = function () {
    $("#firstname").removeClass("input-validation-error");
    $("#lastname").removeClass("input-validation-error");
    $("#login").removeClass("input-validation-error");
    $("#password").removeClass("input-validation-error");

    $("#firstname+.field-validation-error").remove();
    $("#lastname+.field-validation-error").remove();
    $("#login+.field-validation-error").remove();
    $("#password+.field-validation-error").remove();
}

let emptyInput = function () {
    $("#firstname").val('');
    $("#lastname").val('');
    $("#login").val('');
    $("#password").val('');
}

let handleErrors = function (errors) {
    $(".field-validation-error").each(function (index) {
        $(this).remove();
    });
    // Вывести ошибки
    for (let error in errors) {
        let inputElement = $(`#${error.toLowerCase()}`);
        for (let errorText of errors[error]) {
            let errorMessage = $(`<span class="field-validation-error">${errorText}</span>`);
            inputElement.after(errorMessage);
            inputElement.addClass("input-validation-error");
        }
    }
}

let createNotifications = function () {
    new Notify({
        status: 'error',
        title: 'Ошибка',
        text: '',
        effect: 'fade',
        speed: 1,
        customClass: '',
        customIcon: '',
        showIcon: true,
        showCloseButton: true,
        autoclose: true,
        autotimeout: 1,
        gap: 20,
        distance: 20,
        type: 1,
        position: 'right bottom',
        customWrapper: '',
    });
    let notifications = $(".notifications-container");
    notifications.remove();
    $(".create-student-modal").append(notifications);
}


$("#open-button").on("click", () => {
    modal.showModal();
    $("#new-user").on("click", showNewUser);
    createNotifications();
});

$("#close-button").on("click", () => {
    modal.close();
    reloadModal();
    $(".notifications-container").remove();
});

$("#reload-button").on("click", () => {
    let value = $("#student-name").val();
    updateStudents(
        {
            target: {
                value: value
            }
        });
});

let fillFiles = function (files) {
    let input = document.getElementById('import');
    let modalContainer = $(".create-student-modal .container");
    $(".create-student-modal .container .file").remove();

    for (var i = 0; i != files.length; i++) {
        console.log(files[i]);
        let file = $(`<div class="file">
                            <span class="file-name">${files[i].name}</span>                            
                          </div>`);
        let deleteFile = $(`<a href="#" class="delete-file">
                                    <i class="fa fa-solid fa-xmark"></i>
                                </a>`);
        deleteFile.on('click', () => {
            input.value = "";
            fillFiles([]);
            addCreateUsersButton();
        });

        file.append(deleteFile);
        modalContainer.append(file);
    }
}

let addCreateUsersButton = function () {
    let modalFooter = $(".create-student-modal .footer");
    let input = document.getElementById('import');
    let files = input.files;
    $(".create-student-modal .footer #create-users").remove();

    if (files.length == 0) {
        return;
    }

    let createUsersButton = $(`<input type="button" id="create-users" class="btn-action" value="Добавить"/>`);

    createUsersButton.on('click', () => {

        let formData = new FormData();
        for (var i = 0; i != files.length; i++) {
            formData.append("files", files[i]);
        }

        $.ajax(
            {
                url: "/users/create-from-file",
                data: formData,
                processData: false,
                contentType: false,
                type: "POST",
                success: function (data) {

                    if (data.type === "UsersDataResponse") {
                        window.location.reload();
                    }
                    else if (data.type === "ExceptionResponse") {
                        new Notify({
                            status: 'error',
                            title: 'Ошибка',
                            text: data.message,
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
                            type: 1,
                            position: 'right bottom',
                            customWrapper: '',
                        });
                    }
                }
            }
        );
    });
    modalFooter.append(createUsersButton);
}

$("#import").on('change', function (e) {
    let input = document.getElementById('import');
    let files = input.files;

    if (files.length > 0) {

        // Добавить перечисление файлов
        fillFiles(files);

        // Добавить кнопку создания студентов
        addCreateUsersButton();
    }
    else {
        let createUsers = $(".create-student-modal .footer #create-users");
        createUsers.remove();
        fillFiles([]);
    }
});

updateStudents(
    {
        target: {
            value: ""
        }
    });
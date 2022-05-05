// Открытие/закрытие модального окна создания группы
const modal = document.querySelector("#create-student-modal");
const openModal = document.querySelector("#open-button");
const closeModal = document.querySelector("#close-button");
const createButton = document.querySelector("#create-student-button");
const reloadButton = document.querySelector("#reload-button");

// Поиск групп (выпадающий список)
const searchInput = $("#student-name");
searchInput.on("input", updateStudents);
searchInput.val("").trigger("input");

// При вводе названия группы
function updateStudents(e) {
    let studentName = e.target.value;

    let data = {
        firstName: studentName,
        lastName: studentName
    };

    // Если строка пустая, то возвращаем все группы
    if (studentName === "") {
        data.firstName = null;
        data.lastName = null;
    }

    let onResponse = function (response) {
        fillStudents(JSON.parse(response.responseText));
    };

    getUsers(JSON.stringify(data), onResponse);
}

// Заполнение таблицы групп
function fillStudents(data) {
    let oldTableRows = $(".student");
    if (oldTableRows) {
        oldTableRows.remove();
    }

    let studentsTable = $(".students-table");

    for (user of data.users) {
        if (decoded["Claim.Key.Id"] == user.id) {
            continue;
        }
        let tableRow = $(`<tr class="student" value="${user.id}">` +
            `<td class="student-name">${user.lastName} ${user.firstName}</td>` +
            `<td class="description">${user.groupName == null ? '' : user.groupName}</td >` +
            '<td class="actions"> ' +
            '<div class="action"> ' +
            `<a href="/pages/student/${user.id}">Просмотр</a>` +
            '</div>' +
            '<div class="action">' +
            `<a href="#" onclick="deleteUser('${user.id}')" >Удалить</a>` +
            '</div>' +
            '</td>' +
            '</tr> ');
        studentsTable.append(tableRow);
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
        window.location.reload();
    }

    createUsers(JSON.stringify(data), onResponse);
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

openModal.addEventListener("click", () => {
    modal.showModal();

});

closeModal.addEventListener("click", () => {
    modal.close();
});

reloadButton.addEventListener("click", () => {
    let value = $("#student-name").val();
    updateStudents(
        {
            target: {
                value: value
            }
        });
});

createButton.addEventListener("click", createNewUser);


updateStudents(
    {
        target: {
            value: ""
        }
    });
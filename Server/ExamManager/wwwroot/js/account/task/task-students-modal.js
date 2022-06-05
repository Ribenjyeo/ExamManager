let allStudents = [];
let studentsToAdd = [];
let studentsToRemove = [];

const modal = document.querySelector("#add-students-modal");
const openModal = document.querySelector("#open-button");
const closeModal = document.querySelector("#close-button");

openModal.addEventListener("click", () => {
    modal.showModal();
});

closeModal.addEventListener("click", () => {
    modal.close();
});

// Поиск студентов
const searchToAdd = $("#search-to-add");
const searchToRemove = $("#search-to-remove");

searchToAdd.on('input', (e) => {
    updateStudents(e.target.value, false);
});
searchToRemove.on('input', (e) => {
    updateStudents(e.target.value, true);
});

function setupUsers() {
    let taskId = $('#taskId').attr('value');

    // Студенты, у которых нет текущего задания
    let data = {
        excludeYourself: true,
        excludeTaskIds: [taskId]
    };

    let onResponse = function (response) {

        for (let u of response.users) {
            studentsToAdd.push(u.id);
            allStudents.push({
                id: u.id,
                firstName: u.firstName,
                lastName: u.lastName,
                groupName: u.groupName,
                hasTask: true
            });
        }

        fillStudents(
            allStudents.filter((s) => studentsToAdd.includes(s.id)),
            allStudents.filter((s) => studentsToRemove.includes(s.id)
            ));
    };

    getUsers(data, onResponse);

    // Студенты, у которых есть текущее задание
    data = {
        excludeYourself: true,
        taskIds: [taskId]
    };

    onResponse = function (response) {

        for (let u of response.users) {
            studentsToRemove.push(u.id);
            allStudents.push({
                id: u.id,
                firstName: u.firstName,
                lastName: u.lastName,
                groupName: u.groupName,
                hasTask: false
            });
        }

        fillStudents(
            allStudents.filter((s) => studentsToAdd.includes(s.id)),
            allStudents.filter((s) => studentsToRemove.includes(s.id)
            ));
    };

    getUsers(data, onResponse);
}

// При вводе имени студента
function updateStudents(studentName, hasTask) {

    if (!hasTask) {
        let filterFunction = function (student) {
            return studentsToAdd.includes(student.id) &&
                (studentName === '' ||
                    student.firstName.includes(studentName) ||
                    student.lastName.includes(studentName));
        };

        fillStudents(
            allStudents.filter(filterFunction),
            allStudents.filter((s) => studentsToRemove.includes(s.id))
        );
        return;
    }
    else {
        let filterFunction = function (student) {
            return studentsToRemove.includes(student.id) &&
                (studentName === '' ||
                    student.firstName.includes(studentName) ||
                    student.lastName.includes(studentName));
        }
        fillStudents(
            allStudents.filter((s) => studentsToAdd.includes(s.id)),
            allStudents.filter(filterFunction)
        );

    }
}

// Заполнение таблицы студентов
function fillStudents(addStudents, removeStudents) {

    let oldListToAdd = $("#to-add .content");
    let oldListToRemove = $("#to-remove .content");

    oldListToAdd.empty();
    oldListToRemove.empty();

    addStudents.sort(sortNames);

    for (user of addStudents) {
        let userElement = $(`<div value="${user.id}" class="student">${user.lastName} ${user.firstName}</div>`);

        userElement.on('click', (e) => {
            let id = e.currentTarget.attributes['value'].value;

            studentsToAdd = studentsToAdd.filter((sId) => sId.toString() != id);
            studentsToRemove.push(id);

            updateStudents($("#search-to-add").val(), false);
            updateStudents($("#search-to-remove").val(), true);
        });
        oldListToAdd.append(userElement);
    }

    removeStudents.sort(sortNames);

    for (user of removeStudents) {
        let userElement = $(`<div value="${user.id}" class="student">${user.lastName} ${user.firstName}</div>`);

        userElement.on('click', (e) => {
            let id = e.currentTarget.attributes['value'].value;

            studentsToRemove = studentsToRemove.filter((sId) => sId.toString() != id);
            studentsToAdd.push(id);

            updateStudents($("#search-to-add").val(), false);
            updateStudents($("#search-to-remove").val(), true);
        });
        oldListToRemove.append(userElement);
    }
}

function sortNames(a, b) {
    if (a.lastName > b.lastName) {
        return 1;
    }
    else if (a.lastName < b.lastName) {
        return -1;
    }
    else {
        if (a.firstName > b.firstName) {
            return 1;
        }
        else if (a.firstName < b.firstName) {
            return -1;
        }
        return 0;
    }
}

setupUsers();
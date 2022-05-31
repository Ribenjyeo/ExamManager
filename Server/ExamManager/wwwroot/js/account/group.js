let studentsToAdd = [];

// Заполнение информации о студенте
let fillUserInfo = function (userInfo) {
    let studentInfo = $("#student-info");
    studentInfo.empty();

    if (userInfo == null) {
        return;
    }
    // Секция имени студента
    let studentName = $(`<div class="name"><span>${userInfo['lastName']} ${userInfo['firstName']}</span><a id="delete-user"><i class="fa fa-solid fa-trash-can"></i></a></div>`);
    
    studentInfo.attr("value", userInfo['id']);
    studentInfo.append(studentName);

    $("#delete-user").on("click", function (e) {
        let data = {
            students: [
                {
                    id: userInfo['id']
                }
            ]
        }

        removeGroupStudents(data, (response) => {
            fillUserInfo(null);
            let groupId = $(".students-table").attr('value');
            getGroupStudents(groupId, onStudentsInfoResponse);
        });
    });
}

let fillUserTasks = function (userTasks) {
    let studentInfo = $("#student-info");

    // Секция заданий студента
    let tasks = $('<div class="tasks"></div>');
    let tasksList = $('<div class="tasks-list"></div>');

    if (userTasks.length == 0) {
        tasksList.append($('<div class="title">Нет заданий</div>'));
    }
    else {
        for (let task of userTasks) {
            let taskElement = $(`<div class="task" status="${task.taskStatus == 0 ? 'failed' : 'success'}"><div class="title">${task.title}</div><div class="description">${task.description}</div></div>`);
            let taskFooter = $(`<div class="footer">
                                <a class="edit" href="/pages/task?id=${task.id}&student=${studentInfo.attr("value")}">
                                    <i class="fa fa-solid fa-pen"></i>
                                </a>
                            </div>`);
            let deleteTask = $('<a class="delete" href="#"><i class="fa fa-solid fa-trash"></i></a>');
            deleteTask.on("click", () => { deleteStudentTask(task.id) });

            taskFooter.append(deleteTask);
            taskElement.append(taskFooter);
            tasksList.append(taskElement);
        }
    }
    tasks.append(tasksList);

    // Секция футера
    let footer = $(`<div class="footer">
                        <a href="/pages/task/new?student=${studentInfo.attr("value")}" class="create-task">
                            <i class="fa-solid fa-circle-plus"></i>Добавить задание
                        </a>
                    </div>`);

    studentInfo.append(tasks);
    studentInfo.append(footer);
}

// При получении списка студентов
let onStudentsInfoResponse = function (response) {
    let studentsList = $("#students");

    let students = response.users;
    studentsList.empty();

    for (let student of students) {
        if (student.id === decoded["Claim.Key.Id"]) {
            continue;
        }
        let studentElement = $(`<div class="student" value="${student['id']}">${student['lastName']} ${student['firstName']}</div>`);

        let onSelected = function () {

            $(".student").each(function (index) {
                $(this).removeClass("hl");
            });
            studentElement.addClass("hl");

            getUser(student['id'], function (response) {
                // Передаем ответ в функцию заполнения информаци
                fillUserInfo(response);
                getUserTasks(student['id'], function (response) {

                    if (response.type != "ExceptionResponse") {
                        fillUserTasks(response.tasks);
                    }
                    else {
                        fillUserTasks([]);
                    }
                })
            });            
        }

        studentElement.on("click", onSelected);
        studentsList.append(studentElement);
    }
}

let deleteStudentTask = function (taskId) {

    let data = {
        taskId: taskId
    };

    let onResponse = function (response) {
        window.location.reload();
    }

    deleteTask(data, onResponse);
}

// При вводе имени студента
function updateStudents(e) {
    let studentName = e.target.value;
    let groupId = $(".students-table").attr('value');

    let data = {
        name: studentName,
        groupIds: [groupId]
    };

    // Если строка пустая, то возвращаем всех студентов
    if (studentName === "") {
        data.name = null;
        data.firstName = null;
        data.lastName = null;
    }

    getUsers(data, onStudentsInfoResponse);
}

let updateStudentsToAdd = function (e) {
    let studentName = e.target.value;
    let groupId = $(".students-table").attr('value');

    let data = {
        name: studentName,
        withoutGroup: true
    };

    // Если строка пустая, то возвращаем всех студентов
    if (studentName === "") {
        data.name = null;
        data.firstName = null;
        data.lastName = null;
    }

    getUsers(data, onStudentsToAddInfoResponse);
}

let onStudentsToAddInfoResponse = function (response) {
    let studentsList = $(".add-student-modal .students-list");

    let students = response.users;
    studentsList.empty();

    if (students === null) {
        return;
    }

    for (let student of students) {
        if (student.id === decoded["Claim.Key.Id"]) {
            continue;
        }
        let studentElement = $(`<div class="student" value="${student['id']}"><i class="fa fa-solid fa-user"></i><div class="name">${student['lastName']} ${student['firstName']}</div></div>`);

        if (studentsToAdd.some(s => s.id === student['id'])) {
            studentElement.addClass('hl');
        }

        let onSelected = function () {
            studentElement.toggleClass("hl");
            let studentId = studentElement.attr('value');
            // Если студент был в списке на добавление
            if (studentsToAdd.some(s => s.id === studentId)) {
                for (var i = 0; i < studentsToAdd.length; i++) {
                    if (studentsToAdd[i]["id"] === studentId) {
                        studentsToAdd.splice(i, 1);
                    }
                }
            }
            else {
                studentsToAdd.push({ id: studentId });
            }

        }
        studentElement.on("click", onSelected);
        studentsList.append(studentElement);
    }
}

let addStudents = function () {
    let groupId = $(".students-table").attr('value');
    let data = {
        groupId: groupId,
        students: studentsToAdd
    };

    let onResponse = function (response) {
        window.location.reload();
    }

    console.log(data);
    addGroupStudents(data, onResponse);
}

window.onload = function () {
    let groupId = $(".students-table").attr('value');
    getGroupStudents(groupId, onStudentsInfoResponse);

    const modal = document.querySelector("#add-student-modal");
    const openModal = document.querySelector("#open-modal");
    const closeModal = document.querySelector("#close-modal");
    const addStudentsButton = document.querySelector("#add-students-button");

    openModal.addEventListener("click", () => {
        modal.showModal();
        searchInput.val("").trigger("input");
    });

    closeModal.addEventListener("click", () => {
        modal.close();
        let studentsList = $(".add-student-modal .students-list");
        studentsList.empty();
        studentsList.append($('<div class="loader"></div>'));
        studentsToAdd = [];
    });

    addStudentsButton.addEventListener("click", () => {
        addStudentsButton.disabled = true;
        addStudents();
    });

    let searchInput = $("#search-student-name");
    searchInput.on("input", updateStudents);
    searchInput.val("").trigger("input");

    searchInput = $("#search-add-students");
    searchInput.on("input", updateStudentsToAdd);
}
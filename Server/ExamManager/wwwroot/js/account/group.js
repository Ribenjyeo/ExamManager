// Заполнение информации о студенте
let fillUserInfo = function (userInfo) {
    let studentInfo = $("#student-info");
    studentInfo.empty();
    console.log(userInfo);
    let studentName = $(`<div class="name">${userInfo['lastName']} ${userInfo['firstName']}</div>`);
    let tasks = $('<div class="tasks"></div>')
    for (let task of userInfo.tasks) {
        let taskElement = $(`<div class="task"><a href="/pages/task?id=${task.id}&student=${userInfo['id']}" class="title">${task.title}</a><div class="status">Выполнено</div></div>`);
        tasks.append(taskElement);
    }

    studentInfo.attr("value", userInfo['id']);
    studentInfo.append(studentName);
    studentInfo.append(tasks);
}

// При получении списка студентов
let onStudentsInfoResponse = function (response) {
    let studentsList = $("#students");
    let students = JSON.parse(response.responseText).users;
    studentsList.empty();

    for (let student of students) {
        let studentElement = $(`<div class="student" value="${student['id']}">${student['lastName']} ${student['firstName']}</div>`);

        let onSelected = function () {
            $(".student").each(function (index) {
                $(this).removeClass("hl");
            });
            studentElement.addClass("hl");

            getUser(student['id'], function (response) {
                // Передаем ответ в функцию заполнения информаци
                fillUserInfo(JSON.parse(response.responseText));
            });
        }

        studentElement.on("click", onSelected);
        studentsList.append(studentElement);
    }
}

window.onload = function () {
    let groupId = $(".students-table").attr('value');
    console.log(groupId);
    getGroupStudents(groupId, onStudentsInfoResponse);
}
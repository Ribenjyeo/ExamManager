const taskTitle = $("#task-title");
const taskDescription = $("#task-description");
const taskUrl = $("#task-url");

const path = window.location.pathname.split('/');
const taskType = path[path.length - 1];

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const studentId = urlParams.get('student');

let createNewTask = function () {

    let data = {
        title: taskTitle.val(),
        description: taskDescription.val(),
        url: taskUrl.val(),
        studentId: studentId,
        authorId: decoded["Claim.Key.Id"],
    }

    let onResponse = function (response) {
        window.location.replace(`/pages/tasks`);
    }

    createTask(data, onResponse);
}

let saveTask = function () {
    let data = {
        taskId: id,
        title: taskTitle.val(),
        description: taskDescription.val(),
        url: taskUrl.val()
    }

    let onResponse = function (response) {
        window.location.replace(`/pages/tasks`);
    }

    modifyTask(data, onResponse);
}

$(document).ready(function () {
    const saveButton = $("#save-button");
    console.log(taskType);
    if (taskType === "new") {
        saveButton.on("click", createNewTask);
    }
    else if(taskType === "task") {
        saveButton.on("click", saveTask);
    }
});
const taskTitle = $("#task-title");
const taskDescription = $("#task-description");
const taskUrl = $("#task-url");


const path = window.location.pathname.split('/');
const taskType = path[path.length - 1];

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

let createNewTask = function () {
    let vMachines = [];
    for (let element of document.querySelectorAll(".vmachine > input")) {
        if (element.value === '') {
            continue;
        }
        vMachines.push(
            {
                id: element.value
            });
    }

    let data = {
        title: taskTitle.val(),
        description: editor.getData(),
        students: studentsToRemove,
        virtualMachines: vMachines
    };

    let onResponse = function (response) {
        window.location.replace(`/pages/tasks`);
    }

    createTask(data, onResponse);
}

let saveTask = function () {
    let vMachines = [];
    for (let element of document.querySelectorAll(".vmachine > input")) {
        if (element.value === '') {
            continue;
        }

        vMachines.push(
            {
                id: element.value
            });
    }

    let data = {
        taskId: id,
        title: taskTitle.val(),
        description: editor.getData(),
        students: studentsToRemove,
        virtualMachines: vMachines
    }
    let onResponse = function (response) {
        window.location.replace(`/pages/tasks`);
    }

    modifyTask(data, onResponse);
}

$(document).ready(function () {
    const saveButton = $("#save-button");

    if (taskType === "new") {
        saveButton.on("click", createNewTask);
    }
    else if(taskType === "task") {
        saveButton.on("click", saveTask);
    }
});
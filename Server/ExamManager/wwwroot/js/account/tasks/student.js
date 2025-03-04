﻿$(document).ready(function () {
    const tasksList = $(".tasks-list");
    const userId = decoded["Claim.Key.Id"];

    let fillTasksList = function(tasks){
        tasksList.empty();

        for (let task of tasks) {
            let taskElement = $(`<div class="task" status="${task.taskStatus === 0 ? 'failed' : 'success'}"></div>`);
            let taskTitle = $(`<div class="title">${task.title}</div>`);
            let taskDescription = $(`<div class="description">${task.description.replace(/(?:\r\n|\r|\n)/g, '<br>')}</div>`);
            let taskFooter = $(`<div class="footer"><a href="/pages/task?id=${task.id}&student=${userId}" class="btn-info">Открыть</a></div>`);

            taskElement.append(taskTitle);
            taskElement.append(taskDescription);
            taskElement.append(taskFooter);

            tasksList.append(taskElement);
        }

        if (tasksList.children(".task").length == 0) {
            let tableDescription = $('<div class="description">Нет заданий</div>');
            tasksList.append(tableDescription);
            return;
        }
    }

    let onResponse = function (response) {
        let tasks = [];
        if (response.type != "BadResponse") {
            tasks = response.personalTasks[0].tasks;
        }
        fillTasksList(tasks);
    }

    getUserTasks(userId, onResponse);
});
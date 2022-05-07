$(document).ready(function () {
    const tasksList = $(".tasks-list");
    const userId = decoded["Claim.Key.Id"];

    let fillTasksList = function(tasks){
        tasksList.empty();

        for (let task of tasks) {
            let taskTitleElement = $(`<div class="title"><a href="/pages/task?id=${task.id}&student=${userId}">${task.title}</a><div class="description">${task.description}</div></div>`);
            let taskStatusElement = $(`<div class="status"></div>`);

            if (task.taskStatus == 0) {
                let taskStatusIcon = $('<i class="fa fa-solid fa-face-frown"></i>');
                taskStatusElement.append(taskStatusIcon);
            }
            else {
                let taskStatusIcon = $('<i class="fa fa-solid fa-face-smile"></i>');
                taskStatusElement.append(taskStatusIcon);
            }

            let taskElement = $('<div class="task"></div>');

            taskElement.append(taskTitleElement);
            taskElement.append(taskStatusElement);

            tasksList.append(taskElement);
        }
    }

    let onResponse = function (response) {
        let tasks = JSON.parse(response.responseText).tasks;
        fillTasksList(tasks);
    }

    getUserTasks(userId, onResponse);
});
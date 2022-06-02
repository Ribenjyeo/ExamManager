// Поиск заданий
const searchInput = $("#task-number");
searchInput.on("input", updateTasks);
searchInput.val("").trigger("input");

// При вводе названия или номера задания
function updateTasks(e) {

    let taskTitle = e.target.value;

    let data = {
        title: taskTitle
    };

    // Если строка пустая, то возвращаем все задания
    if (taskTitle === "") {
        data.title = null;
    }

    let onResponse = function (response) {
        fillTasks(response);
    };

    getTasks(data, onResponse);
}

// Заполнение таблицы групп
function fillTasks(data) {
    let oldTable = $(".table .body");
    if (oldTable) {
        oldTable.empty();
    }

    let tasksTableBody = $(".table>.body");

    for (task of data.tasks) {

        let tableRow = $(`<div class="row" task="${task.id}">` +
            `<div>${task.number}</div>` +
            `<div class="bold">${task.title != null ? task.title : "-"}</div>` +
            `<div>${task.description}</div >` +
            `<div>Количество: ${0}</div >` +
            '</div> ');


        let actionsColumn = $('<div class="actions"> ' +
            `<a class="edit" href="/pages/task?id=${task.id}">` +
            '<i class="fa fa-solid fa-pen"></i>' +
            '</a>' +
            '</div>');

        let deleteButton = $(`<a class="delete">` +
            '<i class="fa fa-solid fa-trash"></i>' +
            '</a>');

        deleteButton.on("click", function (e) {
            let id = $(this).closest(".row").attr("task");
            let data = {
                taskId: id
            };
            deleteTask(data, onDeleteResponse);
        });

        actionsColumn.append(deleteButton);
        tableRow.append(actionsColumn);

        tasksTableBody.append(tableRow);
    }

    if (tasksTableBody.children(".row").length == 0) {
        let tableDescription = $('<div class="description">Нет заданий</div>');
        tasksTableBody.append(tableDescription);
        return;
    }

    applyTableTemplate();
}

let onDeleteResponse = function (data) {
    if (data.type === "BadResponse") {
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
            autotimeout: 3000,
            gap: 20,
            distance: 20,
            type: 1,
            position: 'right bottom',
            customWrapper: '',
        });

        return;
    }

    searchInput.trigger("input");
}

updateTasks({
    target: {
        value: ""
    }
});


// Поиск заданий
const searchInput = $("#group-name");
searchInput.on("input", updateGroups);
searchInput.val("").trigger("input");

// При вводе названия или номера задания
function updateGroups(e) {

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

    let groupsTableBody = $(".table>.body");

    let index = 1;
    for (group of data.groups) {

        let tableRow = $(`<div class="row" group="${group.id}">` +
            `<div>${index}</div>` +
            `<div class="bold">${group.name}</div>` +
            `<div>Количество: ${group.studentsCount}</div >` +
            '</div> ');


        let actionsColumn = $('<div class="actions"> ' +
            `<a class="edit" href="/pages/group/${group.id}">` +
            '<i class="fa fa-solid fa-eye"></i>' +
            '</a>' +
            '</div>');

        let deleteButton = $(`<a class="delete">` +
            '<i class="fa fa-solid fa-trash"></i>' +
            '</a>');

        deleteButton.on("click", function (e) {
            deleteGroup(group.id, function (reponse) {
                window.location.reload();
            });
        });

        actionsColumn.append(deleteButton);
        tableRow.append(actionsColumn);

        groupsTableBody.append(tableRow);
        index += 1;
    }

    applyTableTemplate();
}
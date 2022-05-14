// Открытие/закрытие модального окна создания группы
const modal = document.querySelector("#create-group-modal");
const openModal = document.querySelector("#open-button");
const closeModal = document.querySelector("#close-button");
const createButton = document.querySelector("#create-group-button");

openModal.addEventListener("click", () => {
    modal.showModal();    
});

closeModal.addEventListener("click", () => {
    modal.close();
    $("#create-group-name").val("");
});

createButton.addEventListener("click", () => {
    let onResponse = function (response) {
        window.location.reload();
    };

    let data = JSON.stringify({
        name: $("#create-group-name").val()
    });

    createGroup(data, onResponse);
});

// Поиск групп (выпадающий список)
const searchInput = $("#group-name");
searchInput.on("input", updateGroups);
searchInput.val("").trigger("input");

// При вводе названия группы
function updateGroups(e) {

    let groupName = e.target.value;

    let data = JSON.stringify({
        name: groupName,
        minStudentsCount: null,
        maxStudentsCount: null
    });

    // Если строка пустая, то возвращаем все группы
    if (groupName === "") {
        data.name = null;
    }

    let onResponse = function (response) {
        fillGroups(JSON.parse(response.responseText));
    };

    getGroups(data, onResponse);
}

// Заполнение таблицы групп
function fillGroups(data) {
    let oldTable = $(".groups-table .body");
    if (oldTable) {
        oldTable.empty();
    }

    let groupsTableBody = $(".groups-table>.body");

    let index = 1;
    for (group of data.groups) {

        let tableRow = $(`<div class="row" group="${group.id}">` +
                            `<div>${index}</div>` +
                            `<div class="group-name">${group.name}</div>` +
                            `<div class="description">Количество: ${group.studentsCount}</div >` +
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
}
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
});

createButton.addEventListener("click", () => {
    let onResponse = function (response) {
        window.location.reload();
    };

    console.log("Имя новой группы " + $("#create-group-name").val());
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
    let oldTableRows = $(".group");
    if (oldTableRows) {
        oldTableRows.remove();
    }

    let groupsTable = $(".groups-table");

    for (group of data.groups) {
        let tableRow = $(`<tr class="group" value="${group.id}">` +
                            `<td class="group-name">${group.name}</td>` +
                            `<td class="description">Количество: ${group.studentsCount}</td >` +
                            '<td class="actions"> ' +
                                '<div class="action"> ' +
                                    `<a href="/pages/group/${group.id}">Просмотр</a>` +
                                '</div>' +
                                '<div class="action">' +
                                    '<a href="#">Удалить</a> ' +
                                '</div>' +
                            '</td>' +
                        '</tr> ');
        groupsTable.append(tableRow);
    } 
}

// Создание группы
const createGroupButton = $("#create-group-btn");
createGroupButton.on("click", createGroup);

function createNewGroup(e) {
    let groupName = $("#group-name");

    // Создать группу

    groupName.value = "";
}
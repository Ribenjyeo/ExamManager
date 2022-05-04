// Открытие/закрытие модального окна создания группы
const modal = document.querySelector("#create-group-modal");
const openModal = document.querySelector("#open-button");
const closeModal = document.querySelector("#close-button");

openModal.addEventListener("click", () => {
    modal.showModal();
});

closeModal.addEventListener("click", () => {
    modal.close();
});

// Поиск групп (выпадающий список)
const searchInput = document.querySelector("#search-groups");
searchInput.addEventListener("input", updateGroups);

function updateGroups(e) {
    const groupName = e.target.value;
    console.log(groupName);
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function () {
        console.log("Response: " + this.responseText);
        fillGroups(JSON.parse(this.responseText));
    };
    xmlhttp.open("GET", "/get-groups?name=" + groupName);
    xmlhttp.send();
}

function fillGroups(groups) {
    let content = document.createElement("div");
    content.className = "content";
    content.id = "groups-container";
    for (group of groups) {
        console.log(group);
        let searchItem = document.createElement("div");
        searchItem.className = "search-item";
        searchItem.setAttribute("value", group.objectid);

        let link = document.createElement("a");
        link.className = "header";
        link.innerHTML = group.name;

        searchItem.appendChild(link);
        content.appendChild(searchItem);
    }
    const searchForm = document.querySelector(".search-form");
    const oldContainer = document.querySelector("#groups-container");
    console.log(searchForm);
    if (oldContainer != null) {
        searchForm.removeChild(oldContainer);
    }    
    searchForm.appendChild(content);
}

// Создание группы
const createGroupButton = document.querySelector("#create-group-btn");
createGroupButton.addEventListener("click", createGroup);

function createGroup(e) {
    let groupName = document.querySelector("#group-name");
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function () {
        openGroup(JSON.parse(this.responseText));
    };
    xmlhttp.open("GET", "create-group?name=" + groupName.value);
    xmlhttp.send();
    modal.close();
    groupName.value = "";
}

function getGroup(groupId) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function () {
        openGroup(JSON.parse(this.responseText));
    };
    xmlhttp.open("GET", "get-group?id=" + groupId);
    xmlhttp.send();
}

function openGroup(group) {
    console.log(group);
}
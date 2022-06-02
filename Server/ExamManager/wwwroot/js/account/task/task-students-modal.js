const modal = document.querySelector("#add-students-modal");
const openModal = document.querySelector("#open-button");
const closeModal = document.querySelector("#close-button");

openModal.addEventListener("click", () => {
    modal.showModal();
});

closeModal.addEventListener("click", () => {
    modal.close();
});

// ����� ���������
const searchToAdd = $("#search-to-add");
const searchToRemove = $("#search-to-remove");

searchToAdd.on('input', (e) => {
    updateStudents(e, false);
});
searchToRemove.on('input', (e) => {
    updateStudents(e, true);
});

// ��� ����� ����� ��������
function updateStudents(e, hasTask) {

    let studentName = e.target.value;
    let taskId = $('#taskId').attr('value');

    let data = {
        name: studentName
    };

    if (hasTask) {
        data['taskIds'] = [taskId]
    }
    else {
        data['excludeTaskIds'] = [taskId]
    }

    // ���� ������ ������, �� ���������� ���� ���������
    if (studentName === "") {
        data.name = null;
    }

    let onResponse = function (response) {
        fillStudents(response, hasTask);
    };

    getUsers(data, onResponse);
}

// ���������� ������� ���������
function fillStudents(data, hasTask) {
    let oldList = $("#to-add .content");
    if (oldList) {
        oldList.empty();
    }

    
    for (user of data.users) {

        let userElement = $(`<div value="${user.id}" class="student">${user.lastName} ${user.firstName}</div>`);

        userElement.on('click', () => {
            let id = $(this).attr("class");
            let taskId = $('#taskId').attr('value');

            let data = {
                tasks: [
                    {
                        id: taskId
                    }
                ]
            };

            if (hasTask) {
                removePersonalTasks(id, data, onResponse);
            }
            else {
                addPersonalTasks(id, data, onResponse);
            }
        })

        oldList.append(userElement);
    }

}

updateStudents({
    target: {
        value: ""
    }
}, true);

updateStudents({
    target: {
        value: ""
    }
}, false);
let addButton = $('.add-vmachine');

let addVMachine = function () {
    let newVMachine = $(`
            <div class="vmachine">
              <input type="text"/>
            </div>`);
    let deleteButton = $(`
              <a class="delete">
                <i class="fa fa-solid fa-trash"></i>
              </a>`);

    deleteButton.on('click', () => {
        let current = deleteButton;
        console.log(current);
        current.parent().remove();
    });
    newVMachine.append(deleteButton);
    newVMachine.insertBefore(addButton);
}

let setupVMachinesList = function () {
    let taskId = $('#taskId').attr('value');

    let onResponse = function (response) {
        for (let vm of response.virtualMachines) {
            let newVMachine = $(`
            <div class="vmachine">
              <input type="text" value="${vm.id}"/>
            </div>`);
            let deleteButton = $(`
              <a class="delete">
                <i class="fa fa-solid fa-trash"></i>
              </a>`);

            deleteButton.on('click', () => {
                let current = deleteButton;
                console.log(current);
                current.parent().remove();
            });
            newVMachine.append(deleteButton);
            newVMachine.insertBefore(addButton);
        }
    }

    getTask(taskId, onResponse);
}

addButton.on('click', addVMachine);
setupVMachinesList();
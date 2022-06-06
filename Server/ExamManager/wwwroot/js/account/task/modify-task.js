const studentsModal = document.querySelector("#add-students-modal");
const studentsOpenModal = document.querySelector("#students-open-button");
const studentsCloseModal = document.querySelector("#students-close-button");

studentsOpenModal.addEventListener("click", () => {
    studentsModal.showModal();
});

studentsCloseModal.addEventListener("click", () => {
    studentsModal.close();
});

const vmachinesModal = document.querySelector("#add-vmachines-modal");
const vmachinesOpenModal = document.querySelector("#vmachines-open-button");
const vmachinesCloseModal = document.querySelector("#vmachines-close-button");

vmachinesOpenModal.addEventListener("click", () => {
    vmachinesModal.showModal();
});

vmachinesCloseModal.addEventListener("click", () => {
    vmachinesModal.close();
});
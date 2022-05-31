let applyTableTemplate = function () {
    let tableTemplate = "grid-template-columns: ";
    for (let element of document.querySelectorAll(".header .row *")) {
        let elementSize = "";
        if (element.attributes["size"] != null) {
            elementSize = `${element.attributes["size"].value}fr`;
        }
        else {
            elementSize = "auto";
        }

        tableTemplate += elementSize + " ";
    }

    for (let element of document.querySelectorAll(".row")) {
        element.style = tableTemplate;
    }
}
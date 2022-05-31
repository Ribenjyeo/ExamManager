let handleRequest = function (url, method, data, onResponse) {
    $.ajax({
        url: url,
        method: method,
        processData: false,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(data),
        success: onResponse
    });
}

let getUser = function (userId, onResponse){
    handleRequest(`/user/${userId}`, "GET", null, onResponse);
}

let getUserTasks = function (userId, onResponse){
    handleRequest(`/user/${userId}/tasks`, "GET", null, onResponse);
}

let addPersonalTasks = function (userId, data, onResponse) {
    handleRequest(`/user/${userId}/tasks/add`, "POST", data, onResponse);
}

let removePersonalTasks = function (userId, data, onResponse) {
    handleRequest(`/user/${userId}/tasks/remove`, "POST", data, onResponse);
}

let modifyUser = function (data, onResponse){
    handleRequest(`/user/modify`, "POST", data, onResponse);
}

let getUsers = function (data, onResponse){
    handleRequest(`/users`, "POST", data, onResponse);
}

let createUsers = function (data, onResponse){
    handleRequest(`/users/create`, "POST", data, onResponse);
}

let createUsersFromFile = function (data, onResponse) {
    handleRequest(`/users/create-from-file`, "POST", data, onResponse);
}

let deleteUsers = function (data, onResponse){
    handleRequest(`/users/delete`, "POST", data, onResponse);
}

let getTasks = function (data, onResponse){
    handleRequest(`/tasks`, "POST", data, onResponse);
}

let getTask = function (taskId, onResponse){
    handleRequest(`/task/${taskId}`, "GET", null, onResponse);
}

let createTask = function (data, onResponse){
    handleRequest(`/task/create`, "POST", data, onResponse);
}

let deleteTask = function (data, onResponse){
    handleRequest(`/task/delete`, "POST", data, onResponse);
}

let modifyTask = function (data, onResponse){
    handleRequest(`/task/modify`, "POST", data, onResponse);
}

let startTask = function (virtualMachineId, onResponse){
    handleRequest(`/task/start/${virtualMachineId}`, "GET", null, onResponse);
}

let stopTask = function (virtualMachineId, onResponse) {
    handleRequest(`/task/stop/${virtualMachineId}`, "GET", null, onResponse);
}

let getGroup = function (groupId, onResponse){
    handleRequest(`/group/${groupId}`, "GET", null, onResponse);
}

let deleteGroup = function (groupId, onResponse) {
    handleRequest(`/group/${groupId}/delete`, "GET", null, onResponse);
}

let getGroupStudents = function (groupId, onResponse){
    handleRequest(`/group/${groupId}/students`, "GET", null, onResponse);
}

let createGroup = function (data, onResponse){
    handleRequest(`/group/create`, "POST", data, onResponse);
}

let addGroupStudents = function (data, onResponse) {
    handleRequest(`/group/students/add`, "POST", data, onResponse);
}

let removeGroupStudents = function (data, onResponse){
    handleRequest(`/group/students/remove`, "POST", data, onResponse);
}

let getGroups = function (data, onResponse){
    handleRequest(`/groups`, "POST", data, onResponse);
}
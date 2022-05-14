let handleRequest = function (url, method, body, onResponse) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open(method, url);
    xmlhttp.setRequestHeader("Accept", "application/json");
    xmlhttp.setRequestHeader("Content-Type", "application/json");

    //if (useJwt) {
    //    const token = Cookies.get("token");
    //    xmlhttp.setRequestHeader('Authorization', 'Bearer ' + token);
    //}

    xmlhttp.onload = function () {
        if (onResponse) {
            onResponse(this);
        }
    };

    if (body) {
        console.log(body);
        xmlhttp.send(body);
    }
    else {
        xmlhttp.send();
    }
}

let getUser = function (userId, onResponse){
    handleRequest(`/user/${userId}`, "GET", null, onResponse);
}

let getUserTasks = function (userId, onResponse){
    handleRequest(`/user/${userId}/tasks`, "GET", null, onResponse);
}

let modifyUser = function (body, onResponse){
    handleRequest(`/user/modify`, "POST", body, onResponse);
}

let getUsers = function (body, onResponse){
    handleRequest(`/users`, "POST", body, onResponse);
}

let createUsers = function (body, onResponse){
    handleRequest(`/users/create`, "POST", body, onResponse);
}

let createUsersFromFile = function (body, onResponse) {
    handleRequest(`/users/create-from-file`, "POST", body, onResponse);
}

let deleteUsers = function (body, onResponse){
    handleRequest(`/users/delete`, "POST", body, onResponse);
}

let getTask = function (taskId, onResponse){
    handleRequest(`/task/${taskId}`, "GET", null, onResponse);
}

let createTask = function (body, onResponse){
    handleRequest(`/task/create`, "POST", body, onResponse);
}

let deleteTask = function (body, onResponse){
    handleRequest(`/task/delete`, "POST", body, onResponse);
}

let modifyTask = function (body, onResponse){
    handleRequest(`/task/modify`, "POST", body, onResponse);
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

let createGroup = function (body, onResponse){
    handleRequest(`/group/create`, "POST", body, onResponse);
}

let addGroupStudents = function (body, onResponse) {
    handleRequest(`/group/students/add`, "POST", body, onResponse);
}

let removeGroupStudents = function (body, onResponse){
    handleRequest(`/group/students/remove`, "POST", body, onResponse);
}

let getGroups = function (body, onResponse){
    handleRequest(`/groups`, "POST", body, onResponse);
}
const logoutButton = $("#logout");

const logout = function () {
    Cookies.remove("token");
    window.location.replace("/pages/login");
}

logoutButton.on('click', logout);

const token = Cookies.get("token");
const decoded = jwt_decode(token);
//const userId = decoded["Claim.Key.Id"];

const updateUserData = function (userData) {
    if (userData.firstName != null && userData.lastName != null) {
        let fullName = $('#user-name > span');
        fullName.empty();
        fullName.text(`${userData.lastName} ${userData.firstName}`);
    }
}

//$(document).ready(function () {
//    let onResponse = function (response) {
//        let responseBody = JSON.parse(response.responseText);

//        if (responseBody.type === "UserDataResponse") {
//            const userName = $("#user-name").children("span")[0];

//            console.log(responseBody);

//            userName.innerHTML = `${responseBody.firstName} ${responseBody.lastName}`;
//        }
//    }

//    getUser(userId, onResponse);
//});
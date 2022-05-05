const logoutButton = $("#logout");

const logout = function () {
    Cookies.remove("token");
    window.location.replace("/pages/login");
}

logoutButton.on('click', logout);

const userName = $("#user-name").children("a")[0];

const token = Cookies.get("token");
const decoded = jwt_decode(token);

document.onload(function () {
    userName.innerHTML = `${decoded["Claim.Key.FirstName"]} ${decoded["Claim.Key.LastName"]}`;
});
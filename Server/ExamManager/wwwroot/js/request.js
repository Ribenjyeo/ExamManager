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
        xmlhttp.send(body);
    }
    else {
        xmlhttp.send();
    }
}
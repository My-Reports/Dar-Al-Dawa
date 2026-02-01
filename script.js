const frame = document.getElementById("report-frame");

/* LOGIN WITHOUT PASSWORD */
function login() {
    switchScreen("report-screen");
}

function logout() {
    switchScreen("login-screen");
}

function openReport(url) {
    frame.src = url;
    switchScreen("viewer-screen");
}

function backToReports() {
    frame.src = "";
    switchScreen("report-screen");
}

function switchScreen(id) {
    document.querySelectorAll(".screen").forEach(s =>
        s.classList.remove("active")
    );
    document.getElementById(id).classList.add("active");
}

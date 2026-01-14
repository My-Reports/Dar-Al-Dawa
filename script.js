const user = document.getElementById("username");
const pass = document.getElementById("password");
const btn = document.getElementById("login-btn");
const frame = document.getElementById("report-frame");

const USER = "mkt";
const PASS = "Mkt.2026";

user.addEventListener("input", toggleBtn);
pass.addEventListener("input", toggleBtn);

function toggleBtn() {
    if (user.value && pass.value) {
        btn.classList.add("active");
        btn.disabled = false;
    } else {
        btn.classList.remove("active");
        btn.disabled = true;
    }
}

function login() {
    if (user.value === USER && pass.value === PASS) {
        switchScreen("report-screen");
    } else {
        alert("Invalid login");
    }
}

function logout() {
    user.value = "";
    pass.value = "";
    toggleBtn();
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
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

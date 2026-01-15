const user = document.getElementById("username");
const pass = document.getElementById("password");
const btn = document.getElementById("login-btn");
const frame = document.getElementById("report-frame");
const remember = document.getElementById("remember");
const togglePass = document.getElementById("toggle-password");

const USER = "mkt";
const PASS = "Mkt.2026";

// Load remembered username
window.onload = () => {
    const remembered = localStorage.getItem("username");
    if (remembered) {
        user.value = remembered;
        remember.checked = true;
        toggleBtn();
    }
}

user.addEventListener("input", toggleBtn);
pass.addEventListener("input", toggleBtn);

// Toggle password visibility
togglePass.addEventListener("click", () => {
    if (pass.type === "password") {
        pass.type = "text";
        togglePass.textContent = "Hide";
    } else {
        pass.type = "password";
        togglePass.textContent = "Show";
    }
});

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
        if (remember.checked) {
            localStorage.setItem("username", user.value);
        } else {
            localStorage.removeItem("username");
        }
        switchScreen("report-screen");
        // Chrome will automatically offer to save password because of autocomplete
    } else {
        alert("Invalid login");
    }
}

function logout() {
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

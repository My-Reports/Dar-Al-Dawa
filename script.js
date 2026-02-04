const frame = document.getElementById("report-frame");
const reportCards = document.querySelectorAll(".report-card");

/* LOGIN WITHOUT PASSWORD */
function login() {
    switchScreen("report-screen");
}

function logout() {
    switchScreen("login-screen");
    // إزالة الـ active عند العودة للّوجين
    reportCards.forEach(c => c.classList.remove("active"));
}

function openReport(url, cardElement = null) {
    frame.src = url;
    switchScreen("viewer-screen");

    // تفعيل الـ Active للكارد
    reportCards.forEach(c => c.classList.remove("active"));
    if (cardElement) cardElement.classList.add("active");
}

/* ربط الكارد بالـ Active */
reportCards.forEach(card => {
    card.addEventListener("click", () => {
        openReport(card.getAttribute("onclick").match(/'(.+?)'/)[1], card);
    });
});

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

/* =========================
   DAD Reporting System Pro
   - Bilingual (AR/EN)
   - Dark/Light
   - Jordan day/date/time (Asia/Amman)
   - Viewer actions in Topbar
   - Glassy FAB menu with dropdown (Home + reports)
========================= */

const screens = document.querySelectorAll(".screen");
const frame = document.getElementById("report-frame");
const cards = Array.from(document.querySelectorAll(".report-card"));
const viewerLoading = document.getElementById("viewerLoading");

const timeJO = document.getElementById("time-jo");

const toggleThemeBtn = document.getElementById("toggleThemeBtn");
const viewerActionsTop = document.getElementById("viewerActionsTop");
const reloadTopBtn = document.getElementById("reloadTopBtn");
const newTabTopBtn = document.getElementById("newTabTopBtn");

/* Language popup */
const langToggle = document.getElementById("langToggle");
const langDropdown = document.getElementById("langDropdown");
const langItems = Array.from(document.querySelectorAll(".lang-item"));

/* FAB menu */
const viewerMenuBtn = document.getElementById("viewerMenuBtn");
const viewerMenuDropdown = document.getElementById("viewerMenuDropdown");

/* ===== Translations ===== */
const i18n = {
  en: {
    appName: "DAD Reporting System",
    appSub: "Marketing Department",
    mktDept: "Marketing Department",
    reportingSystem: "Reporting System",
    username: "Username",
    userFixed: "User Fixed – No Password Required",
    enter: "Enter Dashboard",
    reportsTitle: "Reports",
    reportsSub: "Choose a report to open",
    logout: "Logout",
    menu: "Menu",
    home: "Home",
    loading: "Loading report…",
    loadingSub: "Please wait a moment",
    tooltipLang: "Language",
    tooltipTheme: "Theme",
    tooltipReload: "Reload",
    tooltipNewTab: "New Tab",
    poweredBy: "Powered by",

    r_ims: "IMS Overall Analysis",
    r_tms: "TMS Overall Analysis",
    r_iqvia: "IQVIA – MIDAS",
    r_pharma: "AMS – Pharma",
    r_medical: "AMS – Medical",
    r_ims2025: "2025 IMS Overall Analysis"
  },
  ar: {
    appName: "نظام تقارير DAD",
    appSub: "قسم التسويق",
    mktDept: "قسم التسويق",
    reportingSystem: "نظام التقارير",
    username: "اسم المستخدم",
    userFixed: "المستخدم ثابت – بدون كلمة مرور",
    enter: "دخول لوحة التقارير",
    reportsTitle: "التقارير",
    reportsSub: "اختر تقريرًا لفتحه",
    logout: "تسجيل خروج",
    menu: "القائمة",
    home: "الرئيسية",
    loading: "جارِ تحميل التقرير…",
    loadingSub: "يرجى الانتظار قليلًا",
    tooltipLang: "اللغة",
    tooltipTheme: "المظهر",
    tooltipReload: "تحديث",
    tooltipNewTab: "تبويب جديد",
    poweredBy: "Powered by",

    r_ims: "تحليل IMS الشامل",
    r_tms: "تحليل TMS الشامل",
    r_iqvia: "IQVIA – MIDAS",
    r_pharma: "AMS – الأدوية",
    r_medical: "AMS – الطبي",
    r_ims2025: "تحليل IMS الشامل 2025"
  }
};

let currentLang = localStorage.getItem("dad_lang") || "en";
let currentMode = localStorage.getItem("dad_mode") || "dark";

/* ===== Helpers ===== */
function switchScreen(id){
  screens.forEach(s => s.classList.remove("is-active"));
  document.getElementById(id).classList.add("is-active");

  const inViewer = id === "viewer-screen";
  viewerActionsTop.classList.toggle("is-visible", inViewer);
  if(!inViewer) setViewerMenu(false);

  window.scrollTo(0,0);
}

function setLangDropdown(open){
  langDropdown.classList.toggle("open", !!open);
  langToggle.setAttribute("aria-expanded", open ? "true" : "false");
}

function setViewerMenu(open){
  viewerMenuDropdown.classList.toggle("open", !!open);
  viewerMenuBtn.setAttribute("aria-expanded", open ? "true" : "false");
}

/* ===== Theme ===== */
function applyMode(mode){
  currentMode = mode;
  localStorage.setItem("dad_mode", mode);

  document.body.classList.remove("mode-dark","mode-light");
  document.body.classList.add(mode === "light" ? "mode-light" : "mode-dark");
}

toggleThemeBtn.addEventListener("click", ()=>{
  const isDark = document.body.classList.contains("mode-dark");
  applyMode(isDark ? "light" : "dark");
});

/* ===== Jordan date/time ===== */
function updateJordanTime(){
  const now = new Date();
  const locale = (currentLang === "ar") ? "ar-JO" : "en-GB";
  const formatted = new Intl.DateTimeFormat(locale, {
    timeZone: "Asia/Amman",
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(now);
  timeJO.textContent = `🇯🇴 ${formatted}`;
}
setInterval(updateJordanTime, 1000);

/* ===== Language ===== */
function updateLangUI(){
  langToggle.dataset.tooltip = i18n[currentLang].tooltipLang;
  toggleThemeBtn.dataset.tooltip = i18n[currentLang].tooltipTheme;
  reloadTopBtn.dataset.tooltip = i18n[currentLang].tooltipReload;
  newTabTopBtn.dataset.tooltip = i18n[currentLang].tooltipNewTab;

  document.documentElement.lang = currentLang;
  document.documentElement.dir = (currentLang === "ar") ? "rtl" : "ltr";

  langItems.forEach(btn=>{
    const isSel = btn.dataset.lang === currentLang;
    btn.classList.toggle("is-selected", isSel);
    btn.setAttribute("aria-checked", isSel ? "true" : "false");
  });
}

function applyLanguage(lang){
  currentLang = lang;
  localStorage.setItem("dad_lang", lang);

  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    const val = i18n[currentLang]?.[key];
    if(typeof val === "string") el.textContent = val;
  });

  updateLangUI();
  buildViewerMenu();   // refresh menu labels
  updateJordanTime();
}

/* bind language menu */
langToggle.addEventListener("click", (e)=>{
  e.stopPropagation();
  setLangDropdown(!langDropdown.classList.contains("open"));
});
document.addEventListener("click", (e)=>{
  if(!e.target.closest(".lang-menu")) setLangDropdown(false);
  if(!e.target.closest(".fab-menu")) setViewerMenu(false);
});
document.addEventListener("keydown", (e)=>{
  if(e.key === "Escape"){
    setLangDropdown(false);
    setViewerMenu(false);
  }
});
langItems.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    applyLanguage(btn.dataset.lang);
    setLangDropdown(false);
  });
});

/* ===== App flow ===== */
function login(){ switchScreen("report-screen"); }

function logout(){
  frame.src = "";
  cards.forEach(c=>c.classList.remove("active"));
  switchScreen("login-screen");
}

function backToReports(){
  frame.src = "";
  switchScreen("report-screen");
}

/* open report */
function openReportByCard(card){
  cards.forEach(c=>c.classList.remove("active"));
  card.classList.add("active");

  viewerLoading.style.display = "flex";
  frame.src = card.dataset.url;
  switchScreen("viewer-screen");
}

cards.forEach(card=>{
  card.addEventListener("click", ()=> openReportByCard(card));
});

/* viewer actions (topbar) */
reloadTopBtn.addEventListener("click", ()=>{
  if(!frame.src) return;
  viewerLoading.style.display = "flex";
  const current = frame.src;
  frame.src = current;
});

newTabTopBtn.addEventListener("click", ()=>{
  if(!frame.src) return;
  window.open(frame.src, "_blank", "noopener");
});

frame.addEventListener("load", ()=>{
  viewerLoading.style.display = "none";
  window.scrollTo(0,0);
});

/* ===== FAB menu dropdown (Home + reports) ===== */
function buildViewerMenu(){
  viewerMenuDropdown.innerHTML = "";

  const homeBtn = document.createElement("button");
  homeBtn.className = "fab-item";
  homeBtn.type = "button";
  homeBtn.innerHTML = `<span>${i18n[currentLang].home}</span><span class="fab-pill">🏠</span>`;
  homeBtn.addEventListener("click", ()=>{
    setViewerMenu(false);
    backToReports();
  });
  viewerMenuDropdown.appendChild(homeBtn);

  const divider = document.createElement("div");
  divider.className = "fab-divider";
  viewerMenuDropdown.appendChild(divider);

  cards.forEach(card=>{
    const key = card.getAttribute("data-i18n");
    const label = i18n[currentLang][key] || card.textContent.trim();

    const item = document.createElement("button");
    item.className = "fab-item";
    item.type = "button";
    item.innerHTML = `<span>${label}</span><span class="fab-pill">📊</span>`;
    item.addEventListener("click", ()=>{
      setViewerMenu(false);
      openReportByCard(card);
    });
    viewerMenuDropdown.appendChild(item);
  });
}

viewerMenuBtn.addEventListener("click", (e)=>{
  e.stopPropagation();
  setViewerMenu(!viewerMenuDropdown.classList.contains("open"));
});

/* ===== Init ===== */
applyMode(currentMode);
applyLanguage(currentLang);
updateJordanTime();
buildViewerMenu();
switchScreen("login-screen");
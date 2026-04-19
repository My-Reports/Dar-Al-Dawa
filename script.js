"use strict";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const screens = $$(".screen");
const frame = $("#report-frame");
const viewerLoading = $("#viewerLoading");

const timeJO = $("#time-jo");
const netStatus = $("#netStatus");

const toggleThemeBtn = $("#toggleThemeBtn");
const viewerActionsTop = $("#viewerActionsTop");
const reloadTopBtn = $("#reloadTopBtn");
const newTabTopBtn = $("#newTabTopBtn");

const langToggle = $("#langToggle");
const langDropdown = $("#langDropdown");
const langItems = $$(".lang-item");

const viewerMenuBtn = $("#viewerMenuBtn");
const viewerMenuDropdown = $("#viewerMenuDropdown");

const loginBtn = $("#login-btn");
const logoutBtn = $("#logoutBtn");

const reportsGrid = $("#reportsGrid");
const reportCards = () => $$(".report-card", reportsGrid);

const reportSearch = $("#reportSearch");
const clearSearch = $("#clearSearch");
const emptyState = $("#emptyState");
const openLastBtn = $("#openLastBtn");

const toastRegion = $("#toastRegion");

const i18n = {
  en: {
    appName: "DAD Reporting System",
    appSub: "Marketing Department",
    mktDept: "Marketing Department",
    reportingSystem: "Reporting System",
    username: "Username",
    enter: "Enter Dashboard",
    reportsTitle: "Reports",
    reportsSub: "Choose a report to open",
    logout: "Logout",
    home: "Home",
    loading: "Loading report…",
    loadingSub: "Please wait a moment",
    tooltipLang: "Language",
    tooltipTheme: "Theme",
    tooltipReload: "Reload",
    tooltipNewTab: "New Tab",
    poweredBy: "Powered by",
    welcomePill: "Welcome",
    searchPlaceholder: "Search reports…",
    noResults: "No matching reports",
    noResultsSub: "Try a different keyword.",
    openLast: "Open Last",
    openLastNone: "No last report yet",
    toastWelcomeTitle: "Welcome 👋",
    toastWelcomeSub: "Choose a report and start exploring insights.",
    toastOffline: "You are offline",
    toastOnline: "Back online",
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
    enter: "دخول لوحة التقارير",
    reportsTitle: "التقارير",
    reportsSub: "اختر تقريرًا لفتحه",
    logout: "تسجيل خروج",
    home: "الرئيسية",
    loading: "جارِ تحميل التقرير…",
    loadingSub: "يرجى الانتظار قليلًا",
    tooltipLang: "اللغة",
    tooltipTheme: "المظهر",
    tooltipReload: "تحديث",
    tooltipNewTab: "تبويب جديد",
    poweredBy: "Powered by",
    welcomePill: "مرحبًا",
    searchPlaceholder: "ابحث عن التقارير…",
    noResults: "لا توجد نتائج مطابقة",
    noResultsSub: "جرّب كلمة مختلفة.",
    openLast: "فتح الأخير",
    openLastNone: "لا يوجد تقرير سابق بعد",
    toastWelcomeTitle: "أهلًا 👋",
    toastWelcomeSub: "اختر تقريرًا وابدأ استكشاف المؤشرات.",
    toastOffline: "أنت غير متصل بالإنترنت",
    toastOnline: "تمت العودة للاتصال",
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

const STORAGE = {
  lastKey: "dad_last_report_key",
  welcomed: "dad_welcomed"
};

function switchScreen(id){
  screens.forEach(s => s.classList.remove("is-active"));
  const target = document.getElementById(id);
  if (target) target.classList.add("is-active");

  const inViewer = id === "viewer-screen";
  viewerActionsTop.classList.toggle("is-visible", inViewer);
  if(!inViewer) setViewerMenu(false);

  if (id === "login-screen") loginBtn?.focus?.();
  if (id === "report-screen") {
    reportSearch?.focus?.();
    reportCards().forEach((card, i) => {
      card.style.animation = `screenFade 0.4s ease-out ${i * 0.05}s both`;
    });
  }

  window.scrollTo({ top: 0, behavior: "instant" });
}

function setLangDropdown(open){
  langDropdown.classList.toggle("open", !!open);
  langToggle.setAttribute("aria-expanded", open ? "true" : "false");
}

function setViewerMenu(open){
  viewerMenuDropdown.classList.toggle("open", !!open);
  viewerMenuBtn.setAttribute("aria-expanded", open ? "true" : "false");
}

function toast({ title, sub, icon = "✨", timeout = 4200 }){
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `
    <div class="toast-ico" aria-hidden="true">${icon}</div>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      ${sub ? `<div class="toast-sub">${sub}</div>` : ``}
    </div>
    <button class="toast-close" type="button" aria-label="Close">✕</button>
  `;

  const close = () => {
    el.style.opacity = "0";
    el.style.transform = "translateX(20px)";
    setTimeout(() => el.remove(), 300);
  };

  el.querySelector(".toast-close").addEventListener("click", close);
  toastRegion.appendChild(el);

  if (timeout > 0) setTimeout(close, timeout);
}

function applyMode(mode){
  currentMode = mode;
  localStorage.setItem("dad_mode", mode);

  document.body.classList.remove("mode-dark","mode-light");
  document.body.classList.add(mode === "light" ? "mode-light" : "mode-dark");
}

toggleThemeBtn.addEventListener("click", () => {
  const isDark = document.body.classList.contains("mode-dark");
  applyMode(isDark ? "light" : "dark");
});

function updateJordanTime(){
  const now = new Date();
  const locale = (currentLang === "ar") ? "ar-JO" : "en-GB";
  let formatted = "";
  try{
    formatted = new Intl.DateTimeFormat(locale, {
      timeZone: "Asia/Amman",
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(now);
  }catch{
    formatted = now.toLocaleString();
  }
  timeJO.textContent = `🇯🇴 ${formatted}`;
}
setInterval(updateJordanTime, 1000);

function updateLangUI(){
  langToggle.dataset.tooltip = i18n[currentLang].tooltipLang;
  toggleThemeBtn.dataset.tooltip = i18n[currentLang].tooltipTheme;
  reloadTopBtn.dataset.tooltip = i18n[currentLang].tooltipReload;
  newTabTopBtn.dataset.tooltip = i18n[currentLang].tooltipNewTab;

  document.documentElement.lang = currentLang;
  document.documentElement.dir = (currentLang === "ar") ? "rtl" : "ltr";

  reportSearch.placeholder = i18n[currentLang].searchPlaceholder;

  langItems.forEach(btn => {
    const isSel = btn.dataset.lang === currentLang;
    btn.classList.toggle("is-selected", isSel);
    btn.setAttribute("aria-checked", isSel ? "true" : "false");
  });
}

function applyLanguage(lang){
  currentLang = lang;
  localStorage.setItem("dad_lang", lang);

  $$("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const val = i18n[currentLang]?.[key];
    if(typeof val === "string"){
      el.textContent = val;
    }
  });

  updateLangUI();
  buildViewerMenu();
  updateJordanTime();
}

langToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  setLangDropdown(!langDropdown.classList.contains("open"));
});

document.addEventListener("click", (e) => {
  if(!e.target.closest(".lang-menu")) setLangDropdown(false);
  if(!e.target.closest(".fab-menu")) setViewerMenu(false);
});

document.addEventListener("keydown", (e) => {
  if(e.key === "Escape"){
    setLangDropdown(false);
    setViewerMenu(false);
  }
});

langItems.forEach(btn => {
  btn.addEventListener("click", () => {
    applyLanguage(btn.dataset.lang);
    setLangDropdown(false);
  });
});

function login(){
  switchScreen("report-screen");

  if (!localStorage.getItem(STORAGE.welcomed)){
    toast({
      title: i18n[currentLang].toastWelcomeTitle,
      sub: i18n[currentLang].toastWelcomeSub,
      icon: "👋"
    });
    localStorage.setItem(STORAGE.welcomed, "1");
  }
}

function logout(){
  frame.src = "";
  reportCards().forEach(c => c.classList.remove("active"));
  switchScreen("login-screen");
}

function backToReports(){
  frame.src = "";
  switchScreen("report-screen");
}

function openReportByCard(card){
  if(!card) return;

  reportCards().forEach(c => c.classList.remove("active"));
  card.classList.add("active");

  viewerLoading.style.display = "flex";
  frame.src = card.dataset.url;

  if (card.dataset.key) localStorage.setItem(STORAGE.lastKey, card.dataset.key);

  switchScreen("viewer-screen");
}

reportsGrid.addEventListener("click", (e) => {
  const card = e.target.closest(".report-card");
  if(card) openReportByCard(card);
});

reportsGrid.addEventListener("pointermove", (e) => {
  const card = e.target.closest(".report-card");
  if(!card) return;
  const r = card.getBoundingClientRect();
  
  const rx = ((e.clientX - r.left) / r.width) * 100;
  const ry = ((e.clientY - r.top) / r.height) * 100;
  card.style.setProperty("--rx", rx + "%");
  card.style.setProperty("--ry", ry + "%");

  const xCenter = (e.clientX - r.left - r.width / 2);
  const yCenter = (e.clientY - r.top - r.height / 2);
  const rotateX = -(yCenter / (r.height / 2)) * 12; 
  const rotateY = (xCenter / (r.width / 2)) * 12;
  
  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale3d(1.02, 1.02, 1.02)`;
});

reportsGrid.addEventListener("pointerleave", (e) => {
  const card = e.target.closest(".report-card");
  if(card && !card.contains(e.relatedTarget)) {
      card.style.transform = ""; 
  }
}, true); 

loginBtn.addEventListener("click", login);
logoutBtn.addEventListener("click", logout);

document.addEventListener("keydown", (e) => {
  const activeLogin = document.getElementById("login-screen")?.classList.contains("is-active");
  if(activeLogin && e.key === "Enter"){
    e.preventDefault();
    login();
  }
});

reloadTopBtn.addEventListener("click", () => {
  if(!frame.src) return;
  viewerLoading.style.display = "flex";
  frame.src = frame.src;
});

newTabTopBtn.addEventListener("click", () => {
  if(!frame.src) return;
  window.open(frame.src, "_blank", "noopener");
});

frame.addEventListener("load", () => {
  viewerLoading.style.display = "none";
});

function buildViewerMenu(){
  viewerMenuDropdown.innerHTML = "";

  const homeBtn = document.createElement("button");
  homeBtn.className = "fab-item";
  homeBtn.type = "button";
  homeBtn.innerHTML = `<span>${i18n[currentLang].home}</span><span class="fab-pill">🏠</span>`;
  homeBtn.addEventListener("click", () => {
    setViewerMenu(false);
    backToReports();
  });
  viewerMenuDropdown.appendChild(homeBtn);

  const divider = document.createElement("div");
  divider.className = "fab-divider";
  viewerMenuDropdown.appendChild(divider);

  reportCards().forEach(card => {
    const key = card.getAttribute("data-i18n");
    const label = i18n[currentLang][key] || card.textContent.trim();

    const item = document.createElement("button");
    item.className = "fab-item";
    item.type = "button";
    item.innerHTML = `<span>${label}</span><span class="fab-pill">📊</span>`;
    item.addEventListener("click", () => {
      setViewerMenu(false);
      openReportByCard(card);
    });
    viewerMenuDropdown.appendChild(item);
  });
}

viewerMenuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  setViewerMenu(!viewerMenuDropdown.classList.contains("open"));
});

function filterReports(term){
  const q = (term || "").trim().toLowerCase();
  let visible = 0;

  reportCards().forEach(card => {
    const key = card.getAttribute("data-i18n");
    const label = (i18n[currentLang][key] || card.textContent || "").toLowerCase();

    const ok = !q || label.includes(q);
    card.hidden = !ok;
    if(ok) visible++;
  });

  emptyState.hidden = visible !== 0;
}

reportSearch.addEventListener("input", () => {
  const val = reportSearch.value || "";
  clearSearch.hidden = val.length === 0;
  filterReports(val);
});

clearSearch.addEventListener("click", () => {
  reportSearch.value = "";
  clearSearch.hidden = true;
  filterReports("");
  reportSearch.focus();
});

openLastBtn.addEventListener("click", () => {
  const lastKey = localStorage.getItem(STORAGE.lastKey);
  if(!lastKey){
    toast({ title: i18n[currentLang].openLastNone, icon: "🕘", timeout: 2600 });
    return;
  }
  const card = reportCards().find(c => c.dataset.key === lastKey);
  if(card) openReportByCard(card);
  else toast({ title: i18n[currentLang].openLastNone, icon: "🕘", timeout: 2600 });
});

function setNet(ok){
  if (!netStatus) return;
  netStatus.hidden = false;
  netStatus.textContent = ok ? i18n[currentLang].toastOnline : i18n[currentLang].toastOffline;
  netStatus.style.color = ok ? "var(--good)" : "var(--warn)";
  setTimeout(() => { netStatus.hidden = true; }, 3000);
}
window.addEventListener("offline", () => {
  setNet(false);
  toast({ title: i18n[currentLang].toastOffline, icon: "📴", timeout: 2600 });
});
window.addEventListener("online", () => {
  setNet(true);
  toast({ title: i18n[currentLang].toastOnline, icon: "✅", timeout: 2200 });
});

applyMode(currentMode);
applyLanguage(currentLang);
updateJordanTime();
buildViewerMenu();
switchScreen("login-screen");
filterReports("");
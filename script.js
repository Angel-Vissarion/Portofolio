// ---------- Helpers ----------
function setTheme(theme) {
  const body = document.body;
  const toggleBtn = document.getElementById("theme-toggle");

  body.classList.remove("dark-mode", "light-mode");
  body.classList.add(theme);

  // κουμπί
  if (theme === "dark-mode") {
    toggleBtn.textContent = "🌙";
    toggleBtn.style.background = "#222";
    toggleBtn.style.color = "#fff";
  } else {
    toggleBtn.textContent = "☀️";
    toggleBtn.style.background = "#eee";
    toggleBtn.style.color = "#000";
  }

  localStorage.setItem("theme", theme);
}

function showToast(msg, ok = true) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.dataset.ok = ok ? "1" : "0";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
}

// ---------- Theme init ----------
const toggleBtn = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("theme");

// Αν δεν έχει αποθηκευμένο, ξεκινάμε με ό,τι έχεις στο body (στο HTML έχεις dark-mode)
setTheme(savedTheme || (document.body.classList.contains("light-mode") ? "light-mode" : "dark-mode"));

toggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark-mode");
  setTheme(isDark ? "light-mode" : "dark-mode");
});

// ---------- Smooth scroll + Active nav ----------
const navLinks = document.querySelectorAll("nav a[href^='#']");
navLinks.forEach(a => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", id);
  });
});

const sections = document.querySelectorAll("main section, section#contact");
const linkById = new Map();
navLinks.forEach(a => linkById.set(a.getAttribute("href").slice(1), a));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navLinks.forEach(a => a.classList.remove("active"));
    const activeLink = linkById.get(id);
    if (activeLink) activeLink.classList.add("active");
  });
}, { threshold: 0.55 });

sections.forEach(s => io.observe(s));

// ===== Cookie Consent Popup =====
// ===== Cookie Consent =====
const COOKIE_CONSENT_NAME = "site_cookie_consent";
const COOKIE_CONSENT_DAYS = 180;
const COOKIE_CONSENT_VERSION = "1.0";

function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = [
    `${name}=${encodeURIComponent(value)}`,
    `expires=${d.toUTCString()}`,
    "path=/",
    "SameSite=Lax"
  ].join("; ");
}

function getCookie(name) {
  const row = document.cookie
    .split("; ")
    .find(item => item.startsWith(name + "="));

  if (!row) return null;
  return row.split("=")[1];
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

function getConsent() {
  const saved = getCookie(COOKIE_CONSENT_NAME);
  if (!saved) return null;

  try {
    const parsed = JSON.parse(decodeURIComponent(saved));

    if (!parsed || parsed.version !== COOKIE_CONSENT_VERSION) {
      return null;
    }

    return parsed;
  } catch (err) {
    return null;
  }
}

function saveConsent({ analytics }) {
  const consent = {
    version: COOKIE_CONSENT_VERSION,
    necessary: true,
    analytics: !!analytics,
    timestamp: new Date().toISOString()
  };

  setCookie(COOKIE_CONSENT_NAME, JSON.stringify(consent), COOKIE_CONSENT_DAYS);
  return consent;
}

function showCookiePopup() {
  const overlay = document.getElementById("cookie-overlay");
  const popup = document.getElementById("cookie-popup");
  const analyticsToggle = document.getElementById("cookie-analytics");

  if (!overlay || !popup) return;

  const consent = getConsent();
  if (analyticsToggle && consent) {
    analyticsToggle.checked = !!consent.analytics;
  }

  overlay.classList.remove("hidden");
  popup.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");
  popup.setAttribute("aria-hidden", "false");
  document.body.classList.add("cookie-modal-open");
}

function hideCookiePopup() {
  const overlay = document.getElementById("cookie-overlay");
  const popup = document.getElementById("cookie-popup");

  if (!overlay || !popup) return;

  overlay.classList.add("hidden");
  popup.classList.add("hidden");
  overlay.setAttribute("aria-hidden", "true");
  popup.setAttribute("aria-hidden", "true");
  document.body.classList.remove("cookie-modal-open");
}


  acceptBtn?.addEventListener("click", () => {
    const consent = saveConsent({ analytics: true });
    applyConsent(consent);
    hideCookiePopup();
    showToast("Οι επιλογές cookies αποθηκεύτηκαν.", true);
  });

  rejectBtn?.addEventListener("click", () => {
    const consent = saveConsent({ analytics: false });
    hideCookiePopup();
    showToast("Απορρίφθηκαν τα προαιρετικά cookies.", true);
  });

  saveBtn?.addEventListener("click", () => {
    const consent = saveConsent({
      analytics: !!analyticsToggle?.checked
    });

    applyConsent(consent);
    hideCookiePopup();
    showToast("Οι ρυθμίσεις cookies ενημερώθηκαν.", true);
  });

  closeBtn?.addEventListener("click", () => {
    hideCookiePopup();
  });

  overlay?.addEventListener("click", () => {
    hideCookiePopup();
  });

  manageBtn?.addEventListener("click", () => {
    showCookiePopup();
  });
})();


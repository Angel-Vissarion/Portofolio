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

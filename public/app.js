(() => {
  // Mobile menu
  const btn = document.getElementById("menuBtn");
  const menu = document.getElementById("mobileMenu");
  if (btn && menu) {
    btn.addEventListener("click", () => menu.classList.toggle("hidden"));
    menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => menu.classList.add("hidden")));
  }

  // Theme toggle (dark/light) + persist
  const html = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const sun = document.getElementById("sunIcon");
  const moon = document.getElementById("moonIcon");

  function setTheme(mode) {
    if (mode === "dark") html.classList.add("dark");
    else html.classList.remove("dark");
    localStorage.setItem("theme", mode);

    const isDark = html.classList.contains("dark");
    if (sun && moon) {
      sun.classList.toggle("hidden", !isDark);
      moon.classList.toggle("hidden", isDark);
    }
  }

  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(saved || (prefersDark ? "dark" : "light"));

  if (toggle) {
    toggle.addEventListener("click", () => {
      setTheme(html.classList.contains("dark") ? "light" : "dark");
    });
  }

  // Language toggle: reload with ?lang=ar|en and cookie will persist
  const langToggle = document.getElementById("langToggle");
  if (langToggle) {
    langToggle.addEventListener("click", () => {
      const url = new URL(window.location.href);
      const current = document.documentElement.lang || "en";
      const next = current === "ar" ? "en" : "ar";
      url.searchParams.set("lang", next);
      window.location.href = url.toString();
    });
  }

  // Reveal on scroll
  const els = Array.from(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && els.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(el => io.observe(el));
  } else {
    els.forEach(el => el.classList.add("is-visible"));
  }
})();

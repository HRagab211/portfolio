const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cookies for language preference
app.use(cookieParser());

// Security headers (CSP configured to allow Tailwind CDN safely for this project)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        // Tailwind CDN + our own scripts
        scriptSrc: ["'self'", "https://cdn.tailwindcss.com"],
        // Tailwind CDN injects styles; allow inline styles
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        fontSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: []
      }
    },
    crossOriginResourcePolicy: { policy: "same-site" }
  })
);

app.use(express.static(path.join(__dirname, "public")));

const profile = require("./src/profile");
const strings = require("./src/i18n/strings.json");

function getLang(req) {
  const q = (req.query.lang || "").toString().toLowerCase();
  if (q === "ar" || q === "en") return q;
  const c = (req.cookies.lang || "").toString().toLowerCase();
  if (c === "ar" || c === "en") return c;
  // Accept-Language fallback
  const al = (req.headers["accept-language"] || "").toLowerCase();
  if (al.includes("ar")) return "ar";
  return "en";
}

function t(lang, key) {
  const dict = strings[lang] || strings.en;
  return dict[key] || (strings.en && strings.en[key]) || key;
}

// Share i18n helpers with all views
app.use((req, res, next) => {
  const lang = getLang(req);
  res.locals.lang = lang;
  res.locals.dir = lang === "ar" ? "rtl" : "ltr";
  res.locals.t = (key) => t(lang, key);
  res.locals.profile = profile;
  next();
});

app.get("/", (req, res) => {
  // persist language if explicitly provided
  const q = (req.query.lang || "").toString().toLowerCase();
  if (q === "ar" || q === "en") res.cookie("lang", q, { maxAge: 365 * 24 * 3600 * 1000 });
  res.render("index");
});

app.get("/projects", (req, res) => {
  res.render("projects");
});

app.get("/projects/:slug", (req, res) => {
  const p = profile.projects.find((x) => x.slug === req.params.slug);
  if (!p) return res.status(404).render("404");
  res.render("project", { project: p });
});

app.get("/blog", (req, res) => {
  res.render("blog");
});

app.get("/blog/:slug", (req, res) => {
  const post = profile.blog.find((x) => x.slug === req.params.slug);
  if (!post) return res.status(404).render("404");
  res.render("post", { post });
});

app.get("/download/cv", (req, res) => {
  res.download(path.join(__dirname, "public", "assets", "Hossam_Ragab_CV.pdf"), "Hossam_Ragab_CV.pdf");
});

app.get("/health", (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

// Contact form rate limiter (per IP)
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false
});

app.post("/contact", contactLimiter, async (req, res) => {
  const { sendContactMail } = require("./src/mailer");
  const name = (req.body.name || "").toString().trim();
  const email = (req.body.email || "").toString().trim();
  const message = (req.body.message || "").toString().trim();

  const errors = [];
  if (!name || name.length < 2) errors.push("name");
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.push("email");
  if (!message || message.length < 10) errors.push("message");

  if (errors.length) {
    return res.status(400).render("contact-result", { ok: false, errors });
  }

  try {
    await sendContactMail({ name, email, message, to: profile.email });
    return res.render("contact-result", { ok: true, errors: [] });
  } catch (e) {
    return res.status(500).render("contact-result", { ok: false, errors: ["server"] });
  }
});

app.use((req, res) => {
  res.status(404).render("404");
});

app.listen(PORT, () => {
  console.log(`Portfolio running on http://localhost:${PORT}`);
});

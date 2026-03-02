# hossam-ragab-portfolio (Updated)

Modern personal portfolio for **Hossam Ragab Sedeek** built with **Node.js + Express + EJS** and styled with **Tailwind CSS (CDN)**.
Includes:
- ✅ Light/Dark mode toggle (saved in localStorage)
- ✅ English/Arabic localization (RTL/LTR) with language toggle (saved via cookie)
- ✅ Project case studies (`/projects/:slug`)
- ✅ Blog/Notes section (`/blog/:slug`)
- ✅ Download CV button (`/download/cv`)
- ✅ Contact form with rate limit + SMTP email (optional)
- ✅ Subtle reveal animations on scroll

## Run locally
```bash
npm install
npm run start
# open http://localhost:3000
```

## Add your photo
Put your photo here:
- `public/images/me.jpg`

If you don't add it, the site will show a default placeholder (`public/images/me.svg`).

## Change language
- Click AR/EN button in navbar
- Or open:
  - English: `/?lang=en`
  - Arabic: `/?lang=ar`

## Contact form (optional)
The contact form sends email via SMTP (Nodemailer). Create a `.env` file in the project root:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="Portfolio Contact" <your@gmail.com>
```

Then run:
```bash
npm start
```

If SMTP is not configured, the form will show an error message (the site still works).

## Security / CSP
Helmet CSP is configured to allow Tailwind CDN while still blocking unsafe sources.
If you want maximum security, you can switch to a local Tailwind build later.

## Customize content
Edit:
- `src/profile.js` (projects, skills, experience, blog posts, etc.)
- `src/i18n/strings.json` (UI translations)
# portfolio

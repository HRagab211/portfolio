const nodemailer = require("nodemailer");

/**
 * Configure SMTP via environment variables:
 * SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
 *
 * Example .env (do not commit secrets):
 * SMTP_HOST=smtp.gmail.com
 * SMTP_PORT=587
 * SMTP_USER=your@gmail.com
 * SMTP_PASS=app_password
 * SMTP_FROM="Portfolio Contact" <your@gmail.com>
 */
async function sendContactMail({ name, email, message, to }) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;

  if (!host || !user || !pass) {
    const err = new Error("SMTP_NOT_CONFIGURED");
    err.code = "SMTP_NOT_CONFIGURED";
    throw err;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });

  const subject = `New portfolio message from ${name}`;
  const text =
`Name: ${name}
Email: ${email}

Message:
${message}
`;

  await transporter.sendMail({
    from,
    to,
    replyTo: email,
    subject,
    text
  });
}

module.exports = { sendContactMail };

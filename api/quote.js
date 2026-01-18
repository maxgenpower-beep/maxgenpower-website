import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { fullName, company, email, phone, service, message } = req.body || {};

    if (!fullName || !email || !message) {
      return res.status(400).json({ ok: false, error: "Missing required fields" });
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return res.status(500).json({
        ok: false,
        error: "Missing env vars: GMAIL_USER / GMAIL_APP_PASSWORD"
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    await transporter.sendMail({
      from: `"Maxgen Website" <${process.env.GMAIL_USER}>`,
      to: "info@maxgenpower.com",
      replyTo: email,
      subject: `New Quote Request — ${fullName}${service ? ` (${service})` : ""}`,
      text:
`Name: ${fullName}
Company: ${company || "-"}
Email: ${email}
Phone: ${phone || "-"}
Service: ${service || "-"}

Message:
${message}
`
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("EMAIL ERROR:", err);
    return res.status(500).json({
      ok: false,
      error: err?.message || "Unknown server error"
    });
  }
}

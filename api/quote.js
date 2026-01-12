import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  const { fullName, company, email, phone, service, message } = req.body;

  if (!fullName || !email || !message) {
    return res.status(400).json({ ok: false });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Maxgen Website" <${process.env.GMAIL_USER}>`,
    to: "maxgenpower@gmail.com",
    replyTo: email,
    subject: `New Quote Request — ${fullName}`,
    text: `
Name: ${fullName}
Company: ${company || "-"}
Email: ${email}
Phone: ${phone || "-"}
Service: ${service || "-"}

Message:
${message}
    `,
  });

  res.status(200).json({ ok: true });
}

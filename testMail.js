const nodemailer = require("nodemailer")
require("dotenv").config()

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
})

transporter.sendMail({
  from: process.env.MAIL_USER,
  to: "chinnagamingyt13@gmail.com",
  subject: "Smart Food Test",
  text: "Email system is working!"
}).then(() => {
  console.log("✅ Mail sent successfully")
}).catch(err => console.log("❌ Mail error:", err))

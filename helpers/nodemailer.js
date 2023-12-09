const nodemailer = require("nodemailer");
require("dotenv").config();

const config = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "titoff.polina@meta.ua",
    pass: process.env.PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

const sendVerificationEmail = async (email, verificarionToken) => {
  const emailOptions = {
    from: "titoff.polina@meta.ua",
    to: email,
    subject: "Nodemailer test",
    text: "Привіт. Ми тестуємо надсилання листів!",
    html: `<div>
    <a href="http://localhost:3000/users/verify/${verificarionToken}" target="_blank">CLick to Verify</a>
    </div>`,
  };

  try {
    const sent = await transporter.sendMail(emailOptions);
    console.log("SENT", sent);
    return true;
  } catch (error) {
    console.log("Error", error);
    return false;
  }
};

module.exports = { sendVerificationEmail };

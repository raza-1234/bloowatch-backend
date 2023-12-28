const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async(email, subject, text, random_token) => {
  try {
    const transporter = await nodemailer.createTransport({
      service: process.env.SERVICE,
      port: process.env.EMAIL_PORT,
      secure: true,
      logger: true,
      debug: true,
      secureConnection: false,
      auth: {
        user: "ahmedraza.algolix@gmail.com",
        pass: "efau jwsn nvus pwgw"
      }
    })

    await transporter.sendMail({
      from: "ahmedraza.algolix@gmail.com",
      to: email,
      subject: subject,
      text: `Your Verification Code Is:\t${random_token}\n Click On The Given Link Below And Enter Your Verificatio-Code \n ${text} `,
    })
    console.log("Email sent successfully.");
  } catch (err){
    console.log("Email Not Sent", err);
  }
}

module.exports = {sendEmail}
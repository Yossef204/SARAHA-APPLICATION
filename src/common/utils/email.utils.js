import nodeMailer from "nodemailer";
export const sendMail = async ({ to, subject, html } = {}) => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "ym9798390@gmail.com",
      pass: process.env.PASSWORD_EMAIL_NODEMAILER,
    },
  });

  await transporter.sendMail({
    from: '"Saraha App"<ym9798390@gmail.com>',
    to: to,
    subject: subject,
    html: html,
  });
};

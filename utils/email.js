import transporter from "./smtp";

export const sendEmail = async (to, subject, text, isHtml = false) => {
  const mailOptions = {
    from: "nodemailer@mtmdigital.cl",
    to,
    subject,
    html: isHtml ?? text,
    text: isHtml ?? text,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const sendEmailWithAttachment = async (
  to,
  subject,
  text,
  isHtml = false,
  attachment
) => {
  const mailOptions = {
    from: "nodemailer@mtmdigital.cl",
    to,
    subject,
    html: isHtml ?? text,
    text: isHtml ?? text,
    attachments: attachment,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

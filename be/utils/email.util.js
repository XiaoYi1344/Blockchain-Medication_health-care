const nodemailer = require('nodemailer');

const createEmail = async (dataEmail) => {
  try {
    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.MY_EMAIL, // Email người gửi
      to: dataEmail.email, // Email người nhận
      subject: dataEmail.subject,
      text: `${dataEmail.text}.`,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw error
  }
}

module.exports = createEmail



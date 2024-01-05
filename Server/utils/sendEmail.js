const nodemailer = require("nodemailer");

const sendEmail = async (Role, email, token, _id) => {


    const transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        port: Number(process.env.EMAIL_PORT),
        secure: Boolean(process.env.SECURE),
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
    });

    const verificationLink = `https://holder.onrender.com/EmailVerification/${Role}/${_id}/${token}`;
    const mailOption = {
        from: process.env.USER,
        to: email,
        subject: "Account Verification",
        html: `<p>Click the following link to verify your email</P><p>click <a href="${verificationLink}">here</a></P><p>Expires in 2 days</p>`
    }

    await transporter.sendMail(mailOption, (error, info) => {
        if (error) {
            console.log("Error sending email:", error.message);
        } else {
            console.log("email sent successfully", info.message);
        }
    })

}

const ResetPassMail = async (Role, email, token, _id) => {


    const transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        port: Number(process.env.EMAIL_PORT),
        secure: Boolean(process.env.SECURE),
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
    })

    const verificationLink = `https://holder.onrender.com/ResetPassword/${Role}/${_id}/${token}`;
    const MailOption = {
        from: process.env.USER,
        to: email,
        subject: "Account Password Reset Link",
        html: `<p>Click the following link to Reset the password</P><p>click <a href="${verificationLink}">here</a>
        </p><p>Expires in 1 hours</p>`
    }

    await transporter.sendMail(MailOption, (error, info) => {
        if (error) {
            console.log("Error sending email for reset password:", error.message);
        } else {
            console.log("email sent successfully for password Reset", info.message);
        }
    })
}

module.exports = { sendEmail, ResetPassMail };
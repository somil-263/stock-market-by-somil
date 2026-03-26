const nodemailer = require('nodemailer');

const sendMail = async (userEmail, subject, text) => {
    try{
        const transporter = await nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: subject,
            text: text
        }
        
        await transporter.sendMail(mailOptions);

        console.log("Email sent successfully to ", userEmail);
    }
    catch(error){
        console.log("Can't be sent email", error);
        throw error;
    }
}

module.exports = sendMail;
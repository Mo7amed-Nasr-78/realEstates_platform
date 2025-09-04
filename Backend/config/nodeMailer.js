import nodeMailer from 'nodemailer';

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const sendMail = async (to, subject, text) => {
    return await transporter.sendMail({
        to: to,
        subject: subject,
        text: text
    }, (err) => { console.log(err) });
}

export default sendMail;
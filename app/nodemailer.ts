import nodemailer from "nodemailer"
import {setCache, getCache, getAddedTime} from "./cache";

let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false
    }
});


function sendVerificationCode(email: string) {
    return new Promise((resolve, reject) => {

        let sentTime = getAddedTime("emailVerify", email)
        if (sentTime < 60) {
            return reject(new Error(`Verification code sent recently, wait ${60 - sentTime}s`))
        }

        let code = Math.floor(100000 + Math.random() * 900000).toString();
        setCache("emailVerify", email, code, 60 * 60 * 1000)

        transporter.sendMail({
            from: "'Resumax' <admin@resumax.ir>",
            to: "nos486@gmail.com",
            subject: "Verification code",
            text: `Your verification code is ${code}. \r\nThe verification code will be valid for 60 minutes. Please do not share this code with anyone.`
        }).then((info) => {
            resolve(info)
        }).catch((err) => {
            reject(err)
        })
    })
}

function checkVerificationCode(email: string, code: string) {
    let c = getCache("emailVerify", email)
    console.log(c)
    if (c !== null) {
        return c === code;
    } else {
        return false
    }
}

export default transporter
export {sendVerificationCode, checkVerificationCode}
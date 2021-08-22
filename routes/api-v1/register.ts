import express, {Request, Response, NextFunction} from 'express';
import userController from "../../controllers/user";
import authenticateValidator from "../../validators/authenticate.validator";
import captcha from "../../middleware/captcha"
import jwtAuthorize from "../../middleware/jwt-authorize";
import {sendVerificationCode, checkVerificationCode} from "../../nodemailer";

const router = express.Router();

router.post('/', authenticateValidator.registerValidator, captcha.check, register);
router.get('/verifyemail', jwtAuthorize,sendVerifyEmail)
router.post('/verifyemail', jwtAuthorize,authenticateValidator.verifyEmailValidator,checkVerifyEmail)

function register(req: Request, res: Response, next: NextFunction) {
    const {username, email, password} = req.body;
    userController.createUser(username, email, password).then((user) => {
        res.status(201).json({message: "Account created successfully", ...user.toJSON()});
    }).catch(next);
}

function sendVerifyEmail(req: Request, res: Response, next: NextFunction) {
    if(req.user.isEmailVerified) next(new Error("Email address already verified."))

    sendVerificationCode(req.user.email).then(() => {
        res.status(200).json({message: "Verification code sent."});
    }).catch(next)
}

function checkVerifyEmail(req: Request, res: Response, next: NextFunction) {
    if (checkVerificationCode(req.user.email, req.body.code)) {
        req.user.isEmailVerified = true
        req.user.save().then(() => {
            res.status(200).json({message: "Email verify successfully", ...req.user.toJSON()});
        }).catch(next)
    } else {
        next(new Error("Verification code is not true."))
    }
}

export default router
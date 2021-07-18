import express, { Request, Response, NextFunction} from 'express';
import userController from "../controllers/user";
import Joi from "joi";
import captcha from "../middleware/captcha"
import validateRequest from "../middleware/validate-request";

const router = express.Router();

router.post('/',registerSchema,captcha.check, register);

function registerSchema(req:Request,res:Response,next:NextFunction) {
    const schema = Joi.object({
        username: Joi.string().required().min(4).max(20),
        email: Joi.string().required().email(),
        password: Joi.string().required(),
        captchaKey : Joi.string().required().uuid(),
        captcha : Joi.string().required().length(4),
    });
    validateRequest(req, next, schema);
}

function register(req:Request,res:Response,next:NextFunction) {
    const {username, email, password} = req.body;
    userController.createUser(username, email, password).then((user) => {
        res.status(201).json({message : "Account created successfully",...user.toJSON()});
    }).catch(next);
}

export default router
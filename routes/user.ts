import express, { Request, Response, NextFunction} from 'express';
import User, {IEducation, IExperience, IUser, ROLE} from "../models/user";
import Joi from "joi";
import userController from "../controllers/user";
import captcha from "../middleware/captcha"
import validateRequest from "../middleware/validate-request";
import jwtAuthorize from "../middleware/jwt-authorize";

const router = express.Router();


router.get('/',jwtAuthorize,getUser);


function getUser(req: Request, res: Response, next: NextFunction) {
    let user : IUser =  req.user
    res.json(user.toJSON())
}




export default router
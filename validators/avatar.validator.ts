import {NextFunction, Request, Response} from "express";
import Joi from "joi";
import validator from "../middleware/request-validator";


function setAvatarValidator(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        avatar: Joi.any()
    });
    validator.validateRequestBody(req, next, schema);
}


export default {
    setAvatarValidator
}
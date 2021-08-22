import {NextFunction, Request, Response} from "express";
import Joi from "joi";
import validator from "../middleware/request-validator";


function authenticateValidator(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        username: Joi.string().required().min(4).max(20),
        password: Joi.string().required(),
        key: Joi.string().required().uuid(),
        captcha: Joi.string().required().length(4),
    });
    validator.validateRequestBody(req, next, schema);
}

function refreshTokenValidator(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        token: Joi.string().required()
    });
    validator.validateRequestBody(req, next, schema);
}

function revokeTokenValidator(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        token: Joi.string().required()
    });
    validator.validateRequestBody(req, next, schema);
}

function registerValidator(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        username: Joi.string().required().min(5).max(20),
        email: Joi.string().required().email(),
        password: Joi.string().required(),
        key: Joi.string().required().uuid(),
        captcha: Joi.string().required().length(4),
    });
    validator.validateRequestBody(req, next, schema);
}

function verifyEmailValidator(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        code: Joi.string().required().min(4).max(20),
    });
    validator.validateRequestBody(req, next, schema);
}


export default {
    authenticateValidator,
    refreshTokenValidator,
    revokeTokenValidator,
    registerValidator,
    verifyEmailValidator
}
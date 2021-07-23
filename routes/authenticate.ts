import express, { Request, Response, NextFunction} from 'express';
import Joi from "joi";
import userController from "../controllers/user";
import tokenController from "../controllers/token";
import validateRequest from "../middleware/validate-request";
import jwtAuthorize from "../middleware/jwt-authorize";
import captcha from "../middleware/captcha";

const router = express.Router();



router.post('/',authenticateSchema,captcha.check,authenticate);
// router.post('/',authenticate);
router.post('/refresh',refreshTokenSchema, refreshToken);
router.post('/revoke', jwtAuthorize, revokeTokenSchema, revokeToken);


function authenticateSchema(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        username: Joi.string().required().min(4).max(20),
        password: Joi.string().required(),
        captchaKey : Joi.string().required().uuid(),
        captcha : Joi.string().required().length(4),
    });
    validateRequest(req, next, schema);
}

function authenticate(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;
    console.log(req.body)
    const ipAddress = req.ip;
    userController.authenticateUser(username, password,ipAddress)
        .then(({ ...user }) => {
            res.json(user);
        })
        .catch(next);
}

function refreshTokenSchema(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        token: Joi.string().required()
    });
    validateRequest(req, next, schema);
}


function refreshToken(req: Request, res: Response, next: NextFunction) {
    const {token} = req.body;
    const ipAddress = req.ip;
    tokenController.refreshToken(token, ipAddress )
        .then(({ ...user }) => {
            res.json(user);
        })
        .catch(next);
}


function revokeTokenSchema(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        token: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function revokeToken(req: Request, res: Response, next: NextFunction) {
    const {token} = req.body

    tokenController.deleteRefreshTokenCheckUser(req.user,token)
        .then(() => res.json({ message: 'Token revoked' }))
        .catch(next);
}



export default router
import express, {Request, Response, NextFunction} from 'express';
import userController from "../controllers/user";
import tokenController from "../controllers/token";
import authenticateValidator from "../validators/authenticate.validator";
import jwtAuthorize from "../middleware/jwt-authorize";
import captcha from "../middleware/captcha";

const router = express.Router();


router.post('/', authenticateValidator.authenticateValidator, captcha.check, authenticate);
// router.post('/',authenticate);
router.post('/refresh', authenticateValidator.refreshTokenValidator, refreshToken);
router.post('/revoke', jwtAuthorize, authenticateValidator.revokeTokenValidator, revokeToken);


function authenticate(req: Request, res: Response, next: NextFunction) {
    const {username, password} = req.body;
    console.log(req.body)
    const ipAddress = req.ip;
    userController.authenticateUser(username, password, ipAddress)
        .then(({...user}) => {
            res.json(user);
        })
        .catch(next);
}


function refreshToken(req: Request, res: Response, next: NextFunction) {
    const {token} = req.body;
    const ipAddress = req.ip;
    tokenController.refreshToken(token, ipAddress)
        .then(({...user}) => {
            res.json(user);
        })
        .catch(next);
}


function revokeToken(req: Request, res: Response, next: NextFunction) {
    const {token} = req.body

    tokenController.deleteRefreshTokenCheckUser(req.user, token)
        .then(() => res.json({message: 'Token revoked'}))
        .catch(next);
}


export default router
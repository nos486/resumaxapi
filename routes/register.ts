import express, { Request, Response, NextFunction} from 'express';
import userController from "../controllers/user";
import authenticateValidator from "../validators/authenticate.validator";
import captcha from "../middleware/captcha"

const router = express.Router();

router.post('/',authenticateValidator.registerValidator,captcha.check, register);

function register(req:Request,res:Response,next:NextFunction) {
    const {username, email, password} = req.body;
    userController.createUser(username, email, password).then((user) => {
        res.status(201).json({message : "Account created successfully",...user.toJSON()});
    }).catch(next);
}

export default router
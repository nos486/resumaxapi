import express, {Request, Response, NextFunction} from 'express';
import loginRouter from "./login"
import profileRouter from "./profile"
import User, {IUser} from "../../models/user";
import jwt, {JwtPayload, VerifyErrors} from "jsonwebtoken";
import config from "./../../config";
import UserController from "../../controllers/user";

const router = express.Router();
const userController: UserController = new UserController()

// const token =require( "./token");
// const register =require( "./register");
// const profile =require( "./profile");
// const avatar = require("./avatar")
// const path = require("path");
// const {ROLE} = require("../../models/enums");

// router.get('/', authorize(ROLE.ADMIN), getAll);
router.get('/', authorize,getOwnUser);
// router.get('/:username',authorize, getUserProfileByUsername);
// router.use('/avatar',avatar);
router.use("/login", loginRouter)
// router.use("/register",register)
router.use("/profile", profileRouter)

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

function authorize(req: Request, res: Response, next: NextFunction) {
    const bearerHeader = req.headers['authorization'];

    if (bearerHeader) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];

        jwt.verify(bearerToken, config.secret, (err, decoded) => {
            if (err) {
                return res.status(403).json({message: 'Forbidden'});
            } else {
                if (decoded != undefined){
                    userController.getUserById(decoded.id).then((user) => {
                        if (user != null) {
                            req.user = user
                            next()
                        }else {
                            return res.status(403).json({message: 'User not find!'});
                        }
                    }).catch((error: Error)=>{
                        return res.status(403).json({message: error.message});
                    })
                }else {
                    return res.status(403).json({message: 'Forbidden'});
                }
            }
        })

        // next();
    } else {
        // Forbidden
        return res.status(403).json({message: 'Forbidden'});
    }

}

//
// function getAll(req, res, next) {
//     userController.getAll()
//         .then(users => res.json(users))
//         .catch(next);
// }
//
function getOwnUser(req: express.Request, res: Response, next: NextFunction) {
    if(req.user != undefined)
    userController.getUserByUsername(req.user.username)
        .then(user => user ? res.json(user.toJSON()) : res.sendStatus(404))
        .catch(next);
}

// function getUserProfileByUsername(req, res, next) {
//     userController.getUserByUsername(req.params.username).then((user) =>{
//         if(req.params.username === req.user.username || req.user.role === ROLE.ADMIN){
//             res.json(user)
//         }else {
//             res.json(basicDetails(user))
//         }
//     }).catch(next);
// }
//
//
//
// //helpers
// function basicDetails(user) {
//     const { id, email, username, role } = user;
//     return { id, email, username, role };
// }

export default router
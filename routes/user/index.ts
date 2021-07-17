import express, {Request, Response, NextFunction} from 'express';
import loginRouter from "./login"
import profileRouter from "./profile"
import User, {IUser} from "../../models/user";
import UserController from "../../controllers/user";
import jwtAuthorize from "../../middleware/jwt-authorize";

const router = express.Router();
const userController: UserController = new UserController()

// const token =require( "./token");
// const register =require( "./register");
// const profile =require( "./profile");
// const avatar = require("./avatar")
// const path = require("path");
// const {ROLE} = require("../../models/enums");

// router.get('/', authorize(ROLE.ADMIN), getAll);
router.get('/', jwtAuthorize,getOwnUser);
// router.get('/:username',authorize, getUserProfileByUsername);
// router.use('/avatar',avatar);
router.use("/login", loginRouter)
// router.use("/register",register)
router.use("/profile", profileRouter)





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
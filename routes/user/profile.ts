import express, { Request, Response, NextFunction} from 'express';
import Joi from "joi"
import path from "path";
import UserController from "../../controllers/user";

const router = express.Router();
const userController :UserController = new UserController()

router.get('/:username', authorize);


function authorize(req: Request, res: Response, next: NextFunction){
    console.log(req)
}

// function getById(req: Request, res: Response, next: NextFunction) {
//     // regular users can get their own record and admins can get any record
//     // if (req.params.username !== req.user.username) {
//     //     return res.status(403).json({ message: 'Forbidden' });
//     // }
//     let fullDetail = req.params.username === req.user.username || req.user.role === ROLE.ADMIN
//     getUserByUsername(req.params.username,fullDetail).then((user) =>{
//         res.json(user)
//     }).catch(next);
// }
//
//
// //helpers
// function basicDetails(user) {
//     const { id, email, username, role } = user;
//     return { id, email, username, role };
// }


export default router
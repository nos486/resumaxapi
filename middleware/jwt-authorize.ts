import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import UserController from "../controllers/user";
import {IUser} from "../models/user";

const userController: UserController = new UserController()

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export default function jwtAuthorize(req: Request, res: Response, next: NextFunction) {
    const bearerHeader = req.headers['authorization'];

    if (bearerHeader) {
        const bearerToken = bearerHeader.split(' ')[1];

        jwt.verify(bearerToken, config.secret, (err, decoded) => {
            if (err) {
                return res.status(403).json({message: 'Forbidden'});
            } else {
                if (decoded != undefined) {
                    userController.getUserById(decoded.id).then((user) => {
                        if (user != null) {
                            req.user = user
                            next()
                        } else {
                            return res.status(403).json({message: 'User not find!'});
                        }
                    }).catch((error: Error) => {
                        return res.status(403).json({message: error.message});
                    })
                } else {
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
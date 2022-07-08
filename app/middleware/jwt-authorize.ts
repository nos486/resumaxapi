import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import userController from "../controllers/user";
import {IUser} from "../models/user";

declare global {
    namespace Express {
        interface Request {
            user: IUser;
        }
    }
}

export default function jwtAuthorize(req: Request, res: Response, next: NextFunction) {
    const bearerHeader = req.headers['authorization'];

    if (bearerHeader) {
        const bearerToken = bearerHeader.split(' ')[1];

        jwt.verify(bearerToken, process.env.SECRET, (err, decoded) => {
            if (err) {
                throw new Error('Invalid token')
            } else {
                if (decoded != undefined) {

                    // @ts-ignore
                    userController.getUserById(decoded.id).then((user) => {
                        if (user != null) {
                            req.user = user
                            next()
                        } else {
                            throw new Error('User not find!')
                        }
                    })
                } else {
                    throw new Error('Invalid token')
                }
            }
        })
    } else {
        // Forbidden
        throw new Error('Invalid token')
    }

}

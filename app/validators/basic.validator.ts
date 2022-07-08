import {NextFunction, Request, Response} from "express";
import mongoose from "mongoose";


function paramIdIsValidObjectId(req: Request, res: Response, next: NextFunction) {

    if (mongoose.isValidObjectId(req.params.id)){
        next()
    }else {
        next(new Error("Id not valid"))
    }
}


export default {
    paramIdIsValidObjectId
}
import {NextFunction, Request, Response} from "express";
import Joi from "joi";

function validateRequest(req: Request, next: NextFunction ,schema: Joi.ObjectSchema | Joi.ArraySchema) {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };

    const { error, value } = schema.validate(req.body, options);
    if (error) {
        // next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
        if(error.details.length == 1) {
            next(error.details[0])
        }else {
            next(error.details);
        }
    } else {
        req.body = value;
        next();
    }
}

export default validateRequest;

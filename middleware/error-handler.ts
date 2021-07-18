import {NextFunction, Request, Response} from "express";

function errorHandler(err: Error|Array<Error>, req:Request,res:Response,next:NextFunction) {
    console.log(err)
    if(Array.isArray(err)){
        return res.status(400).json( err.map((error)=> {
            return { message: error.message }
        }));
    }else {

        switch (true) {
            case err.name === 'Error':
                const is404 = err.name.toLowerCase().endsWith('not found');
                const statusCode = is404 ? 404 : 400;
                return res.status(statusCode).json({ message: err.message });

            case err.name === 'ValidationError':
                // mongoose validation error
                return res.status(400).json({ message: err.message });

            case err.message === 'Invalid token':
                // mongoose validation error
                return res.status(401).json({ message: err.message });
            case err.name === 'UnauthorizedError':
                // jwt authentication error
                try {
                    return res.status(401).json({ message: err.message });
                }catch (e) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }

            default:
                return res.status(500).json({ message: err.message });
        }
    }

}

export default errorHandler
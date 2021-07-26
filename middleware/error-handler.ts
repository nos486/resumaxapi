import {Request, Response,NextFunction} from "express";

function errorHandler(err: Error | Array<Error>, req: Request, res: Response,next:NextFunction) {
    if(process.env.NODE_ENV == "development") console.log(err)
    if (Array.isArray(err)) {
        return res.status(400).json(err.map((error) => {
            return {message: error.message}
        }));
    } else {
        switch (true) {
            case err.name === 'Error':
                if (err.message.toLowerCase().endsWith('not found')) {
                    return res.status(404).json({message: err.message});
                }
                if (err.message.toLowerCase().indexOf('forbidden') !== -1) {
                    return res.status(403).json({message: err.message});
                } else {
                    return res.status(400).json({message: err.message});
                }
            case err.name === 'ValidationError':
                // mongoose validation error
                return res.status(400).json({message: err.message});

            case err.message === 'Invalid token':
                // mongoose validation error
                return res.status(401).json({message: err.message});
            case err.name === 'UnauthorizedError':
                // jwt authentication error
                try {
                    return res.status(401).json({message: err.message});
                } catch (e) {
                    return res.status(401).json({message: 'Unauthorized'});
                }

            default:
                return res.status(500).json({message: err.message});
        }
    }

}

export default errorHandler
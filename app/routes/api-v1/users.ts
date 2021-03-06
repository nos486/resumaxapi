import express, {Request, Response, NextFunction} from 'express';
import userController from "../../controllers/user";

const router = express.Router();

router.get('/:username', getUserByUsername)

function getUserByUsername(req: Request, res: Response, next: NextFunction) {
    userController.getUserByUsername(req.params.username).then((user) => {
        res.json(user)
    }).catch(next)
}

export default router
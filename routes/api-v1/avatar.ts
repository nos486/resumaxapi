import express, {Request, Response, NextFunction} from 'express';
import userController from "../../controllers/user";
import jwtAuthorize from "../../middleware/jwt-authorize";
import avatarValidator from "../../validators/avatar.validator"
import basicValidator from "../../validators/basic.validator"
import fs from "fs";
import path from "path";
import multer from "multer"
import avatarBuilder from "avatar-builder"

const router = express.Router();

router.get('/:id',basicValidator.paramIdIsValidObjectId, getUserAvatarById);
router.post('/', jwtAuthorize, avatarValidator.setAvatarValidator, setAvatar);

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './files/avatars/')
    },
    filename: function (req, file, cb) {
        cb(null, req.user._id.toString())
    }
});

const uploadController = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG)$/)) {
            return cb(new Error('Only jpg files are allowed!'));
        }
        cb(null, true)
    },
    limits: {
        fileSize: 1024 * 1024
    }
}).single('avatar')


async function getUserAvatarById(req: Request, res: Response, next: NextFunction) {
    if (! await userController.hasId(req.params.id)) next(new Error("Id not find"))

    let options = {
        root: path.join(""),
        headers: {'Content-Type': 'image/jpeg'}
    };

    if (fs.existsSync(`./files/avatars/${req.params.id}`)) {
        let avatarPath = `./files/avatars/${req.params.id}`

        res.sendFile(avatarPath, options, function (err) {
            if (err) {
                next(err)
            }
        })
    } else {
        const avatar = avatarBuilder.squareBuilder(128)
        avatar.create(req.params.id.toString()).then(buffer =>{
            res.type("image/png")
            res.send(buffer)
        }).catch((err)=>{
            next(err)
        })
    }
}


function setAvatar(req: Request, res: Response, next: NextFunction) {
    uploadController(req, res, function (err) {
        if (err) {
            next(err)
        } else {
            console.log(req.file)
            res.json({"message":"Avatar upload successfully"})
        }
    });
}

export default router
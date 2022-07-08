import express, {Request, Response, NextFunction} from 'express';
import userController from "../../controllers/user";
import jwtAuthorize from "../../middleware/jwt-authorize";
import avatarValidator from "../../validators/avatar.validator"
import basicValidator from "../../validators/basic.validator"
import fs from "fs";
import path from "path";
import multer from "multer"
import avatarBuilder from "avatar-builder"
import cloudinary from "../../cloudinary"
import {constants} from "os";

const router = express.Router();

// router.get('/:id', basicValidator.paramIdIsValidObjectId, getUserAvatarById);
router.post('/', jwtAuthorize, avatarValidator.setAvatarValidator, setAvatar);
router.delete('/', jwtAuthorize, deleteAvatar);


const uploadController = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
            cb(new Error("File type is not supported"));
            return;
        }
        cb(null, true);
    },
    limits: {
        fileSize: 1024 * 1024
    }
}).single('avatar')


async function getUserAvatarById(req: Request, res: Response, next: NextFunction) {
    // if (!await userController.hasId(req.params.id)) next(new Error("Id not find"))

    // userController.getUserById(req.params.id).then((user)=>{
    //     if(user.avatarId != "") {
    //         res.send(cloudinary.utils.private_download_url(user.avatarId,"jpg",{}))
    //     }else {
    //         next(new Error("Avatar not find"))
    //     }
    // }).catch(err=>next(err))

}


function setAvatar(req: Request, res: Response, next: NextFunction) {
    uploadController(req, res, function (err) {
        if (err) {
            next(err)
        } else {
            if (req.file?.path != null) cloudinary.uploader.upload(req.file.path, {
                folder: "resumax/avatar",
                public_id: req.user.id.toString(),
                allowed_formats : ["jpg","png"],

                // type : "private",
            }).then((result) => {
                req.user.avatar = result.secure_url
                req.user.avatarId = result.public_id
                req.user.save().then(() => {
                    res.json(req.user.toJSON())
                }).catch(err => next(err))
            }).catch(err => next(err))
        }
    });
}

function deleteAvatar(req: Request, res: Response, next: NextFunction) {
    if (req.user.avatarId != "") {
        cloudinary.uploader.destroy(req.user.avatarId).then((response) => {
            req.user.avatar = ""
            req.user.avatarId = ""
            req.user.save().then(() => {
                res.json(req.user.toJSON())
            }).catch(err => next(err))
        }).catch(err => next(err))
    } else {
        next(new Error("Avatar not find"))
    }
}


export default router
import express, {NextFunction, Request, Response} from 'express';
import jwtAuthorize from "../../middleware/jwt-authorize";
import userValidators from "../../validators/user.validators"
import {IEducation, IExperience, ILicense, ISkills} from "../../models/user";

const router = express.Router();


router.get('/', jwtAuthorize, getUser)
router.post('/', jwtAuthorize, userValidators.updateUserValidate, updateUser)

router.get('/skill/:id', jwtAuthorize, getArrayItem("skills"))
router.get('/skills', jwtAuthorize, getParam("skills"))
router.put("/skill", jwtAuthorize, userValidators.setSkillValidate, addArrayItem("skills"))
router.post('/skill/:id', jwtAuthorize, userValidators.setSkillValidate, updateArrayItem("skills"))
router.delete('/skill/:id', jwtAuthorize, deleteArrayItem("skills"))

router.get('/experience/:id', jwtAuthorize, getArrayItem("experiences"))
router.get('/experiences', jwtAuthorize, getParam("experiences"))
router.put("/experience", jwtAuthorize, userValidators.setExperienceValidate, addArrayItem("experiences"))
router.post('/experience/:id', jwtAuthorize, userValidators.setExperienceValidate, updateArrayItem("experiences"))
router.delete('/experience/:id', jwtAuthorize, deleteArrayItem("experiences"))

router.get('/education/:id', jwtAuthorize, getArrayItem("educations"))
router.get('/educations', jwtAuthorize, getParam("educations"))
router.put("/education", jwtAuthorize, userValidators.setEducationValidate, addArrayItem("educations"))
router.post('/education/:id', jwtAuthorize, userValidators.setEducationValidate, updateArrayItem("educations"))
router.delete('/education/:id', jwtAuthorize, deleteArrayItem("educations"))

router.get('/license/:id', jwtAuthorize, getArrayItem("licenses"))
router.get('/licenses', jwtAuthorize, getParam("licenses"))
router.put("/license", jwtAuthorize, userValidators.setLicenseValidate, addArrayItem("licenses"))
router.post('/license/:id', jwtAuthorize, userValidators.setLicenseValidate, updateArrayItem("licenses"))
router.delete('/license/:id', jwtAuthorize, deleteArrayItem("licenses"))


function getUser(req: Request, res: Response) {
    res.json(req.user.toJSON())
}

function updateUser(req: Request, res: Response, next: NextFunction) {
    console.log(req.body)
    Object.entries(req.body).forEach(([key, value]) => {
        req.user.set(key, value)
    })
    req.user.save().then(() => {
        res.json(req.user)
    }).catch(next)
}

function getParam(paramName: string) {
    return (req: Request, res: Response) => {
        res.json(req.user.get(paramName))
    }
}

function addArrayItem(arrayName: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        req.user.get(arrayName).push(req.body)
        req.user.save().then(() => {
            res.json(req.user.get(arrayName))
        }).catch(next)
    }
}

function getArrayItem(arrayName: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        let arrayItem = req.user.get(arrayName).find((array: ISkills | IExperience | IEducation | ILicense) => {
            return array._id == req.params.id
        })
        if (arrayItem) {
            res.json(arrayItem)
        } else {
            next(new Error("not found"))
        }
    }
}

function updateArrayItem(arrayName: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        let index = req.user.get(arrayName).findIndex((array: ISkills | IExperience | IEducation | ILicense) => {
            return (array._id == req.params.id)
        })

        if (index != -1) {
            let array = req.user.get(arrayName)
            console.log(array,index)
            array[index] = {_id: req.params.id, ...req.body}
            req.user.save().then(() => {
                res.json(req.user.get(arrayName)[index])
            }).catch(next)
        } else {
            next(new Error("id not found"))
        }
    }

}

function deleteArrayItem(arrayName: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        let index = req.user.get(arrayName).findIndex((array: ISkills | IExperience | IEducation | ILicense) => {
            return (array._id == req.params.id)
        })

        if (index != -1) {
            req.user.get(arrayName).splice(index, 1)
            req.user.save().then(() => {
                res.json(req.user.get(arrayName))
            }).catch(next)
        } else {
            next(new Error("id not found"))
        }
    }

}

export default router
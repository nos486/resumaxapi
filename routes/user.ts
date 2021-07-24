import express, {NextFunction, Request, Response} from 'express';
import jwtAuthorize from "../middleware/jwt-authorize";
import userValidators from "../validators/user.validators"
import {ISkills} from "../models/user";

const router = express.Router();


router.get('/',jwtAuthorize,getUserFullDetail)
router.post('/',jwtAuthorize,userValidators.updateUserValidate,updateUser)

router.get('/about',jwtAuthorize,getUserAbout)
router.post('/about',jwtAuthorize,userValidators.updateAboutValidate,updateAbout)


router.put("/skill",jwtAuthorize,userValidators.setSkillValidate,addSkill)
router.get('/skill/:id',jwtAuthorize,getSkill)
router.post('/skill/:id',jwtAuthorize,userValidators.setSkillValidate,updateSkill)
router.delete('/skill/:id',jwtAuthorize,deleteSkill)

router.post('/experiences',jwtAuthorize,userValidators.setExperienceValidate,setExperience)
router.post('/educations',jwtAuthorize,userValidators.setEducationsValidate,setEducations)
router.post('/licenses',jwtAuthorize,userValidators.setLicensesValidate,setLicenses)



function getUser (req: Request, res: Response, next: NextFunction) {
    let { experiences, educations, licenses, languages,...user } = req.user.toJSON();
    res.json(user)
}

function getUserFullDetail(req: Request, res: Response, next: NextFunction) {
    res.json(req.user.toJSON())
}

function getUserAbout(req: Request, res: Response, next: NextFunction) {
    res.json({"about":req.user.about})
}




function getExperiences(req: Request, res: Response, next: NextFunction) {
    res.json(req.user.toJSON().experiences)
}

function getEducations(req: Request, res: Response, next: NextFunction) {
    res.json(req.user.toJSON().educations)
}

function getLicenses(req: Request, res: Response, next: NextFunction) {
    res.json(req.user.toJSON().licenses)
}


function updateUser(req: Request, res: Response, next: NextFunction) {
    Object.entries(req.body).forEach(([key, value]) => {
        // @ts-ignore
        req.user[key] = value
    })

    req.user.save().then(r => {
        res.json(req.user)
    }).catch(next)
}


function updateAbout(req: Request, res: Response, next: NextFunction) {
    req.user.about = req.body.about
    req.user.save().then(r => {
        res.json({ message: 'About updated' })
    }).catch(next)
}



function addSkill(req: Request, res: Response, next: NextFunction) {
    req.user.skills.push(req.body)
    req.user.save().then(r => {
        res.json(req.user.skills)
    }).catch(next)
}


function getSkill(req: Request, res: Response, next: NextFunction) {
    let skill = req.user.skills.find((skill)=>{
        return skill._id == req.params.id
    })
    if(skill){
        res.json(skill)
    }else {
        next(new Error("not found"))
    }
}

function updateSkill(req: Request, res: Response, next: NextFunction) {

    let index = req.user.skills.findIndex((skill,index)=>{
        if(skill._id == req.params.id) return index
    })


    if(index != -1){
        req.user.skills[index] = {_id:req.params.id,...req.body}
        req.user.save().then(r => {
            res.json(req.user.skills[index])
        }).catch(next)
    }else {
        next(new Error("id not found"))
    }
}

function deleteSkill(req: Request, res: Response, next: NextFunction) {

    let index = req.user.skills.findIndex((skill,index)=>{
        if(skill._id == req.params.id) return index
    })

    if(index != -1){
        req.user.skills.splice(index,1)
        req.user.save().then(r => {
            res.json(req.user.skills)
        }).catch(next)
    }else {
        next(new Error("id not found"))
    }
}


function setExperience(req: Request, res: Response, next: NextFunction) {
    req.user.experiences = req.body
    req.user.save().then(r => {
        res.json({ message: 'Experience updated' })
    }).catch(next)
}



function setEducations(req: Request, res: Response, next: NextFunction) {
    req.user.educations = req.body
    req.user.save().then(r => {
        res.json({ message: 'Educations updated' })
    }).catch(next)
}



function setLicenses(req: Request, res: Response, next: NextFunction) {
    req.user.licenses = req.body
    req.user.save().then(r => {
        res.json({ message: 'Licenses updated' })
    }).catch(next)
}


export default router
import express, { Request, Response, NextFunction} from 'express';
import User, {IEducation, IExperience, IUser, ROLE} from "../models/user";
import Joi from "joi";
import userController from "../controllers/user";
import captcha from "../middleware/captcha"
import validateRequest from "../middleware/validate-request";
import jwtAuthorize from "../middleware/jwt-authorize";
import user from "../controllers/user";

const router = express.Router();


router.get('/',jwtAuthorize,getUserFullDetail)
router.post('/',jwtAuthorize,updateUserValidate,updateUser)
router.get('/:username',getUserByUsername)

router.post('/skills',jwtAuthorize,setSkillsValidate,setSkills)
router.post('/experiences',jwtAuthorize,setExperienceValidate,setExperience)
router.post('/educations',jwtAuthorize,setEducationsValidate,setEducations)
router.post('/licenses',jwtAuthorize,setLicensesValidate,setLicenses)


function getUserByUsername (req: Request, res: Response, next: NextFunction) {
    userController.getUserByUsername(req.params.username).then((user)=>{
        res.json(user)
    }).catch(next)
}


function getUser (req: Request, res: Response, next: NextFunction) {
    let { experiences, educations, licenses, languages,...user } = req.user.toJSON();
    res.json(user)
}

function getUserFullDetail(req: Request, res: Response, next: NextFunction) {
    res.json(req.user.toJSON())
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


function updateUserValidate(req: Request, res: Response, next: NextFunction) {

    const schema = Joi.object({
        firstName: Joi.string().min(2).max(64),
        lastName: Joi.string().min(2).max(64),
        gender: Joi.string().valid("male","female","undisclosed"),
        email: Joi.string().email(),
        phone: Joi.string().min(2).max(64),
        website: Joi.string().min(2).max(64),
        github: Joi.string().min(2).max(64),
        linkedin: Joi.string().min(2).max(64),
        country: Joi.string().min(2).max(64),
        city: Joi.string().min(2).max(64),
        birthday : Joi.date(),
        about: Joi.string().min(2).max(1000),
        languages: Joi.array().items(Joi.string()),
    });
    validateRequest(req, next, schema);
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

function setSkillsValidate(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.array().items({
        title: Joi.string().required().min(2).max(64),
        list : Joi.array().items(Joi.string()),
        icon : Joi.string().min(2).max(64),
    });
    validateRequest(req, next, schema);
}


function setSkills(req: Request, res: Response, next: NextFunction) {
    req.user.skills = req.body
    req.user.save().then(r => {
        res.json({ message: 'Skills updated' })
    }).catch(next)
}


function setExperienceValidate(req: Request, res: Response, next: NextFunction) {

    const schema = Joi.array().items({
        title: Joi.string().required().min(2).max(64),
        company: Joi.string().required().min(2).max(64),
        startDate : Joi.date().required(),
        endDate : Joi.date(),
        atThisRole : Joi.boolean(),
        description : Joi.string().max(1000),
    });
    validateRequest(req, next, schema);
}


function setExperience(req: Request, res: Response, next: NextFunction) {
    req.user.experiences = req.body
    req.user.save().then(r => {
        res.json({ message: 'Experience updated' })
    }).catch(next)
}

function setEducationsValidate(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.array().items({
        school: Joi.string().required().min(2).max(64),
        degree: Joi.string().required().min(2).max(64),
        field: Joi.string().required().min(2).max(64),
        startDate : Joi.date().required(),
        endDate : Joi.date().required(),
        description : Joi.string().max(1000),
    });
    validateRequest(req, next, schema);
}


function setEducations(req: Request, res: Response, next: NextFunction) {
    req.user.educations = req.body
    req.user.save().then(r => {
        res.json({ message: 'Educations updated' })
    }).catch(next)
}

function setLicensesValidate(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.array().items({
        name: Joi.string().required().min(2).max(64),
        issuingOrganization: Joi.string().required().min(2).max(64),
        issueDate : Joi.date().required(),
        credentialID : Joi.string().max(128),
        credentialUrl : Joi.string().max(128),
    });
    validateRequest(req, next, schema);
}


function setLicenses(req: Request, res: Response, next: NextFunction) {
    req.user.licenses = req.body
    req.user.save().then(r => {
        res.json({ message: 'Licenses updated' })
    }).catch(next)
}


export default router
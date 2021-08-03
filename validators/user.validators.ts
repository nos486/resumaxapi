import {NextFunction, Request, Response} from "express";
import Joi from "joi";
import validator from "../middleware/request-validator";

const skillSchema = Joi.object({
    title: Joi.string().required().min(2).max(64),
    list: Joi.array().items(Joi.string()),
    icon: Joi.string().min(2).max(64),
});

const experienceSchema = Joi.object({
    title: Joi.string().required().min(2).max(64),
    company: Joi.string().required().min(2).max(64),
    startDate: Joi.date().required(),
    endDate: Joi.date().allow(null),
    atThisRole: Joi.boolean(),
    description: Joi.string().max(1000).allow(""),
    icon: Joi.string().min(2).max(64),
});

const educationSchema = Joi.object({
    school: Joi.string().required().min(2).max(64),
    degree: Joi.string().required().min(2).max(64),
    field: Joi.string().required().min(2).max(64),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    description: Joi.string().max(1000).allow(""),
});

const licenceSchema = Joi.object({
    name: Joi.string().required().min(2).max(64),
    issuingOrganization: Joi.string().required().min(2).max(64),
    issueDate: Joi.date().required(),
    credentialID: Joi.string().max(128),
    credentialUrl: Joi.string().max(128),
});


const userSchema = Joi.object({
    firstName: Joi.string().min(2).max(64).allow(""),
    lastName: Joi.string().min(2).max(64).allow(""),
    headLine: Joi.string().min(2).max(64).allow(""),
    icon: Joi.string().min(2).max(64).allow(""),
    gender: Joi.string().valid("male", "female", "undisclosed"),
    email: Joi.string().email(),
    phone: Joi.string().min(4).max(64).allow(""),
    website: Joi.string().min(4).max(64).allow(""),
    github: Joi.string().min(4).max(64).allow(""),
    linkedin: Joi.string().min(4).max(64).allow(""),
    country: Joi.string().min(2).max(64).allow(""),
    city: Joi.string().min(2).max(64).allow(""),
    birthday: Joi.date(),
    about: Joi.string().min(4).max(1000).allow(""),
    skills: Joi.array().items(skillSchema),
    experiences: Joi.array().items(experienceSchema),
    educations: Joi.array().items(educationSchema),
    licences: Joi.array().items(licenceSchema),
    languages: Joi.array().items(Joi.string()),
});

function updateUserValidate(req: Request, res: Response, next: NextFunction) {
    validator.validateRequestBody(req, next, userSchema);
}

function setSkillValidate(req: Request, res: Response, next: NextFunction) {
    validator.validateRequestBody(req, next, skillSchema);
}

function setExperienceValidate(req: Request, res: Response, next: NextFunction) {
    validator.validateRequestBody(req, next, experienceSchema);
}

function setEducationValidate(req: Request, res: Response, next: NextFunction) {
    validator.validateRequestBody(req, next, educationSchema);
}

function setLicenseValidate(req: Request, res: Response, next: NextFunction) {
    validator.validateRequestBody(req, next, licenceSchema);
}


export default {
    updateUserValidate,
    setSkillValidate,
    setEducationValidate,
    setExperienceValidate,
    setLicenseValidate,
}
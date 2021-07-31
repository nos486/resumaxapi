import {NextFunction, Request, Response} from "express";
import Joi from "joi";
import validator from "../middleware/request-validator";

function updateUserValidate(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
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
        languages: Joi.array().items(Joi.string()),
    });
    validator.validateRequestBody(req, next, schema);
}

function updateAboutValidate(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        about: Joi.string().required().max(1000),
    });
    validator.validateRequestBody(req, next, schema);
}

function setSkillValidate(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        title: Joi.string().required().min(2).max(64),
        list: Joi.array().items(Joi.string()),
        icon: Joi.string().min(2).max(64),
    });
    validator.validateRequestBody(req, next, schema);
}


function setExperienceValidate(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        title: Joi.string().required().min(2).max(64),
        company: Joi.string().required().min(2).max(64),
        startDate: Joi.date().required(),
        endDate: Joi.date(),
        atThisRole: Joi.boolean(),
        description: Joi.string().max(1000),
        icon: Joi.string().min(2).max(64),
    });
    validator.validateRequestBody(req, next, schema);
}

function setEducationValidate(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        school: Joi.string().required().min(2).max(64),
        degree: Joi.string().required().min(2).max(64),
        field: Joi.string().required().min(2).max(64),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
        description: Joi.string().max(1000),
    });
    validator.validateRequestBody(req, next, schema);
}

function setLicenseValidate(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        name: Joi.string().required().min(2).max(64),
        issuingOrganization: Joi.string().required().min(2).max(64),
        issueDate: Joi.date().required(),
        credentialID: Joi.string().max(128),
        credentialUrl: Joi.string().max(128),
    });
    validator.validateRequestBody(req, next, schema);
}


export default {
    updateUserValidate,
    updateAboutValidate,
    setSkillValidate,
    setEducationValidate,
    setExperienceValidate,
    setLicenseValidate,
}
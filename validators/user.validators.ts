import {NextFunction, Request, Response} from "express";
import Joi from "joi";
import validator from "../middleware/request-validator";

function updateUserValidate(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(64),
        lastName: Joi.string().min(2).max(64),
        gender: Joi.string().valid("male", "female", "undisclosed"),
        email: Joi.string().email(),
        phone: Joi.string().min(2).max(64),
        website: Joi.string().min(2).max(64),
        github: Joi.string().min(2).max(64),
        linkedin: Joi.string().min(2).max(64),
        country: Joi.string().min(2).max(64),
        city: Joi.string().min(2).max(64),
        birthday: Joi.date(),
        about: Joi.string().min(2).max(1000),
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

function setSkillsValidate(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.array().items({
        title: Joi.string().required().min(2).max(64),
        list: Joi.array().items(Joi.string()),
        icon: Joi.string().min(2).max(64),
    });
    validator.validateRequestBody(req, next, schema);
}

function setExperienceValidate(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.array().items({
        title: Joi.string().required().min(2).max(64),
        company: Joi.string().required().min(2).max(64),
        startDate: Joi.date().required(),
        endDate: Joi.date(),
        atThisRole: Joi.boolean(),
        description: Joi.string().max(1000),
    });
    validator.validateRequestBody(req, next, schema);
}

function setEducationsValidate(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.array().items({
        school: Joi.string().required().min(2).max(64),
        degree: Joi.string().required().min(2).max(64),
        field: Joi.string().required().min(2).max(64),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
        description: Joi.string().max(1000),
    });
    validator.validateRequestBody(req, next, schema);
}

function setLicensesValidate(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.array().items({
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
    setSkillsValidate,
    setEducationsValidate,
    setExperienceValidate,
    setLicensesValidate,
}
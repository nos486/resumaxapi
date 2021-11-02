import {model, Schema, Document} from "mongoose";

export enum ROLE {
    ADMIN = "admin",
    USER = "user"
}

export enum GENDER {
    MALE = 'male',
    FEMALE = 'female',
    UNDISCLOSED = 'undisclosed'
}

export interface IExperience {
    _id?: string,
    title: string,
    company: string,
    startDate: Date,
    endDate?: Date,
    atThisRole?: boolean,
    description?: string,
    icon: string
}

export interface IEducation {
    _id?: string,
    school: string,
    degree: string,
    field: string,
    startDate: Date,
    endDate: Date,
    description?: string,
}

export interface ILicense {
    _id?: string,
    name: string,
    issuingOrganization: string,
    issueDate: Date,
    credentialID?: string,
    credentialUrl?: string,
}

export interface IUserSettings {
    _id?: string,
    color: string,
    template : string
    modules : string[]
    templateSettings : object
}

export interface ISkills {
    _id?: string,
    title: string,
    list: string[]
    icon: string
}

export interface IUser extends Document {
    username: string
    firstName?: string
    lastName?: string
    gender: GENDER
    role: ROLE
    email: string
    isEmailVerified: boolean
    password: string
    headLine?: string
    icon?: string
    phone?: string
    website?: string
    github?: string
    linkedin?: string
    country?: string,
    city?: string,
    birthday?: Date
    about?: string
    skills: ISkills[]
    experiences: IExperience[]
    educations: IEducation[]
    licenses: ILicense[]
    languages: string[]
    highlights: string[]
    avatar?: string
    avatarId : string
    settings: IUserSettings
}


const schemaSkills = new Schema({
    title: {type: String, required: true},
    list: {type: [{type: String}], default: []},
    icon: {type: String, default: ""},
});


const schemaExperience = new Schema({
    title: {type: String, required: true},
    company: {type: String, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, default: null},
    atThisRole: {type: Boolean, default: false},
    description: {type: String, default: ""},
    icon: {type: String, default: ""},
});

const schemaEducation = new Schema({
    school: {type: String, required: true},
    degree: {type: String, required: true},
    field: {type: String, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    description: {type: String, default: ""},
});


const schemaLicense = new Schema({
    name: {type: String, required: true},
    issuingOrganization: {type: String, required: true},
    issueDate: {type: Date, required: true},
    credentialID: {type: String, default: ""},
    credentialUrl: {type: String, default: ""},
});

const schemaUserSettings = new Schema({
    color: {type: String, required: true},
    template: {type: String, required: true,default: "default"},
    modules : {type: [{type: String}],required: true, default: ["basic", "contact","skills","languages","about","experiences","educations"]},
    templateSettings : {type:Object,required:true,default: {}}
});

const defaultUserSettings: IUserSettings = {
    color: "orange",
    template: "default",
    modules : [],
    templateSettings : {c1:["basic", "contact","skills","languages"],c2:["about","experiences","educations","licenses"]}
}

const schema = new Schema(
    {
        username: {type: String, unique: true, required: true,},
        firstName: {type: String, default: ""},
        lastName: {type: String, default: ""},
        gender: {type: String, enum: Object.values(GENDER), default: GENDER.UNDISCLOSED},
        role: {type: String, enum: Object.values(ROLE), default: ROLE.USER},
        email: {type: String, unique: true, required: true},
        isEmailVerified: {type: Boolean, default: false},
        password: {type: String, required: true},
        headLine: {type: String, default: ""},
        icon: {type: String, default: ""},
        phone: {type: String, default: ""},
        website: {type: String, default: ""},
        github: {type: String, default: ""},
        linkedin: {type: String, default: ""},
        country: {type: String, default: ""},
        city: {type: String, default: ""},
        birthday: {type: Date, default: null},
        about: {type: String, default: ""},
        skills: {type: [schemaSkills], default: []},
        experiences: {type: [schemaExperience], default: []},
        educations: {type: [schemaEducation], default: []},
        licenses: {type: [schemaLicense], default: []},
        languages: {type: [{type: String}], default: []},
        highlights: {type: [{type: String}], default: []},
        avatar: {type: String, default : ""},
        avatarId: {type: String, default : ""},
        settings: {type: schemaUserSettings, required: true, default: defaultUserSettings}
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: ((doc, ret) => {
                // remove these props when object is serialized
                delete ret.id;
                delete ret.updatedAt
                delete ret.updatedAt
                delete ret.password;
                delete ret.avatarId;
            })
        }
    },
);


const User = model<IUser>('User', schema);

export default User
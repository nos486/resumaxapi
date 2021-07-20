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

export interface IExperience{
    _id? : string,
    title: string,
    company: string,
    startDate: Date,
    endDate?: Date,
    atThisRole?: boolean,
    description?: string,
}

export interface IEducation{
    _id? : string,
    school: string,
    degree: string,
    field: string,
    startDate: Date,
    endDate: Date,
    description?: string,
}

export interface ILicense{
    _id? : string,
    name: string,
    issuingOrganization: string,
    issueDate: Date,
    credentialID?: string,
    credentialUrl?: string,
}

export interface IUser extends Document{
    username: string
    firstName? : string
    lastName? : string
    gender : GENDER
    role :ROLE
    email: string
    isEmailValid : boolean
    password : string
    phone? : string
    website? : string
    github? : string
    linkedin? : string
    country?: string,
    city?: string,
    birthday? : Date
    about? : string
    experiences : IExperience[]
    educations : IEducation[]
    licenses : ILicense[]
    languages : string[]
    avatarPath? :string
}


const schemaExperience = new Schema({
    title: {type: String ,required: true },
    company: {type: String ,required: true },
    startDate: {type: Date ,required: true },
    endDate: Date,
    atThisRole: {type: Boolean ,default: false },
    description: String
});

const schemaEducation = new Schema({
    school: {type: String ,required: true },
    degree: {type: String ,required: true },
    field: {type: String ,required: true },
    startDate: {type: Date ,required: true },
    endDate: {type: Date ,required: true },
    description: String
});


const schemaLicense = new Schema({
    name: {type: String ,required: true },
    issuingOrganization: {type: String ,required: true },
    issueDate: {type: Date ,required: true },
    credentialID: String,
    credentialUrl: String
});

const schema = new Schema(
    {
        username: {type: String, unique: true, required: true,},
        firstName : {type: String},
        lastName : {type: String},
        gender : {type: String, enum : Object.values(GENDER), default : GENDER.UNDISCLOSED},
        role: {type: String, enum : Object.values(ROLE), default : ROLE.USER},
        email :{type : String, unique : true,},
        isEmailValid :{type:Boolean, default : false},
        password :{type : String, required: true,},
        phone:{type : String},
        website:{type : String},
        github:{type : String},
        linkedin:{type : String},
        country: {type: String},
        city: {type: String},
        birthday:{type : Number},
        about:{type : String},
        experiences : [schemaExperience],
        educations : [schemaEducation],
        licenses : [schemaLicense],
        languages : [{type : String}],
        avatarPath : {type : String},
    },
    {
        timestamps: true,
        toJSON :{
            virtuals : true,
            versionKey : false,
            transform: ((doc, ret) => {
                // remove these props when object is serialized
                delete ret.id;
                // delete ret.updatedAt
                // delete ret.updatedAt
                delete ret.password;
                delete ret.avatarPath;
            })
        }
    },
);



const User = model<IUser>('User', schema);

export default User
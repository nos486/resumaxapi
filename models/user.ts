import {model, Schema, Model, Document} from "mongoose";


export enum ROLE {
    ADMIN = "admin",
    USER = "user"
}

export enum GENDER {
    male = 'male',
    female = 'female',
    undisclosed = 'undisclosed'
}

export interface IUser extends Document{
    username: string;
    email: string;
    isEmailValid : boolean,
    password : string
    role :ROLE
}

const schema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
        },
        email :{
            type : String,
            unique : true,
        },
        isEmailValid :{
            type:Boolean,
            default : false
        },
        password :{
            type : String,
            required: true,
        },
        role: {
            type: String,
            enum : Object.values(ROLE),
            default : ROLE.USER,
            required: true
        },
    },
    {
        timestamps: true,
        toJSON :{
            virtuals : true,
            versionKey : false,
            transform: ((doc, ret, options) => {
                // remove these props when object is serialized
                delete ret._id;
                delete ret.updatedAt
                delete ret.password;
                delete ret.avatarPath;
            })
        }
    },
);

const User = model<IUser>('User', schema);

//
// User.getUserById  = async function(id, fullDetails = false) {
//     if (! mongoose.Types.ObjectId.isValid(id)) throw 'User not found';
//     const user = await User.findById(id);
//     if (!user) throw 'User not found';
//     return fullDetails ? user : basicDetails(user);
// }
//
// User.getUserByUsername  = async function(username, fullDetails = false) {
//     const user = await User.findOne({username});
//     if (!user) throw 'User not found';
//     return fullDetails ? user : basicDetails(user);
// }
//
// User.hasUsername = async function(username){
//     return !!(await User.findOne({username}))
// }
//
// User.hasEmail = async function(email){
//     return !!(await User.findOne({email}))
// }
//
// User.getUserByEmail  = async function(email, fullDetails = false) {
//     const user = await User.findOne({email});
//     if (!user) throw 'User not found';
//     return fullDetails ? user : basicDetails(user);
// }
//
//
// //helpers
//
// function basicDetails(user) {
//     const { id, email, username, role } = user;
//     return { id, email, username, role };
// }

export default User
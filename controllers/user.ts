import User,{IUser} from "../models/user";
import RefreshToken,{IRefreshToken} from "../models/refresh-token";
import config from "./../config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import {randomString} from "../utils";
import jwt from "jsonwebtoken";
import bc from "bcrypt"
import md5 from "md5";


export default class UserController {

    async createUser(username:string, email:string, password:string):Promise<IUser>{
        username = username.toLowerCase()

        if (await this.hasUsername(username)){
            throw "Username exist"
        }

        if (await this.hasEmail(email)){
            throw "Email exist"
        }

        return  User.create({
            username: username,
            email : email,
            password : bcrypt.hashSync(password, 10),
        }).catch((user:IUser)=>{
            return user
        }).catch((error: Error)=>{
            throw error
        })

    }

    async authenticateUser(username:string, password:string, ipAddress:string) {
        username = username.toLowerCase()

        const user = await User.findOne({ username });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            throw 'Username or password is incorrect';
        }

        // authentication successful so generate jwt and refresh tokens
        const jwtToken = this.generateJwtToken(user);

        await RefreshToken.findOneAndDelete({user: user.id})
        const refreshToken = await this.generateRefreshToken(user, ipAddress);

        return {
            ...user.toJSON(),
            jwtToken,
            refreshToken: refreshToken.token
        };
    }

    async getUserById(id:string): Promise<IUser|null>{
        if (! mongoose.Types.ObjectId.isValid(id)) throw 'User not found';
        return User.findById(id)
            .then((data:IUser|null)=>{
                return data
            })
            .catch((error:Error)=>{
                throw error
            })
    }

    async getUserByUsername(username:string): Promise<IUser|null>{
        return User.findOne({username})
            .then((data:IUser|null)=>{
                return data
            })
            .catch((error:Error)=>{
                throw error
            })
    }

    generateJwtToken(user:IUser) {
        // create a jwt token containing the user id that expires in 15 minutes
        //todo change expiresIn
        return jwt.sign({ id: user.id }, config.secret , { expiresIn: '15d' });
    }

    async generateRefreshToken(user: IUser, ipAddress: string):Promise<IRefreshToken>{
        return RefreshToken.create({
            user: user._id,
            token: randomString(40),
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // create a refresh token that expires in 7 days
            createdByIp: ipAddress
        }).catch((refreshToken:IRefreshToken)=>{
            return refreshToken
        }).catch((error:Error)=>{
            throw error
        })
    }

    async hasUsername(username:string):Promise<boolean>{
        return !!(await User.findOne({username}))
    }

    async hasEmail(email:string):Promise<boolean>{
        return !!(await User.findOne({email}))
    }
}
import User, {IUser, ROLE} from "../models/user";
import RefreshToken, {IRefreshToken} from "../models/refresh-token";
import config from "./../config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import {randomString} from "../utils";
import jwt from "jsonwebtoken";


async function createUser(username: string, email: string, password: string): Promise<IUser> {
    username = username.toLowerCase()

    if (await hasUsername(username)) {
        throw new Error("Username exist")
    }

    if (await hasEmail(email)) {
        throw new Error("Email exist")
    }

    return User.create({
        username: username,
        email: email,
        password: bcrypt.hashSync(password, 10),
    }).catch((user: IUser) => {
        return user
    }).catch((error: Error) => {
        throw error
    })

}

async function authenticateUser(username: string, password: string, ipAddress: string) {
    username = username.toLowerCase()

    const user = await User.findOne({username}) as IUser;

    if (!user || !bcrypt.compareSync(password, user.password)) {
        throw new Error('Username or password is incorrect');
    }

    // authentication successful so generate jwt and refresh tokens
    const jwtToken = generateJwtToken(user);

    await RefreshToken.findOneAndDelete({user: user.id})
    const refreshToken = await generateRefreshToken(user, ipAddress);

    return {
        ...user.toJSON(),
        jwtToken,
        refreshToken: refreshToken.token
    };
}

async function getUserById(id: string): Promise<IUser | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('User not found');
    return User.findById(id)
        .then((data: IUser | null) => {
            return data
        })
        .catch((error: Error) => {
            throw error
        })
}

async function getUserByUsername(username: string): Promise<IUser | null> {
    return User.findOne({username})
        .then((data: IUser | null) => {
            return data
        })
        .catch((error: Error) => {
            throw error
        })
}

function generateJwtToken(user: IUser) {
    // create a jwt token containing the user id that expires in 15 minutes
    //todo change expiresIn
    return jwt.sign({id: user.id}, config.secret, {expiresIn: '15d'});
}

async function generateRefreshToken(user: IUser, ipAddress: string): Promise<IRefreshToken> {
    return RefreshToken.create({
        user: user._id,
        token: randomString(40),
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // create a refresh token that expires in 7 days
        createdByIp: ipAddress
    }).catch((refreshToken: IRefreshToken) => {
        return refreshToken
    }).catch((error: Error) => {
        throw error
    })
}


async function refreshToken(token: string, ipAddress: string) {
    let refreshToken = await RefreshToken.findOne({token}).populate('user') as IRefreshToken
    if (!refreshToken) throw new Error('Invalid token');
    await RefreshToken.findOneAndDelete({user: refreshToken.user})

    let user = await User.findById(refreshToken.user) as IUser;
    let newRefreshToken = await generateRefreshToken(user, ipAddress);
    let newJwtToken = generateJwtToken(user);

    // return basic details and tokens
    return {
        ...user.toJSON(),
        jwtToken: newJwtToken,
        refreshToken: newRefreshToken.token
    };
}

async function ownsRefreshToken(userId: string, token: string): Promise<boolean> {
    let refreshToken = await RefreshToken.findOne({token}) as IRefreshToken
    return refreshToken.user.equals(userId)
}

async function deleteRefreshToken(token: string) {
    let refreshToken = await RefreshToken.findOne({token}) as IRefreshToken
    if (!refreshToken) throw new Error('Invalid token');
    refreshToken.delete()
}

async function deleteRefreshTokenCheckUser(user: IUser,token: string,adminCanRevoke:boolean = true){
    let refreshToken = await RefreshToken.findOne({token}) as IRefreshToken
    if (!refreshToken) throw new Error('Invalid token');

    if(refreshToken.user.equals(user.id) || adminCanRevoke && user.role == ROLE.ADMIN){
        refreshToken.delete()
    }else {
        throw new Error('Forbidden');
    }
}


async function hasUsername(username: string): Promise<boolean> {
    return !!(await User.findOne({username}))
}

async function hasEmail(email: string): Promise<boolean> {
    return !!(await User.findOne({email}))
}

export default {
    authenticateUser,
    createUser,
    hasUsername,
    hasEmail,
    getUserById,
    getUserByUsername,
    refreshToken,
    ownsRefreshToken,
    deleteRefreshToken,
    deleteRefreshTokenCheckUser
}
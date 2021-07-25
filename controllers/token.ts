import RefreshToken, {IRefreshToken} from "../models/refresh-token";
import {IUser, ROLE} from "../models/user";
import jwt from "jsonwebtoken";
import config from "../config";
import {randomString} from "../utils";


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

    let newRefreshToken = await generateRefreshToken(refreshToken.user, ipAddress);
    let newJwtToken = generateJwtToken(refreshToken.user);

    // return basic details and tokens
    return {
        ...refreshToken.user.toJSON(),
        jwtToken: newJwtToken,
        refreshToken: newRefreshToken.token
    };
}

async function ownsRefreshToken(userId: string, token: string): Promise<boolean> {
    let refreshToken = await RefreshToken.findOne({token}) as IRefreshToken
    return refreshToken.user.id.equals(userId)
}

async function deleteRefreshToken(token: string) {
    let refreshToken = await RefreshToken.findOne({token}) as IRefreshToken
    if (!refreshToken) throw new Error('Invalid token');
    refreshToken.delete()
}

async function deleteRefreshTokenCheckUser(user: IUser, token: string, adminCanRevoke: boolean = true) {
    let refreshToken = await RefreshToken.findOne({token}) as IRefreshToken
    if (!refreshToken) throw new Error('Invalid token');

    if (refreshToken.user.equals(user.id) || adminCanRevoke && user.role == ROLE.ADMIN) {
        refreshToken.delete()
    } else {
        throw new Error('Forbidden');
    }
}

async function getRefreshTokenByToken(token: string) {
    const refreshToken = await RefreshToken.findOne({token}).populate('user');
    if (!refreshToken) throw 'Invalid token';
    return refreshToken;
}

async function getRefreshTokenByUser(user: IUser) {
    return RefreshToken.findOne({user}).populate('user');
}

export default {
    getRefreshTokenByToken,
    getRefreshTokenByUser,
    refreshToken,
    generateJwtToken,
    generateRefreshToken,
    ownsRefreshToken,
    deleteRefreshToken,
    deleteRefreshTokenCheckUser
}
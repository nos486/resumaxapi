import mongoose from "mongoose";
import RefreshToken,{IRefreshToken} from "../models/refresh-token";

async function getRefreshTokenByToken(token:string) {
    const refreshToken = await RefreshToken.findOne({token}).populate('user');
    if (!refreshToken) throw 'Invalid token';
    return refreshToken;
}

async function getRefreshTokenByUserId(userId:mongoose.Types.ObjectId) {
    return RefreshToken.findOne({user: userId}).populate('user');
}

export {
    getRefreshTokenByToken,
    getRefreshTokenByUserId
}
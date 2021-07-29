import User, {IUser} from "../models/user";
import RefreshToken from "../models/refresh-token";
import tokenController from "./token"
import mongoose from "mongoose";
import bcrypt from "bcrypt";


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
    const jwtToken = tokenController.generateJwtToken(user);

    await RefreshToken.findOneAndDelete({user: user.id})
    const refreshToken = await tokenController.generateRefreshToken(user, ipAddress);

    await user.save()
    return {
        jwtToken,
        refreshToken: refreshToken.token
    };
}

async function getUserById(id: string): Promise<IUser> {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('User not found');
    return User.findById(id)
        .then((data: IUser | null) => {
            if (data == null) throw new Error('User not found');
            return data
        })
}

async function getUserByUsername(username: string): Promise<IUser> {
    return User.findOne({username})
        .then((data: IUser | null) => {
            if (data == null) throw new Error('User not found');
            return data
        })
}

async function hasId(id: string): Promise<boolean> {
    return !!(await User.findById(id))
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
    hasId,
    hasUsername,
    hasEmail,
    getUserById,
    getUserByUsername,
}
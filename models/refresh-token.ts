import {model, Schema, Document, Types} from "mongoose";
import {IUser} from "./user";

export interface IRefreshToken extends Document {
    user: IUser,
    token: string,
    expires: number,
    created: number,
    createdByIp: string,
    revoked: boolean
}

const schema = new Schema({
        user: {type: Types.ObjectId, ref: 'User'},
        token: String,
        expires: Date,
        created: {type: Date, default: new Date()},
        createdByIp: String,
        revoked: Boolean
    },
    {
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: (doc, ret) => {
                delete ret._id;
                delete ret.id;
                delete ret.user;
            }
        }
    });

schema.virtual('isExpired').get(function (this: { expires: number }) {
    return Date.now() >= this.expires;
});

schema.virtual('isActive').get(function (this: { revoked: boolean, isExpired: boolean }) {
    return !this.revoked && !this.isExpired;
});


const RefreshToken = model<IRefreshToken>('RefreshToken', schema);

export default RefreshToken
import {model, Schema, Model, Document,Types} from "mongoose";

export interface IRefreshToken extends Document {
    _id: string | number;
    user : Types.ObjectId,
    token : string,
    expires: number,
    created : number,
    createdByIp : string,
    revoked : boolean
}

const schema = new Schema({
    user: { type: Types.ObjectId, ref: 'User' },
    token: String,
    expires: Number,
    created: { type: Number, default: Date.now },
    createdByIp: String,
    revoked : Boolean
},
    {
        toJSON :{
            virtuals : true,
            versionKey : false,
            transform : (doc, ret) => {
                delete ret._id;
                delete ret.id;
                delete ret.user;
            }
        }
    });

schema.virtual('isExpired').get(function (this: { expires:number}) {
    return Date.now() >= this.expires;
});

schema.virtual('isActive').get(function (this:{revoked:boolean,isExpired:boolean}) {
    return !this.revoked && !this.isExpired;
});


const RefreshToken = model<IRefreshToken>('RefreshToken', schema);

export default RefreshToken
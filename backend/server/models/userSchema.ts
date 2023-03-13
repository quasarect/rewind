import { IUser } from "../types/models/IUser";
import { model, Schema } from "mongoose";

const userSchema = new Schema<IUser>({
    name:{
        type: String,
        required: true
    },
    username:{
        type:String,
        required:true,
        unique: true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profileUrl:{
        type:String,
        default:''
    },
    tag:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    description:{
        type:String
    },
    aiGeneratedLine:{
        type:String
    },
    private:{
        type:Boolean,
        default:false
    },
    artist:{
        type:Boolean,
        default:false
    },
    followerCount:{
        type:Number,
        default:0
    },
    followingCount:{
        type:Number,
        default:0
    }
});

export default model<IUser>('User',userSchema)
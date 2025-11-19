import { en } from "@faker-js/faker";
import mongoose from "mongoose";
import { faker } from '@faker-js/faker';

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profileImage:{
        type:String,
        
    },
    bio:{
        type:String,
        
    },
    profession:{
        type:String,
        
    },
    gender:{
        type:String,
        enum:['Male','Female','Other']
        
    },
    followers:[
        {type:mongoose.Schema.Types.ObjectId,ref:"User"}
    ],
    following:[
        {type:mongoose.Schema.Types.ObjectId,ref:"User"}
    ],
    posts:[
        {type:mongoose.Schema.Types.ObjectId,ref:"Post"}
    ],
    savedPosts:[
        {type:mongoose.Schema.Types.ObjectId,ref:"Post"}

    ],
    savedMoments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Moment" }],
    moments:[
        {type:mongoose.Schema.Types.ObjectId,ref:"Moment"}
    ],
    story:
        {type:mongoose.Schema.Types.ObjectId,ref:"Story"},
        resetOtp:{type:String},
        otpExpires:{
            type:Date,
            
        },
        isOtpVerified:{type:Boolean,default:false}

},{
    timestamps:true
});
const User=mongoose.model("User",userSchema);
export default User;

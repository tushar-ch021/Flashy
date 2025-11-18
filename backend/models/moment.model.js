import mongoose from "mongoose";

const momentSchema = new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    
    
    media:{
        type:String,
        required:true
    },
    mediaType: {
  type: String,
  enum: ["video"], // for moments only video
  default: "video",
},
    caption:{
        type:String,
       
    },
    likes:[
        {type:mongoose.Schema.Types.ObjectId,ref:"User"}
    ],
        comments: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        message: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
},{
    timestamps:true
});
const Moment=mongoose.model("Moment",momentSchema);
export default Moment;

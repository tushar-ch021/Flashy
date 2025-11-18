import mongoose from "mongoose";
const storySchema = new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    mediaType:{
        type:String,
        enum:['image','video'],
        required:true
    },
    media:{
        type:String,
        required:true
    },
    viewers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
   
},
{
    timestamps:true
});

// TTL: expire stories after 24 hours based on createdAt
storySchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });
const Story = mongoose.model("Story", storySchema);
export default Story;

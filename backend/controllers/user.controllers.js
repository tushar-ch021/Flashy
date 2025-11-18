import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";
import { getIO } from "../socket.js";

export const getCurrentUser = async (req, res) => {
  try {
    console.log("👉 req.userId:", req.userId);
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const user = await User.findById(userId)
      .populate("posts posts.author posts.comments")
      .populate("moments")
      .populate({
        path: "savedPosts",
        populate: { path: "author", select: "userName profileImage name" },
      })
      .populate({
        path: "savedMoments",
        populate: { path: "author", select: "userName profileImage name" },
      })
      .select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const suggestedUsers=async(req,res)=>{
    try {
        const users=await User.find({_id:{$ne:req.userId}}).select('-password')
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

export const editProfile = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("USER ID:", req.userId);

    const { name, userName, bio, profession, gender } = req.body;

    // Find the logged in user
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if username is already taken by another user
    if (userName) {
      const sameUser = await User.findOne({ userName }).select("-password");
      if (sameUser && sameUser._id.toString() !== req.userId.toString()) {
        return res
          .status(400)
          .json({ message: "User with same username already exists" });
      }
      user.userName = userName;
    }

    // Upload new profile image if provided
    if (req.file) {
      const uploadedUrl = await uploadOnCloudinary(req.file.path);
      user.profileImage = uploadedUrl;
    }

    // Update other fields
    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (profession) user.profession = profession;
    if (gender) user.gender = gender;

    await user.save();

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Edit Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getProfile = async (req, res) => {
  try {
    const userName = req.params.userName;

    const user = await User.findOne({ userName })
      .select("-password")
      .populate("posts moments followers following")
      .populate({
        path: "savedPosts",
        populate: { path: "author", select: "userName profileImage name" },
      })
      .populate({
        path: "savedMoments",
        populate: { path: "author", select: "userName profileImage name" },
      });

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const follow=async(req,res)=>{
    try {
        const currentUserId=req.userId;
   const targetUserId = req.params.targetUserId;

        if(!targetUserId){
            return res.status(400).json({
                message:'user not found'
            })
        }
      if(currentUserId==targetUserId){
        return res.status(400).json({
            message:'you can not follow yourself'
        })
      }
      
        const currentUser=await User.findById(currentUserId)
        const targetUser=await User.findById(targetUserId)
        const isFollowing=currentUser.following.includes(targetUserId)
        if(isFollowing){
            currentUser.following = currentUser.following.filter(id=>id.toString()!=targetUserId);
            targetUser.followers = targetUser.followers.filter(id=>id.toString()!=currentUserId);
            await currentUser.save();
            await targetUser.save();
            return res.status(200).json({
                following:false,
                message:'unfollowed'
            });
        }
       else{
        currentUser.following.push(targetUserId);
        targetUser.followers.push(currentUserId);
        await currentUser.save();
        await targetUser.save();
        // realtime notify target user about new follower
        try {
          const io = getIO();
          io.to(targetUserId.toString()).emit("notification", {
            type: "follow",
            text: "started following you",
            from: currentUserId,
            at: Date.now(),
          });
        } catch {}
        return res.status(200).json({
            following:true,
            message:'followed'
        });
       }
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

export const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: 'followers',
      select: 'userName profileImage name'
    }).select('followers');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json(user.followers || []);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

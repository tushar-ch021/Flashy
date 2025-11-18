import Moment from "../models/moment.model.js";
import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import { getIO } from "../socket.js";

//  Upload Moment
export const uploadMoment = async (req, res) => {
  try {
    const { caption } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    const mediaUrl = await uploadOnCloudinary(req.file.path);

    let moment = await Moment.create({
      caption,
      media: mediaUrl,
        mediaType: "video",
      author: req.userId,
    });

    // push directly without re-fetching
    await User.findByIdAndUpdate(
      req.userId,
      { $push: { moments: moment._id } },
      { new: true }
    );

    // populate in one go
    moment = await moment.populate("author", "name userName profileImage");

    return res.status(201).json(moment);
  } catch (error) {
    console.error("🔥 Upload Moment Error:", error.message, error.stack);
    res.status(500).json({ message: "Something went wrong in upload moment" });
  }
};


// Like / Unlike Moment
export const like = async (req, res) => {
  try {
    const momentId = req.params.momentId;
    const moment = await Moment.findById(momentId);

    if (!moment) {
      return res.status(404).json({ message: "Moment not found" });
    }

    const alreadyLiked = moment.likes.some(
      (id) => id.toString() === req.userId.toString()
    );

    if (alreadyLiked) {
      moment.likes = moment.likes.filter(
        (id) => id.toString() !== req.userId.toString()
      );
    } else {
      moment.likes.push(req.userId);
      // realtime notify author about like
      try {
        const io = getIO();
        const authorId = moment.author.toString();
        if (authorId !== req.userId.toString()) {
          io.to(authorId).emit("notification", {
            type: "like",
            text: "liked your moment",
            momentId: moment._id,
            from: req.userId,
            at: Date.now(),
          });
        }
      } catch {}
    }

    await moment.save();
    await moment.populate("author", "name userName profileImage");

    return res.status(200).json(moment);
  } catch (error) {
    console.error("🔥 Moment Like Error:", error.message, error.stack);
    res.status(500).json({ message: "Something went wrong in moment like" });
  }
};

// Comment on Moment
export const comment = async (req, res) => {
  try {
    const { message } = req.body;
    const momentId = req.params.momentId || req.body.momentId;

    const moment = await Moment.findById(momentId);
    if (!moment) {
      return res.status(404).json({ message: "Moment not found" });
    }

    moment.comments.push({
      author: req.userId,
      message,
    });

    await moment.save();
    await moment.populate("author", "name userName profileImage");
    await moment.populate("comments.author");

    try {
      const io = getIO();
      const authorId = moment.author._id?.toString?.() || moment.author.toString();
      if (authorId !== req.userId.toString()) {
        io.to(authorId).emit("notification", {
          type: "comment",
          text: "commented on your moment",
          momentId: moment._id,
          from: req.userId,
          at: Date.now(),
        });
      }
    } catch {}

    return res.status(200).json(moment);
  } catch (error) {
    console.error("🔥 Moment Comment Error:", error.message, error.stack);
    res.status(500).json({ message: "Something went wrong in moment comment" });
  }
};

// Get All Moments
export const getAllMoment = async (req, res) => {
  try {
    const moments = await Moment.find().sort({ createdAt: -1 })
      .populate("author", "name userName profileImage")
      .populate("comments.author");

    return res.status(200).json(moments);
  } catch (error) {
    console.error("🔥 Get All Moments Error:", error.message, error.stack);
    res.status(500).json({ message: "Something went wrong in moment getAll" });
  }
};

// ��� Get Single Moment
export const getMomentById = async (req, res) => {
  try {
    const { momentId } = req.params;
    const moment = await Moment.findById(momentId)
      .populate("author", "name userName profileImage")
      .populate("comments.author");
    if (!moment) return res.status(404).json({ message: "Moment not found" });
    return res.status(200).json(moment);
  } catch (error) {
    console.error("🔥 Get Moment Error:", error.message, error.stack);
    res.status(500).json({ message: "Something went wrong in get moment" });
  }
};

// Delete a moment (only author)
export const deleteMoment = async (req, res) => {
  try {
    const { momentId } = req.params;
    const moment = await Moment.findById(momentId);
    if (!moment) return res.status(404).json({ message: 'Moment not found' });
    if (moment.author.toString() !== req.userId.toString()) return res.status(403).json({ message: 'Not authorized' });

    await Moment.findByIdAndDelete(momentId);
    await User.findByIdAndUpdate(req.userId, { $pull: { moments: momentId } });

    return res.status(200).json({ success: true, momentId });
  } catch (error) {
    console.error('🔥 Delete Moment Error:', error.message, error.stack);
    return res.status(500).json({ message: 'Something went wrong in delete moment' });
  }
}

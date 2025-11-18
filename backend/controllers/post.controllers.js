import uploadOnCloudinary from "../config/cloudinary.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { getIO } from "../socket.js";



export const uploadPost = async (req, res) => {
  try {
    const { caption, mediaType } = req.body;

    // allow both image and video
    if (!mediaType || !["image", "video"].includes(mediaType.toLowerCase())) {
      return res.status(400).json({ message: "Invalid media type. Only image or video allowed." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    const media = await uploadOnCloudinary(req.file.path);

    let post = await Post.create({
      caption,
      mediaType: mediaType.toLowerCase(),
      media,
      author: req.userId,
    });

    await User.findByIdAndUpdate(
      req.userId,
      { $push: { posts: post._id } },
      { new: true }
    );

    post = await post.populate("author", "name userName profileImage");

    return res.status(201).json(post);
  } catch (error) {
    console.log("🔥 Upload Post Error:", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};


export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name userName profileImage").sort({createdAt: -1})
      .populate("comments.author");
    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong in getAllPost" });
  }
};

export const like = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() == req.userId.toString()
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() != req.userId.toString()
      );
    } else {
      post.likes.push(req.userId);
      // realtime notify author about like (avoid self-notify)
      try {
        const io = getIO();
        const authorId = post.author.toString();
        if (authorId !== req.userId.toString()) {
          io.to(authorId).emit("notification", {
            type: "like",
            text: "liked your post",
            postId: post._id,
            from: req.userId,
            at: Date.now(),
          });
        }
      } catch {}
    }

    await post.save();
    await post.populate("author", "name userName profileImage");

    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong in like" });
  }
};

export const comment = async (req, res) => {
  try {
    const { message } = req.body;
    const postId = req.params.postId || req.body.postId;
    console.log('POST /api/post/comment called', { params: req.params, body: req.body, derivedPostId: postId, userId: req.userId })

    if (!postId) {
      console.warn('Comment handler: no postId provided in params or body')
      return res.status(400).json({ message: 'postId is required' })
    }
    const post = await Post.findById(postId);
    if (!post) {
      console.warn('Comment handler: no Post found for id', postId)
      return res.status(404).json({ message: "Post not found", postId })
    }

    // const comment = await Comment.create({ message, author: req.userId });

    post.comments.push({
      author: req.userId,
      message,
    });

    await post.save();
    await post.populate("author", "name userName profileImage");
    await post.populate("comments.author");

    // realtime notify post author about a new comment
    try {
      const io = getIO();
      const authorId = post.author._id?.toString?.() || post.author.toString();
      if (authorId !== req.userId.toString()) {
        io.to(authorId).emit("notification", {
          type: "comment",
          text: "commented on your post",
          postId: post._id,
          from: req.userId,
          at: Date.now(),
        });
      }
    } catch {}

    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong in comment" });
  }
};


// Save/unsave Post
export const savedPost = async (req, res) => {
  try {
    const { postId } = req.params;
    // Use atomic update to avoid version errors when multiple clients modify savedPosts
    const user = await User.findById(req.userId).select('savedPosts');
    if (!user) return res.status(404).json({ message: "User not found" });

    const alreadySaved = user.savedPosts.some(id => id.toString() === postId);

    let updatedUser;
    if (alreadySaved) {
      updatedUser = await User.findByIdAndUpdate(
        req.userId,
        { $pull: { savedPosts: postId } },
        { new: true }
      )
        .populate({ path: 'savedPosts', populate: { path: 'author', select: 'userName profileImage name' } })
        .select('-password');
    } else {
      updatedUser = await User.findByIdAndUpdate(
        req.userId,
        { $addToSet: { savedPosts: postId } },
        { new: true }
      )
        .populate({ path: 'savedPosts', populate: { path: 'author', select: 'userName profileImage name' } })
        .select('-password');
    }

    return res.status(200).json({ success: true, savedPosts: updatedUser.savedPosts });
  } catch (error) {
    console.error("savedPost error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Save/unsave Moment
export const savedMoment = async (req, res) => {
  try {
    const { momentId } = req.params;
    // Use atomic update to avoid version errors when multiple clients modify savedMoments
    const user = await User.findById(req.userId).select('savedMoments');
    if (!user) return res.status(404).json({ message: "User not found" });

    const alreadySaved = user.savedMoments.some(id => id.toString() === momentId);

    let updatedUser;
    if (alreadySaved) {
      updatedUser = await User.findByIdAndUpdate(
        req.userId,
        { $pull: { savedMoments: momentId } },
        { new: true }
      )
        .populate({ path: 'savedMoments', populate: { path: 'author', select: 'userName profileImage name' } })
        .select('-password');
    } else {
      updatedUser = await User.findByIdAndUpdate(
        req.userId,
        { $addToSet: { savedMoments: momentId } },
        { new: true }
      )
        .populate({ path: 'savedMoments', populate: { path: 'author', select: 'userName profileImage name' } })
        .select('-password');
    }

    return res.status(200).json({ success: true, savedMoments: updatedUser.savedMoments });
  } catch (error) {
    console.error("savedMoment error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a post (only author)
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.userId.toString()) return res.status(403).json({ message: 'Not authorized' });

    await Post.findByIdAndDelete(postId);
    // remove reference from user
    await User.findByIdAndUpdate(req.userId, { $pull: { posts: postId } });

    return res.status(200).json({ success: true, postId });
  } catch (error) {
    console.error('🔥 Delete Post Error:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}


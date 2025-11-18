import express from "express";
import isAuth from "../middlewares/isAuth.js";

import { upload } from "../middlewares/multer.js";
import { comment, getAllPost, like, savedPost, savedMoment, uploadPost, deletePost } from "../controllers/post.controllers.js";

const postRouter=express.Router()
postRouter.post('/upload',isAuth,upload.single('media'),uploadPost)
postRouter.get('/getAll',isAuth,getAllPost)
postRouter.get('/like/:postId',isAuth,like)
// Save/unsave a post
postRouter.post("/saved/post/:postId", isAuth, savedPost);

// Save/unsave a moment
postRouter.post("/saved/moment/:momentId", isAuth, savedMoment);
postRouter.post('/comment/:postId',isAuth,comment)
postRouter.delete('/delete/:postId', isAuth, deletePost)

export default postRouter;

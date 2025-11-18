import express from "express";
import isAuth from "../middlewares/isAuth.js";

import { upload } from "../middlewares/multer.js";
import { comment, getAllMoment, like, uploadMoment, getMomentById, deleteMoment } from "../controllers/moment.controllers.js";

const momentRouter=express.Router()
momentRouter.post('/upload',isAuth,upload.single('media'),uploadMoment)
momentRouter.get('/getAll',isAuth,getAllMoment)
momentRouter.get('/:momentId', isAuth, getMomentById)
momentRouter.get('/like/:momentId',isAuth,like)

momentRouter.post('/comment',isAuth,comment)
momentRouter.delete('/delete/:momentId', isAuth, deleteMoment)
export default momentRouter;

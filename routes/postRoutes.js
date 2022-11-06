import express from "express";
const router = express.Router();
import authenticateUser from "../middleware/auth.js";
import {
  createPost,
  getMyPosts,
  getAllPosts,
  deletePost,
  updatePost,
  likeAPost,
  commentOnAPost,
} from "../controllers/postController.js";

router.route("/createPost").post(authenticateUser, createPost);

router.route("/getMyPosts").get(authenticateUser, getMyPosts);

router.route("/getAllPosts").get(authenticateUser, getAllPosts);

router.route("/likeAPost").patch(authenticateUser, likeAPost);

router.route("/comment").patch(authenticateUser, commentOnAPost);

router
  .route("/modifyPost/:id")
  .delete(authenticateUser, deletePost)
  .patch(authenticateUser, updatePost);
export default router;

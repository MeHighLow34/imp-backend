import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "../errors/index.js";
import checkPermissions from "../utils/checkPermissions.js";

async function createPost(req, res) {
  const { title, content } = req.body;
  if (!title || !content) {
    throw new BadRequestError("Please Provide All Values");
  }
  const user = await User.findOne({ _id: req.user.userId });
  req.body.createdBy = req.user.userId;
  req.body.posterName = user.name;
  const post = await Post.create(req.body);
  res.status(StatusCodes.OK).json({ post });
}

async function getMyPosts(req, res) {
  const posts = await Post.find({ createdBy: req.user.userId });

  res.status(StatusCodes.OK).json({ posts, totalPosts: posts.length });
}

async function getAllPosts(req, res) {
  const skip = req.query.skip ? Number(req.query.skip) : 0;
  const DEFAULT_LIMIT = 10;
  const posts = await Post.find({})
    .skip(skip)
    .limit(DEFAULT_LIMIT)
    .sort({ createdAt: -1 });
  const finalPosts = posts.map((post) => {
    post.likedBy = post.likedBy.map((likeId) => {
      if (likeId === req.user.userId) {
        post.alreadyLiked = true;
      }
      return;
    });

    return post;
  });
  res.json({ all: finalPosts });
}

async function updatePost(req, res) {
  const { id: postId } = req.params;

  const { title, content } = req.body;

  if (!title || !content) {
    throw new BadRequestError("Please Provide All Values");
  }

  const post = await Post.findOne({ _id: postId });

  if (!post) {
    throw new NotFoundError(`No job with id ${postId}`);
  }

  //check permissions to see if we are an actual owner of this post...makes sense or if we are an admin

  checkPermissions(req.user, post.createdBy);
  const updatedPost = await Post.findOneAndUpdate({ _id: postId }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(StatusCodes.OK).json({ updatedPost });
}
async function deletePost(req, res) {
  const { id: postId } = req.params;

  const post = await Post.findOne({ _id: postId });

  if (!post) {
    throw new BadRequestError("There is no such post to delete");
  }

  checkPermissions(req.user, post.createdBy);

  await post.remove();
  res.status(StatusCodes.OK).json({ post });
}

async function likeAPost(req, res) {
  const { id } = req.body;

  if (!id) {
    throw new BadRequestError("There was an error...Try again  later");
  }
  const post = await Post.findOne({ _id: id });

  if (!post) {
    throw new NotFoundError("No post with such an id");
  }

  let alreadyLiked = false;
  post.likedBy.forEach((likeId) => {
    if (likeId === req.user.userId) {
      alreadyLiked = true;
    }
    return;
  });
  if (alreadyLiked) {
    post.likedBy = post.likedBy.filter((like) => {
      return like != req.user.userId;
    });
    post.likes--;

    await post.save();
    res.status(StatusCodes.OK).json({ msg: "Post unliked successfully", post });
    return;
  } else {
    post.likedBy.push(req.user.userId);
    post.likes++;

    await post.save();

    post.alreadyLiked = true; // in db this is always false but for this speciific user it isn't

    res.status(StatusCodes.OK).json({ msg: "Post liked successfully", post });
  }
}

async function commentOnAPost(req, res) {
  const { postId, content, parentId } = req.body;
  if (!postId) {
    throw new BadRequestError("Provide the post id");
  }
  if (!content) {
    throw new BadRequestError("Please provide the content of the comment");
  }

  const post = await Post.findOne({ _id: postId });
  if (!post) {
    throw new BadRequestError("There is no such post");
  }
  // separe collection for comments...
  // const comment = await Comment.create({
  // content: content,
  // postId: postId,
  // parentId: parentId,
  // createdBy: req.user.userId,
  // });

  // post.comments.push(comment._id);
  // await post.save();
  // const postComments = await Comment.find({ postId: postId });
  post.comments.push({
    content: content,
    postId: postId,
    parentId: parentId,
    createdBy: req.user.userId,
  });
  await post.save();
  res.status(StatusCodes.OK).json({ msg: "commented successfullly", post });
}

export {
  createPost,
  getMyPosts,
  getAllPosts,
  updatePost,
  deletePost,
  likeAPost,
  commentOnAPost,
};

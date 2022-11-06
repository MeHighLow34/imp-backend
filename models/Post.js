import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      maxLength: 200,
    },
    content: {
      type: String,
      required: [true, "Please provide content to your post"],
      maxLength: 500,
    },
    mood: {
      type: String,
      enum: ["angry", "great", "sad", "neutral"],
      default: "neutral",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide the user"],
    },
    posterName: {
      type: String,
      default: "Thedoisus",
    },
    imageUrl: {
      type: String,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: {
      type: [String],
      default: [],
    },
    alreadyLiked: {
      type: Boolean,
      default: false,
    },
    comments: [
      {
        content: {
          type: String,
          maxLength: 200,
        },
        createdBy: {
          type: mongoose.Types.ObjectId,
          ref: "User",
          required: [true, "Please provide the user"],
        },
        postId: {
          type: mongoose.Types.ObjectId,
          ref: "Post",
          required: [true, "Please provide the post Id"],
        },
        parentId: {
          type: mongoose.Types.ObjectId,
          ref: "Comment",
          default: null,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);

import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
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
  { timestamps: true }
);

export default mongoose.model("Comment", CommentSchema);

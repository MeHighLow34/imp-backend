import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "../errors/index.js";
import checkPermissions from "../utils/checkPermissions.js";

async function getProfile(req, res) {
  const { id } = req.body;
  if (!id) {
    throw new BadRequestError("Please provide id");
  }
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new BadRequestError("No such user exists");
  }
  res.status(StatusCodes.OK).json({ user });
}

export { getProfile };

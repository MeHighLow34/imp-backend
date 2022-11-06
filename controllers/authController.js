import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";

async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError("please provide all values");
  }
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError("Email already in use");
  }
  const user = await User.create({ name, email, password });
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      email: user.email,
      location: user.location,
      lastName: user.lastName,
      userID: user._id,
    },
    token,
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email) {
    throw new BadRequestError("Email is missing");
  }
  if (!password) {
    throw new BadRequestError("password is missing");
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new UnAuthenticatedError("No such email");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (isPasswordCorrect == false) {
    throw new UnAuthenticatedError("Password Incorrect");
  }
  const token = user.createJWT();
  user.password = undefined;
  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      email: user.email,
      location: user.location,
      lastName: user.lastName,
      userID: user._id,
    },
    token,
  });
}

async function updateUser(req, res) {
  const { name, lastName, location } = req.body;
  if (!name || !lastName || !location) {
    throw new BadRequestError("Please Provide All Values");
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.name = name;
  user.lastName = lastName;
  user.location = location;

  await user.save();

  console.log(req.user);
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      email: user.email,
      location: user.location,
      lastName: user.lastName,
      userID: user._id,
    },
    token,
  });
}

export { register, login, updateUser };

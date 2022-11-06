import { UnAuthenticatedError } from "../errors/index.js";

const checkPermissions = (requestUser, resourceUserId) => {
  //if (requestUser.role === 'admin') return //checking if we are an admin
  if (requestUser.userId === resourceUserId.toString()) return; // checking if we are the ones that created the resource
  throw new UnAuthenticatedError("Not authorized to access this route");
};

export default checkPermissions;

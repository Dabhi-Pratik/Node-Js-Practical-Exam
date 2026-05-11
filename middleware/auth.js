import HttpError from "./HttpError.js";
import jwt from "jsonwebtoken";
import User from "../model/UserModel.js";

const auth = async function (req, res, next) {
  try {
    const authHeader = req.header("Authorization");

    console.log("Authorization", authHeader);

    if (!authHeader) {
      return next(new HttpError("Auth header is Requires..."));
    }

   const token = authHeader.replace("Bearer ", "");

    // console.log("Token", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      return next(new HttpError("Authentication Failed", 401));
    }

    req.user = user;

    req.token = token;

    next();
  } catch (error) {
    next(new HttpError("Please Authenticate ", 401));
  }
};

export default auth;
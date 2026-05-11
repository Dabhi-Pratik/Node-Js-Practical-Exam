import User from "../model/UserModel.js";
import HttpError from "../middleware/HttpError.js";

const addUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const newUser = {
      name,
      email,
      password,
      role,
    };

    const user = new User(newUser);

    const token = await user.generateAuthToken();

    await user.save();

    res.status(201).json({
      success: true,
      message: "User Added SuccessFully....!",
      user,
      token,
    });
  } catch (error) {
    next(new HttpError(error.message));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByCredentials(email, password);

    if (!user) {
      next(new HttpError("Unable to login"));
    }

    const token = await user.generateAuthToken();

    res
      .status(200)
      .json({ success: true, message: "Login SuccessFully...!", user, token });
  } catch (error) {
    next(new HttpError(error.message));
  }
};

const authLogin = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return next(new HttpError("Unable to Login"));
    }

    res
      .status(200)
      .json({ success: true, message: "Auth Login Successfully.....!", user });
  } catch (error) {
    next(new HttpError(error.message));
  }
};

const logOut = async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter((t) => t.token != req.token);

    await req.user.save();

    res.status(200).json({ message: "User Log out SuccessFully...!" });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const logOutAll = async (req, res, next) => {
  try {
    req.user.tokens = [];

    req.user.save();

    res
      .status(200)
      .json({ message: "User LogOut from all devices SuccessFully" });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const allUser = async (req, res, next) => {
  try {
    if (req.user.role === "admin") {
      const users = await User.find({});

      return res.status(200).json({
        success: true,
        message: "All Users Data",
        users,
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new HttpError("User not Found...!", 404));
    }

    res.status(200).json({
      success: true,
      message: "User Profile Data",
      user,
    });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const update = async (req, res, next) => {
  try {
    const userId = req.params.id || req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return next(new HttpError("User not Found.....!"));
    }

    let allowUpdates = [];

    if (req.user.role === "admin") {
      allowUpdates = ["name", "email", "password"];
    } else {
      allowUpdates = ["name", "password"];
    }

    const updates = Object.keys(req.body);

    const isValid = updates.every((field) => allowUpdates.includes(field));

    if (!isValid) {
      return next(new HttpError("Only allowed Fields can be Updated.....!"));
    }

    updates.forEach((field) => {
      user[field] = req.body[field];
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Updated Successfully...!",
      user,
    });
  } catch (error) {
    next(new HttpError(error.message));
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id || req.user._id;

    if (req.user.role !== "admin") {
      return next(new HttpError("Access Denied. Admin Only...!", 403));
    }

    const user = await User.findById(userId);

    if (!user) {
      return next(new HttpError("User not Found.....!"));
    }

    await user.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "User Deleted Successfully......!" });
  } catch (error) {
    next(new HttpError(error.message));
  }
};

export default {
  addUser,
  login,
  allUser,
  authLogin,
  logOut,
  logOutAll,
  update,
  deleteUser,
};

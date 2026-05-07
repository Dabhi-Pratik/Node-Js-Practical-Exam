import User from "../model/UserModel.js";
import HttpError from "../middleware/HttpError.js";

const addUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const newUser = {
      name,
      email,
      password,
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

const allUser = async (req, res, next) => {
  try {
    const users = await User.find({});

    if (!users) {
      return next(new HttpError("No User Data Founded...!"));
    }

    res.status(200).json({ success: true, message: "User Data", users });
  } catch (error) {
    next(new HttpError(error.message));
  }
};

export default { addUser, login, allUser, authLogin };

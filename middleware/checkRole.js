import HttpError from "./HttpError.js";

const checkRole =
  (...role) =>
    async (req, res, next) => {
      try {
        if (!req.user) {
          return next(new HttpError("Please Authenticate", 401));
        }

        if (!role.includes(req.user.role)) {
          return next(new HttpError("forbidden:Access denied", 403));
        }

        next()
      } catch (error) {
        next(new HttpError(error.message));
      }
    };

export default checkRole
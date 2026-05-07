import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
    validate: (value) => {
      if (!value.endsWith("@gmail.com")) {
        throw new Error("Invalid Email");
      }
    },
  },
  password: {
    type: String,
    unique: true,
    trim: true,
    required: true,
    validate: (value) => {
      if (value.toLowerCase() === "password") {
        throw new Error("Password can't contain password word as password");
      }
    },
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.pre("save", async function () {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
});

userSchema.statics.findByCredentials = async function (email, password) {
  try {
    const user = await this.findOne({ email });

    if (!user) {
      throw new Error("Unable to Login.....!");
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      throw new Error("Unable to Login....!");
    }

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

userSchema.methods.generateAuthToken = async function () {
  try {
    const user = this;

    const token = jwt.sign(
      {
        _id: user._id.toString(),
      },
      process.env.JWT_SECRET,
    );

    if (!token) {
      throw new Error("Unable to generate Token");
    }

    user.tokens = user.tokens.concat({ token });

    await user.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

const User = mongoose.models.user || mongoose.model("user", userSchema);

export default User;

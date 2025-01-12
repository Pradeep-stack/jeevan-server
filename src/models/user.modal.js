import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
    },
    fullName: {
      type: String,
      // required: true,
      trim: true,
      index: true,
    },
    age: {
      type: Number,
      // required: true,
    },
    sex: {
      type: String,
      enum: ["Male", "Female", "Other"],
      // required: true,
    },
    image: {
      type: String,
      // required: true,
    },
    education: {
      type: String,
      // required: true,
    },
    city: {
      type: String,
      // required: true,
    },
    state: {
      type: String,
      // required: true,
    },
    country: {
      type: String,
      // required: true,
    },
    phone: {
      type: Number, // cloudinary url
      // required: true,
    },
    user_type: {
      type: String,
      enum: ["Super_Admin", "Admin", "User"],
    },
    password: {
      type: String,
      required: true,
    },
    referral_code: {
      type: String,
    },
    referredBy: { type: String },
    points: { type: Number, default: 0 },
    refreshToken: {
      type: String,
    },
    region: {
      type: String,
      enum: ["india", "nepal"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);

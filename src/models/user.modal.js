import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    title: {  
      type: String, 
      required: true,
      enum: ["Mr", "Mrs", "Miss", "Dr", "Prof", "Rev", "Other"],
    },
    fullName: {
      type: String,
      // required: true,
      trim: true,
      index: true,
    },
    phone: {
      type: Number, // cloudinary url
      // required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
    },
    user_type: {
      type: String,
      enum: ["Super_Admin", "Admin", "User"],
    },
    password: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      // required: true,
    },
    dob: {  
      type: Date,
      // required: true,    
    },
  
    position:{
      type: String,
      // required: true,
      // enum: ["left", "right"],
    },
    sponser_code: { type: String },
    sponserBy: { type: String },
    leftChild: { type: Schema.Types.ObjectId, ref: "User" },
    rightChild: { type: Schema.Types.ObjectId, ref: "User" },
    directReferrals: [{ type: Schema.Types.ObjectId, ref: "User" }],
    points: { type: Number, default: 0 },
    refreshToken: {
      type: String,
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


// import mongoose, { Schema } from "mongoose";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";

// const userSchema = new Schema(
//   {
//     title: {  
//       type: String, 
//       required: true,
//       enum: ["Mr", "Mrs", "Miss", "Dr", "Prof", "Rev", "Other"],
//     },
//     fullName: {
//       type: String,
//       trim: true,
//       index: true,
//     },
//     phone: {
//       type: Number,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     user_type: {
//       type: String,
//       enum: ["Super_Admin", "Admin", "User"],
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     country: {
//       type: String,
//     },
//     dob: {  
//       type: Date,
//     },
//     sponser_code: {
//       type: String,
//       unique: true,
//     },
//     sponserBy: { type: Schema.Types.ObjectId, ref: "User" },
//     leftChild: { type: Schema.Types.ObjectId, ref: "User" },
//     rightChild: { type: Schema.Types.ObjectId, ref: "User" },
//     directReferrals: [{ type: Schema.Types.ObjectId, ref: "User" }],
//     points: { type: Number, default: 0 },
//     refreshToken: {
//       type: String,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// userSchema.methods.isPasswordCorrect = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };

// userSchema.methods.generateAccessToken = function () {
//   return jwt.sign(
//     {
//       _id: this._id,
//       email: this.email,
//       username: this.username,
//       fullName: this.fullName,
//     },
//     process.env.ACCESS_TOKEN_SECRET,
//     {
//       expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
//     }
//   );
// };

// userSchema.methods.generateRefreshToken = function () {
//   return jwt.sign(
//     {
//       _id: this._id,
//     },
//     process.env.REFRESH_TOKEN_SECRET,
//     {
//       expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
//     }
//   );
// };

// export const User = mongoose.model("User", userSchema);


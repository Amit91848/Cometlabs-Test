import { Document, Model, Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { UserRole } from "../types";

export interface User {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
}

interface UserBaseDocument extends User, Document {
  comparePassword(userPassword: string): Promise<boolean>;
  getRole(): String;
}

interface UserModel extends Model<UserBaseDocument> {}

const UserSchema = new Schema<UserBaseDocument, UserModel>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    enum: [0, 1],
    default: 0,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.pre("save", async function (next) {
  const user: UserBaseDocument = this;
  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    user.password = hashedPassword;
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.comparePassword = async function (userPassword: string) {
  try {
    return await bcrypt.compare(userPassword, this.password);
  } catch (err) {
    throw err;
  }
};

UserSchema.methods.getRole = async function () {
  return this.role === 0 ? "User" : "Admin";
};

export default model<UserBaseDocument, UserModel>("User", UserSchema);

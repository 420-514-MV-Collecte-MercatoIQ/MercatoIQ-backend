import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";
import { USER_ROLES, UserRole } from "../constants/user-roles.constant";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password_hash: string;

  @Prop({ type: String, enum: USER_ROLES, default: "user" })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);

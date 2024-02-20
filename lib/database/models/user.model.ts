import { Schema, model, models } from "mongoose";

const stringNeeded = { type: String, required: true };
const stringUnique = { type: String, required: true, unique: true };

const UserSchema = new Schema({
  clerkId: stringUnique,
  email: stringUnique,
  username: stringUnique,
  firstName: stringNeeded,
  lastName: stringNeeded,
  photo: stringNeeded,
});

const User = models.User || model("User", UserSchema);

export default User;

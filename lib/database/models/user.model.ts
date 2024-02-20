import { Schema, model, models } from "mongoose";

const stringRequired = { type: String, required: true };
const stringUnique = { type: String, required: true, unique: true };

const UserSchema = new Schema({
  clerkId: stringUnique,
  email: stringUnique,
  username: stringUnique,
  firstName: stringRequired,
  lastName: stringRequired,
  photo: stringRequired,
});

const User = models.User || model("User", UserSchema);

export default User;

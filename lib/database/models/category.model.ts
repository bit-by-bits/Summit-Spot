import { Document, Schema, model, models } from "mongoose";

const stringUnique = { type: String, required: true, unique: true };

export interface ICategory extends Document {
  _id: string;
  name: string;
}

const CategorySchema = new Schema({ name: stringUnique });

const Category = models.Category || model("Category", CategorySchema);

export default Category;

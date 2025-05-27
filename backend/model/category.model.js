// model/category.model.js
import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  image: {
    type: String,
    required: false,
    trim: true,
  },
  url_key: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null, // null = root category
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.model("Category", categorySchema);

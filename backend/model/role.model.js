import mongoose, { Schema } from "mongoose";

const roleSchema = Schema({
  name: { type: String, required: true, unique: true },
  permissions: [
    {
      page: { type: String, required: true },
      create: { type: Boolean, default: false },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      view: { type: Boolean, default: false },
    }
  ]
}, {
  timestamps: true
});

export default mongoose.model("Role", roleSchema);

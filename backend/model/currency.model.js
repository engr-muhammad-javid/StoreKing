import mongoose, { Schema } from "mongoose";

const currencySchema = new Schema({
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  isCryptocurrency: { type: Boolean, default: false },
  exchangeRate: { type: Number, required: true },
}, {
  timestamps: true
});

export default mongoose.model("Currency", currencySchema);

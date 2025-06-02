import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: String,

  brand_id: {
    type: Schema.Types.ObjectId,
    ref: "Brand",
    required: true
  },

  category_id: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },

  tax_id: {
    type: Schema.Types.ObjectId,
    ref: "Tax"
  },

  unit_id: {
    type: Schema.Types.ObjectId,
    ref: "Unit"
  },

  price: {
    type: Number,
    required: true
  },

  salePrice: {
    type: Number,
    default: 0
  },

  stock: {
    type: Number,
    default: 0
  },

  weight: {
    type: Number, // in kg or grams
    default: 0
  },

  dimensions: {
    length: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 }
  },

  status: {
    type: String,
    enum: ['active', 'inactive', 'discontinued', 'draft'],
    default: 'active'
  },

  images: [
    {
      url: String,
      alt: String
    }
  ],

  tags: [String],

  isFeatured: {
    type: Boolean,
    default: false
  },

  isActive: {
    type: Boolean,
    default: true
  },

  ratings: {
    type: Number,
    default: 0
  },

  reviews: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
      },
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, {
  timestamps: true
});
export default mongoose.model("Product", productSchema);

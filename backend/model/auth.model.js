import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const addressSchema = new Schema({
    type: {
        type: String,
        enum: ['Home', 'Office', 'Other'],
        required: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        match: [
            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            "Please enter a valid email address"
        ]
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: Schema.Types.ObjectId,
        ref: "Role", // 🔹 Reference to Role model
        required: true
    },

    profile: {
        type: String,
        default: 'avatar.png',
    },

    phone: {
        type: String,
        match: [
            /^(\+92|0)?3[0-9]{9}$/,
            "Please enter a valid Pakistani phone number (e.g. 03XXXXXXXXX or +923XXXXXXXXX)"
        ]
    },

    addresses: [addressSchema] // 🔹 Multiple addresses here

});

userSchema.methods.getAuthToken = async function () {
    return jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
};

userSchema.methods.isPassMatch = function (password) {
    return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);

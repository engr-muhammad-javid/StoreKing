import bcrypt from "bcryptjs";
import { normalizeErrorMessage } from "../utils/normalizeError.js";

export const sendToken = async (res, user, msg) => {
  const token = await user.getAuthToken();

  res.status(200).json({
    status: true,
    accessToken: token,
    message: msg,
    content: {
      _id: user?._id,
      name: user?.name,
      email: user?.email,
      role: user?.role,
      picture: user?.profile
        ? `http://localhost:4000/profile/${user?.profile}`
        : null,
      phone: user?.phone,
      addresses: user?.addresses,
    },
  });
};



export const sendProfile= async (res, status, msg, user) => {
  res.status(status ? 200 : 400).json({
    status: true,
    message: msg,
    content: {
      _id: user?._id,
      name: user?.name,
      email: user?.email,
      role: user?.role,
      picture: user?.profile
        ? `http://localhost:4000/profile/${user?.profile}`
        : null,
      phone: user?.phone,
      addresses: user?.addresses,
    },
  });
};

export const sendResponse = (res, status, msg, content = null) => {
  res.status(status ? 200 : 400).json({
    status,
    message: msg,
    content,
  });
};

export const sendError = (res, error) => {
  const message = normalizeErrorMessage(error);
  res.status(500).json({
    status: false,
    message: message,
  });
};

export const hashPass = async (pass) => await bcrypt.hash(pass, 10);

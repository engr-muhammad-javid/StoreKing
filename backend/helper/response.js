import bcrypt from "bcryptjs";

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
      picture: user?.profile_pic
        ? `http://localhost:5000/profile/${user?.profile_pic}`
        : null,
      phone: user?.phone,
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

export const sendError = (res, msg) => {
  res.status(500).json({
    status: false,
    message: msg,
  });
};

export const hashPass = async (pass) => await bcrypt.hash(pass, 10);

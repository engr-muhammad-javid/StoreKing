import Users from "../model/auth.model.js";
import Role from "../model/role.model.js";
import { sendResponse, sendError, sendToken, hashPass, sendProfile } from "../helper/response.js";
import {msg} from "../i18n/text.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return sendResponse(res, false, msg.fillAllFields);
    }

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return sendResponse(res, false, msg.userExists);
    }

    // ✅ Determine role to use: if `role` is sent, use that ID; otherwise use "Customer"
    let roleDoc;
    if (role) {
      roleDoc = await Role.findById(role);
      if (!roleDoc) {
        return sendResponse(res, false, "Invalid role ID provided.");
      }
    } else {
      roleDoc = await Role.findOne({ name: "Customer" });
      if (!roleDoc) {
        return sendResponse(res, false, "Default 'Customer' role not found.");
      }
    }

    const hashedPassword = await hashPass(password);

    const newUser = new Users({
      name,
      email,
      password: hashedPassword,
      role: roleDoc._id // ✅ always store role ID
    });

    const reg = await newUser.save();
    return sendToken(res, reg, msg.success);

  } catch (error) {
    return sendError(res, error);
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendResponse(res, false, msg.emailPassRequired);
    }

    const user = await Users.findOne({ email }).populate("role");

    if (!user) {
      return sendResponse(res, false, msg.userIdNotFound);
    }

    const isMatch = await user.isPassMatch(password);

    if (!isMatch) {
      return sendResponse(res, false, msg.auth);
    }

    return sendToken(res, user, msg.userLogin);

  } catch (error) {
    return sendError(res, error);
  }
};


export const profile = async (req, res) => {
    try{    
        if(!req.user){
            return sendResponse(res, false, userIdNotFound);
        }
        return sendResponse(res, true, msg.userProfile, req.user);

    }catch(error){
        return sendError(res, error);
    }
}

export const upload_pic = async (req, res) => {
    try {
        if (!req.user) {
            return sendResponse(res, false, msg.userIdNotFound);
        }

        if (!req.file) {
            return sendResponse(res, false, "No image uploaded");
        }

        const data = {
            profile: req.file.filename,
        };

        const update = await Users.findByIdAndUpdate(
            req.user._id,
            data,
            { new: true }
        );
        
        return sendProfile(res, true, msg.success, update);

    } catch (error) {
        return sendError(res, error);
    }
};

export const changePass = async (req, res) => {

    const {oldPass, newPass} = req.body;
   
    try{    
        if(!req.user){
            return sendResponse(res, false, userIdNotFound);
        }
        
        const isMatch = await req.user.isPassMatch(oldPass);
        
        if(!isMatch){
            return sendResponse(res, false, msg.InValidOldPassword);
        }

        const hashedPassword = await hashPass(newPass);
        const data = {
            ...req.body,
            password:hashedPassword
        }
        
        const update = await Users.findByIdAndUpdate(
            {_id:req.user._id}, 
            data, 
            {new:true}
        );
        return sendProfile(res, true, msg.success, update);

    }catch(error){
        return sendError(res, error);
    }
  
}


export const updateProfile = async (req, res) => {
    try {
        if (!req.user) {
            return sendResponse(res, false, msg.userIdNotFound);
        }

        let updateData = { ...req.body };

        if (req.file) {
            updateData.profile = req.file.filename;
        }

        const update = await Users.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true }
        );

        return sendProfile(res, true, msg.success, update);

    } catch (error) {
        return sendError(res, error);
    }
};

export const addAddress = async (req, res) => {
    try {
        if (!req.user) {
            return sendResponse(res, false, msg.userIdNotFound);
        }

        const { type, address, latitude, longitude } = req.body;

        if (!type || !address) {
            return sendResponse(res, false, "Both type and address are required.");
        }

        // Optional: Validate allowed address types
        const allowedTypes = ['Home', 'Office', 'Other'];
        if (!allowedTypes.includes(type)) {
            return sendResponse(res, false, `Address type must be one of: ${allowedTypes.join(', ')}`);
        }

        // Push the new address
        const updatedUser = await Users.findByIdAndUpdate(
            req.user._id,
            { $push: { addresses: { type, address, latitude, longitude  } } },
            { new: true }
        );

        return sendProfile(res, true, "Address added successfully.", updatedUser);

    } catch (error) {
        return sendError(res, error);
    }
};

export const updateAddress = async (req, res) => {
    try {
        const { addressId, type, address, latitude, longitude } = req.body;

        if (!req.user) return sendResponse(res, false, msg.userIdNotFound);
        if (!addressId || !type || !address || latitude == null || longitude == null) {
            return sendResponse(res, false, "All fields including addressId are required.");
        }

        const user = await Users.findById(req.user._id);
        const addr = user.addresses.id(addressId);

        if (!addr) {
            return sendResponse(res, false, "Address not found.");
        }

        addr.type = type;
        addr.address = address;
        addr.latitude = latitude;
        addr.longitude = longitude;

        const userData = await user.save();

        return sendProfile(res, true, "Address updated successfully.", userData);

    } catch (error) {
        return sendError(res, error);
    }
};

export const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.body;
  
        if (!req.user) {
            return sendResponse(res, false, "User not authenticated.");
        }

        const user = await Users.findById(req.user._id);
        if (!user) {
            return sendResponse(res, false, "User not found.");
        }

        // Find the index of the address to remove
        const index = user.addresses.findIndex(addr => addr._id.toString() === addressId);

        if (index === -1) {
            return sendResponse(res, false, "Address not found.");
        }

        // Remove address from array
        user.addresses.splice(index, 1);

        // Save the updated user
        const userData = await user.save();

        return sendProfile(res, true, "Address deleted successfully.", userData);

    } catch (error) {
        return sendError(res, error);
    }
};


export const getSingleAddress = async (req, res) => {
    try {
        const { addressId } = req.params;

        if (!req.user) {
            return sendResponse(res, false, "User not found.");
        }

        const user = await Users.findById(req.user._id);

        if (!user) {
            return sendResponse(res, false, "User not found.");
        }

        const address = user.addresses.id(addressId);

        if (!address) {
            return sendResponse(res, false, "Address not found.");
        }
        
        return sendResponse(res, true, "Address fetched successfully.", address);

    } catch (error) {
        return sendError(res, error);
    }
};

export const getAddresses = async (req, res) => {
    try {
        if (!req.user) {
            return sendResponse(res, false, "User not found.");
        }

        const user = await Users.findById(req.user._id).select('addresses');

        if (!user) {
            return sendResponse(res, false, "User not found.");
        }

        return sendResponse(res, true, "Addresses fetched successfully.", user.addresses);

    } catch (error) {
        return sendError(res, error);
    }
};
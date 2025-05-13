// controllers/role.controller.js
import Role from "../model/role.model.js";
import { sendResponse, sendError } from "../helper/response.js";

// Create Role
export const createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const role = new Role({ name, permissions });
    await role.save();
    return sendResponse(res, true, "Role created", role);
  } catch (err) {
    return sendError(res, err);
  }
};

// Get All Roles
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    return sendResponse(res, true, "Roles fetched", roles);
  } catch (err) {
    return sendError(res, err);
  }
};

// Get Single Role
export const getRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return sendResponse(res, false, "Role not found");
    return sendResponse(res, true, "Role found", role);
  } catch (err) {
    return sendError(res, err);
  }
};

// Update Role
export const updateRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!role) return sendResponse(res, false, "Role not found");
    return sendResponse(res, true, "Role updated", role);
  } catch (err) {
    return sendError(res, err);
  }
};

// Delete Role
export const deleteRole = async (req, res) => {
  try {
    const deleted = await Role.findByIdAndDelete(req.params.id);
    if (!deleted) return sendResponse(res, false, "Role not found");
    return sendResponse(res, true, "Role deleted");
  } catch (err) {
    return sendError(res, err);
  }
};

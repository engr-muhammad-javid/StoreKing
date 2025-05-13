import Users from "../model/auth.model.js";
import { sendResponse, sendError, sendToken, hashPass } from "../helper/response.js";

import {msg} from "../i18n/text.js";

export const register = async (req, res) => {
    try{
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return sendResponse(res, false, msg.fillAllFields);
        }else{
            
            const user = await Users.findOne({email});
    
            if(user){
                return sendResponse(res, false, msg.userExists);
            }
            const hashedPassword = await hashPass(password);

            const data = {
                ...req.body,
                password:hashedPassword,
                role:"user",
            };

            const newUser = new Users(data);
            const reg = await newUser.save();

            return sendToken(res, reg, msg.success);
    
        }

    }catch(error){
        return sendError(res, error);
    }
}


export const login = async (req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return sendResponse(res, false, msg.emailPassRequired);
        }else{
            const user = await Users.findOne({email})
    
            if(!user){
                return sendResponse(res, false, msg.userIdNotFound);
            }

            const isMatch = await user.isPassMatch(password);

            if(!isMatch){
                return sendResponse(res, false, msg.auth);
            }

            return sendToken(res, user, msg.userLogin);

        }

    }catch(error){
        return sendError(res, error);
    }
}


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
    try{    
        if(!req.user){
            return sendResponse(res, false, userIdNotFound);
        }
        const data = {
            profile: req.file.filename, 
        }

        const update = await Users.findByIdAndUpdate(
            {_id:req.user._id}, 
            data, 
            {new:true}
        );
        return sendResponse(res, true, msg.userProfile, update);

    }catch(error){
        return sendError(res, error);
    }
  
}


export const changePass = async (req, res) => {

    const {oldPass, newPass} = req.body;
   
    try{    
        if(!req.user){
            return sendResponse(res, false, userIdNotFound);
        }
        
        const isMatch = req.user.isPassMatch(oldPass);
        if(!isMatch){
            
            return sendResponse(res, false, msg.InValidOldPassword);
        }

        const hashedPassword = await hashPass(newPass);
        const data = {
            ...req.body,
            password:hashedPassword
        }
        console.log(data);

        const update = await Users.findByIdAndUpdate(
            {_id:req.user._id}, 
            data, 
            {new:true}
        );
        return sendResponse(res, true, msg.userProfile, update);

    }catch(error){
        console.log(error);
        return sendError(res, error);
    }
  
}


export const updateProfile = async (req, res) => {

    try{    
        if(!req.user){
            return sendResponse(res, false, userIdNotFound);
        }
       
        const update = await Users.findByIdAndUpdate(
            {_id:req.user._id}, 
            req.body,
             {new:true}
        );
        return sendResponse(res, true, msg.userProfile, update);

    }catch(error){
        return sendError(res, error);
    }
  
}
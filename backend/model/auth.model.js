import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = Schema({


    name: String,
    email: {
        type:String, 
        unique:true,
    
    },
    password: String,
    role: {
        type:String, 
        enum:['user',  'super-admin','admin', 'manager', 'service'],
    },
    profile:{
        type:String,
        default:'avatar.png',
    },

    phone:{
        type:String,
    }
});

userSchema.methods.getAuthToken = async function(){
    return await jwt.sign({_id:this._id}, process.env.SECRET_KEY)
};

userSchema.methods.isPassMatch= function(password){
    return bcrypt.compare(password,this.password);
}

export default mongoose.model("User", userSchema);


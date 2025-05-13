import mongoose from 'mongoose';


export const database = async() =>{

    try{
        const {connection} = await mongoose.connect(
            process.env.DB_STRING,
            {}
        );

        console.log("Connected to MongoDB", connection.host);

    }catch(error){
        console.log("Error in Database connection", error);
    }
}
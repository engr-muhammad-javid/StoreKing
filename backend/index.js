import { app } from "./app.js";
import { config } from "dotenv";
import { database } from "./config/database.js";


config();
database();

app.listen(process.env.PORT, ()=> console.log(`Server Running on Port: ${process.env.PORT}`));




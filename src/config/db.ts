import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const mongoUri = process.env.MONGODB_URL;
(async () => {
    try {
        if (!mongoUri){
            throw new Error("Invalid DataBase URL");
        }
        await mongoose.connect(mongoUri);

        console.log("connected to MongoDB Successfully");
    } catch (e) {
        console.log(e);
    }
})();

export default mongoose;
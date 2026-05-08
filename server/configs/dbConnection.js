import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(`${process.env.MONGODB_URI}/Edemy - Madkour`)
    .then(() => console.log("dataBase Connected"))
    .catch(() => console.log("dataBase didn't connect successfully"));
};

// password : edemy123
import mongoose from "mongoose";

const dB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("DB Connected");
  });
  await mongoose.connect(`${process.env.MONGODB_URI}/MovieDatabase`);
};

export default dB;

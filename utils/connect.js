const { default: mongoose } = require("mongoose");
export async function ConnectDB() {
  try {
    console.log(process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database");
  } catch (error) {
    console.log("erro while connecting to db ", error);
  }
}

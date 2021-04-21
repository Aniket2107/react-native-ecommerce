const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.DB_STRING,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
      () => console.log("Db connected")
    );
  } catch (error) {
    console.log("Db error", error);
    process.exit(1);
  }
};

module.exports = connectDb;

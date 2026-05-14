const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }

    this.isConnected = false;
    DatabaseConnection.instance = this;
  }

  async connect() {
    if (this.isConnected) {
      console.log("MongoDB already connected");
      return;
    }

    try {
      await mongoose.connect(process.env.MONGO_URI);
      this.isConnected = true;
      console.log("MongoDB connected successfully");
    } catch (error) {
      console.error("MongoDB connection error:", error.message);
      process.exit(1);
    }
  }
}

const databaseConnection = new DatabaseConnection();

const connectDB = async () => {
  await databaseConnection.connect();
};

module.exports = connectDB;
module.exports.DatabaseConnection = DatabaseConnection;

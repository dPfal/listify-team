const mongoose = require('mongoose');

// DESIGN PATTERN 1: SINGLETON
class DatabaseService {
  constructor() {
    if (!DatabaseService.instance) {
      this.isConnected = false;
      DatabaseService.instance = this;
    }
    return DatabaseService.instance;
  }

  async connect() {
    if (this.isConnected) {
      console.log('Using existing database connection');
      return;
    }

    try {
      mongoose.set('strictQuery', false); 

      // THE NUCLEAR OPTION: Hard-coded string bypassing the .env file entirely!
      const conn = await mongoose.connect("mongodb://127.0.0.1:27017/listify");
      
      this.isConnected = true;
      console.log(`MongoDB Connected (Singleton): ${conn.connection.host}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  }
}

const dbInstance = new DatabaseService();
module.exports = dbInstance;

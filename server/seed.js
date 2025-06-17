import bcrypt from 'bcrypt';
import User from './models/User.js';
import connectDB from './db/connection.js';

const register = async () => {
  try {
    connectDB();
    const hashedPassword = await bcrypt.hash("admin", 10);
    const newUser = new User({
      name: "admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      address: "123 Admin St, Admin City", 
      role: "admin"
    });
    await newUser.save();
    console.log(`User registered successfully.`);
  } catch (error) {
    console.error(`Error registering user:`, error.message);
  }
}

register();
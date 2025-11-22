import './app/config/env.js';
import mongoose from './app/config/mongoose.js';
import { role } from './app/constants/index.js';
import { hashPassword } from './app/middleware/hashPassword.js'; // ✅ use correct import
import userSchema from './app/Models/user.js';

async function genAdmin(email, password, name) {
  try {
    const passwordHash = await hashPassword(password);

    const existingAdmin = await userSchema.findOne({ email });
    if (existingAdmin) {
      console.log(`⚠️ Admin with email ${email} already exists.`);
      process.exit(0);
    }

    const user = await new userSchema({
      name,
      email,
      password: passwordHash,
      role: role.admin,
      phoneNumber:4185236412,
      createdBy: null,
      updatedBy: null,
    }).save();

    console.log(`   New Admin Created:`);
    console.log(`   ID: ${user._id.toString()}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);

  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    mongoose.connection.close(); 
  }
}

genAdmin('admin@gmail.com', 'YourSecurePassword123', 'Admin');

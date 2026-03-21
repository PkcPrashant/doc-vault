import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import User from '../models/User.js';
import env from '../config/env.js';

await mongoose.connect(env.mongoUri);

const passwordHash = await bcrypt.hash('123456', 10);

await User.create({
  username: 'prashant',
  email: 'test@example.com',
  passwordHash,
  role: 'USER'
});

console.log('User created');
await mongoose.disconnect();
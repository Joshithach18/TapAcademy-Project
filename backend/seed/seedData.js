import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Attendance from '../models/Attendance.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const users = [
  {
    name: 'John Manager',
    email: 'manager@company.com',
    password: 'password123',
    role: 'manager',
    employeeId: 'MGR001',
    department: 'Management'
  },
  {
    name: 'Alice Smith',
    email: 'alice@company.com',
    password: 'password123',
    role: 'employee',
    employeeId: 'EMP001',
    department: 'Engineering'
  },
  {
    name: 'Bob Johnson',
    email: 'bob@company.com',
    password: 'password123',
    role: 'employee',
    employeeId: 'EMP002',
    department: 'Engineering'
  },
  {
    name: 'Carol Williams',
    email: 'carol@company.com',
    password: 'password123',
    role: 'employee',
    employeeId: 'EMP003',
    department: 'Marketing'
  },
  {
    name: 'David Brown',
    email: 'david@company.com',
    password: 'password123',
    role: 'employee',
    employeeId: 'EMP004',
    department: 'Sales'
  },
  {
    name: 'Emma Davis',
    email: 'emma@company.com',
    password: 'password123',
    role: 'employee',
    employeeId: 'EMP005',
    department: 'HR'
  }
];

const generateAttendance = (userId, daysBack) => {
  const attendance = [];
  const statuses = ['present', 'late', 'present', 'present', 'present'];
  
  for (let i = 0; i < daysBack; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    if (status !== 'absent') {
      const checkInHour = status === 'late' ? 9 + Math.floor(Math.random() * 2) : 8 + Math.random();
      const checkInTime = new Date(date);
      checkInTime.setHours(Math.floor(checkInHour), Math.floor(Math.random() * 60));
      
      const checkOutTime = new Date(date);
      checkOutTime.setHours(17 + Math.random(), Math.floor(Math.random() * 60));
      
      const totalHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);
      
      attendance.push({
        userId,
        date,
        checkInTime,
        checkOutTime,
        status,
        totalHours: parseFloat(totalHours.toFixed(2))
      });
    }
  }
  
  return attendance;
};

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Attendance.deleteMany({});
    console.log('Data cleared');

    console.log('Creating users...');
    const createdUsers = [];
    for (const userData of users) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log(`Created ${createdUsers.length} users`);

    console.log('Creating attendance records...');
    const allAttendance = [];
    for (const user of createdUsers) {
      if (user.role === 'employee') {
        const userAttendance = generateAttendance(user._id, 30);
        allAttendance.push(...userAttendance);
      }
    }

    if (allAttendance.length > 0) {
      await Attendance.insertMany(allAttendance);
      console.log(`Created ${allAttendance.length} attendance records`);
    }

    console.log('\n===========================================');
    console.log('SUCCESS! Database seeded successfully');
    console.log('===========================================');
    console.log('\nTest Credentials:');
    console.log('Manager: manager@company.com / password123');
    console.log('Employee: alice@company.com / password123');
    console.log('Employee: bob@company.com / password123');
    console.log('===========================================\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\nERROR seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
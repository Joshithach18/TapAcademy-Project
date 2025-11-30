# Employee Attendance System

A full-stack web application for managing employee attendance with role-based access control. Built with React, Redux Toolkit, Node.js, Express, and MongoDB.

## 🚀 Live Demo

- **Frontend:** [https://your-app.onrender.com](https://employeemanagementfrontend.onrender.com/)
- **Backend API:** [https://your-api.onrender.com](https://employeeattendancemanagement.onrender.com/)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Test Credentials](#test-credentials)
- [Screenshots](#screenshots)

## ✨ Features

### Employee Features
- ✅ User registration and authentication
- ✅ Daily attendance marking (Check In/Check Out)
- ✅ View attendance history (Table and Calendar view)
- ✅ Monthly attendance summary (Present/Absent/Late/Half-day)
- ✅ Personal dashboard with statistics
- ✅ Profile management
- ✅ Real-time status updates

### Manager Features
- ✅ Manager dashboard with team analytics
- ✅ View all employees' attendance records
- ✅ Advanced filtering (by employee, date, status)
- ✅ Team calendar view showing daily status
- ✅ Export attendance reports to CSV
- ✅ Weekly attendance trend charts
- ✅ Real-time team monitoring
- ✅ Absent employees tracking

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Library
- **Redux Toolkit** - State Management
- **React Router DOM** - Routing
- **Axios** - HTTP Client
- **Vite** - Build Tool

### Backend
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password Hashing

## 📁 Project Structure

```
employee-attendance-system/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── middleware/
│   │   └── auth.js                # Authentication middleware
│   ├── models/
│   │   ├── User.js                # User model
│   │   └── Attendance.js          # Attendance model
│   ├── routes/
│   │   ├── auth.js                # Authentication routes
│   │   ├── attendance.js          # Attendance routes
│   │   └── dashboard.js           # Dashboard routes
│   ├── seed/
│   │   └── seedData.js            # Database seeding script
│   ├── .env                       # Environment variables
│   ├── .env.example               # Example environment variables
│   ├── server.js                  # Server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx         # Main layout component
│   │   │   ├── Navbar.jsx         # Navigation bar
│   │   │   └── PrivateRoute.jsx   # Protected route wrapper
│   │   ├── pages/
│   │   │   ├── employee/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── MarkAttendance.jsx
│   │   │   │   ├── AttendanceHistory.jsx
│   │   │   │   └── Profile.jsx
│   │   │   ├── manager/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── AllAttendance.jsx
│   │   │   │   ├── TeamCalendar.jsx
│   │   │   │   └── Reports.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── store/
│   │   │   ├── store.js           # Redux store
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       └── attendanceSlice.js
│   │   ├── utils/
│   │   │   └── api.js             # Axios configuration
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## 📥 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Clone the Repository
```bash
git clone https://github.com/Joshithach18/TapAcademy-Project.git
cd TapAcademy-Project
```

### Backend Setup
```bash
cd backend
npm install
```

### Frontend Setup
```bash
cd frontend
npm install
```

## 🔧 Environment Variables

### Backend (.env)
Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/attendance_system
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

For production (MongoDB Atlas):
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/attendance_system
JWT_SECRET=your_secure_random_string
NODE_ENV=production
```

### Frontend (.env.production)
Create a `.env.production` file in the `frontend` directory:

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

## 🚀 Running the Application

### 1. Start MongoDB (if using local)
```bash
mongod
```

### 2. Seed the Database
```bash
cd backend
npm run seed
```

This creates:
- 1 Manager account
- 5 Employee accounts
- 30 days of sample attendance data for each employee

### 3. Start Backend Server
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:5000`

### 4. Start Frontend Server
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:3000`

### 5. Access the Application
Open your browser and navigate to `http://localhost:3000`

## 🔑 Test Credentials

### Manager Account
```
Email: manager@company.com
Password: password123
```

### Employee Accounts
```
Email: alice@company.com
Password: password123

Email: bob@company.com
Password: password123

Email: carol@company.com
Password: password123

Email: david@company.com
Password: password123

Email: emma@company.com
Password: password123
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |

### Attendance (Employee)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/attendance/checkin` | Check in |
| POST | `/api/attendance/checkout` | Check out |
| GET | `/api/attendance/today` | Today's attendance |
| GET | `/api/attendance/my-history` | Attendance history |
| GET | `/api/attendance/my-summary` | Monthly summary |

### Attendance (Manager)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/attendance/all` | All employees attendance |
| GET | `/api/attendance/employee/:id` | Specific employee |
| GET | `/api/attendance/summary` | Team summary |
| GET | `/api/attendance/today-status` | Today's team status |
| GET | `/api/attendance/export` | Export CSV |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/employee` | Employee dashboard stats |
| GET | `/api/dashboard/manager` | Manager dashboard stats |

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (employee/manager),
  employeeId: String (unique),
  department: String,
  createdAt: Date
}
```

### Attendance Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  date: Date,
  checkInTime: Date,
  checkOutTime: Date,
  status: String (present/absent/late/half-day),
  totalHours: Number,
  createdAt: Date
}
```

## 📸 Screenshots

### Login Page
<img width="1920" height="1080" alt="Screenshot (454)" src="https://github.com/user-attachments/assets/199ba51d-6096-4a95-8120-dbde8de3bfdb" />


### Employee Dashboard
<img width="1920" height="1080" alt="Screenshot (461)" src="https://github.com/user-attachments/assets/14690fe4-41d2-45b0-bb73-4c3019ed902b" />

### Mark Attendance
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/7c702b43-e4fb-4ad1-8e18-dd1296de3603" />

### Attendance History (Calendar View)
<img width="1920" height="1080" alt="Screenshot (462)" src="https://github.com/user-attachments/assets/6a980463-384d-4ace-855b-4215f3ea53e0" />

### Manager Dashboard
<img width="1920" height="1080" alt="Screenshot (455)" src="https://github.com/user-attachments/assets/76bbec05-ffb8-4a64-b04b-471dfa0c4231" />

### Team Calendar View
<img width="1920" height="1080" alt="Screenshot (457)" src="https://github.com/user-attachments/assets/853efd47-9b75-4eec-be4d-0ed28c4ea0c7" />

### All Employees Attendance
<img width="1920" height="1080" alt="Screenshot (456)" src="https://github.com/user-attachments/assets/a27d0276-60b4-4793-8da1-929b07c7316e" />

### Export Reports
<img width="1920" height="1080" alt="Screenshot (458)" src="https://github.com/user-attachments/assets/bea1830d-6d3a-4340-b514-9d7f2a2f5b6a" />
<img width="1920" height="1080" alt="Screenshot (459)" src="https://github.com/user-attachments/assets/84167589-7166-4094-a7a7-51e7d23b8d88" />

## 📋 Features Implementation

### Attendance Rules
- ✅ Check-in before 9:00 AM = **Present**
- ✅ Check-in after 9:00 AM = **Late**
- ✅ Working < 4 hours = **Half-Day**
- ✅ No check-in = **Absent**

### Color Coding
- 🟢 **Green** - Present
- 🔴 **Red** - Absent
- 🟡 **Yellow** - Late
- 🟠 **Orange** - Half-Day

## 🧪 Testing

### Test Database Connection
```bash
cd backend
npm run test-db
```

### Test Login
```bash
cd backend
npm run test-login
```

### Fix Passwords (if needed)
```bash
cd backend
npm run fix-passwords
```

## 🚢 Deployment

### Deploy to Render

#### Backend Deployment
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set root directory to `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
7. Deploy and run `npm run seed` in Shell

#### Frontend Deployment
1. Create a new Static Site on Render
2. Root directory: `frontend`
3. Build command: `npm install && npm run build`
4. Publish directory: `dist`
5. Add environment variable:
   - `VITE_API_URL=https://your-backend-url.onrender.com/api`

## 🛠️ Available Scripts

### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed database with sample data
npm run test-db    # Test database connection
npm run test-login # Test login functionality
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongosh`
- Check `MONGODB_URI` in `.env`
- For Atlas, whitelist your IP address

### Login Issues
- Run `npm run fix-passwords` to reset all passwords
- Clear browser localStorage
- Check backend console for errors

### CORS Issues
- Verify backend CORS is enabled
- Check frontend API URL configuration

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

### Joshitha Chennamsetty
### Vignan's LARA Institute of Technology and Science
### Contact No: 6305286457

## 🙏 Acknowledgments

- Built as part of Tap Academy assessment
- React and Redux Toolkit documentation
- MongoDB and Express.js communities

---

**Note:** This application is for educational purposes and demonstration of full-stack development skills. 

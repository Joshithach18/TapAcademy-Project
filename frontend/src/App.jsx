import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeDashboard from './pages/employee/Dashboard';
import MarkAttendance from './pages/employee/MarkAttendance';
import AttendanceHistory from './pages/employee/AttendanceHistory';
import Profile from './pages/employee/Profile';
import ManagerDashboard from './pages/manager/Dashboard';
import AllAttendance from './pages/manager/AllAttendance';
import TeamCalendar from './pages/manager/TeamCalendar';
import Reports from './pages/manager/Reports';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        
        <Route
          path="/"
          element={
            <PrivateRoute>
              {user?.role === 'employee' ? <EmployeeDashboard /> : <ManagerDashboard />}
            </PrivateRoute>
          }
        />

        <Route
          path="/mark-attendance"
          element={
            <PrivateRoute role="employee">
              <MarkAttendance />
            </PrivateRoute>
          }
        />
        <Route
          path="/attendance-history"
          element={
            <PrivateRoute role="employee">
              <AttendanceHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute role="employee">
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/all-attendance"
          element={
            <PrivateRoute role="manager">
              <AllAttendance />
            </PrivateRoute>
          }
        />
        <Route
          path="/team-calendar"
          element={
            <PrivateRoute role="manager">
              <TeamCalendar />
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute role="manager">
              <Reports />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
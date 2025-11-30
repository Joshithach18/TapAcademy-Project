import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1>Attendance System</h1>
        <div className="navbar-links">
          <Link to="/">Dashboard</Link>
          {user.role === 'employee' && (
            <>
              <Link to="/mark-attendance">Mark Attendance</Link>
              <Link to="/attendance-history">History</Link>
              <Link to="/profile">Profile</Link>
            </>
          )}
          {user.role === 'manager' && (
            <>
              <Link to="/all-attendance">All Attendance</Link>
              <Link to="/team-calendar">Team Calendar</Link>
              <Link to="/reports">Reports</Link>
            </>
          )}
          <span>{user.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
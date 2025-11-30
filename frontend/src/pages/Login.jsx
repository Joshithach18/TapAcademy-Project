import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/slices/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="auth-container">
      <div style={{maxWidth: '1200px', width: '100%', display: 'flex', gap: '40px', alignItems: 'center', padding: '0 20px'}}>
        <div style={{flex: 1, color: 'white'}}>
          <h1 style={{fontSize: '48px', fontWeight: '700', marginBottom: '24px', lineHeight: '1.2'}}>
            Employee Attendance System
          </h1>
          <p style={{fontSize: '20px', marginBottom: '32px', lineHeight: '1.6', opacity: '0.95'}}>
            Streamline your workforce management with our comprehensive attendance tracking solution
          </p>
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <div style={{display: 'flex', alignItems: 'start', gap: '12px'}}>
              <div style={{width: '24px', height: '24px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px'}}>
                <span style={{fontSize: '14px'}}>✓</span>
              </div>
              <div>
                <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '4px'}}>Real-time Attendance Tracking</h3>
                <p style={{fontSize: '15px', opacity: '0.9'}}>Monitor employee check-ins and check-outs instantly with automated status updates</p>
              </div>
            </div>
            <div style={{display: 'flex', alignItems: 'start', gap: '12px'}}>
              <div style={{width: '24px', height: '24px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px'}}>
                <span style={{fontSize: '14px'}}>✓</span>
              </div>
              <div>
                <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '4px'}}>Comprehensive Reports</h3>
                <p style={{fontSize: '15px', opacity: '0.9'}}>Generate detailed attendance reports and export data for payroll processing</p>
              </div>
            </div>
            <div style={{display: 'flex', alignItems: 'start', gap: '12px'}}>
              <div style={{width: '24px', height: '24px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px'}}>
                <span style={{fontSize: '14px'}}>✓</span>
              </div>
              <div>
                <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '4px'}}>Team Management Dashboard</h3>
                <p style={{fontSize: '15px', opacity: '0.9'}}>Get insights into team attendance patterns with visual analytics and trends</p>
              </div>
            </div>
            <div style={{display: 'flex', alignItems: 'start', gap: '12px'}}>
              <div style={{width: '24px', height: '24px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px'}}>
                <span style={{fontSize: '14px'}}>✓</span>
              </div>
              <div>
                <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '4px'}}>Role-based Access Control</h3>
                <p style={{fontSize: '15px', opacity: '0.9'}}>Secure access with separate portals for employees and managers</p>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-card" style={{flex: '0 0 400px', margin: 0}}>
          <h2>Login</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>
          <div className="auth-switch">
            Don't have an account? <Link to="/register">Register</Link>
          </div>
          <div style={{marginTop: '20px', padding: '12px', background: '#e3f2fd', borderRadius: '4px', fontSize: '13px'}}>
            <strong>Test Credentials:</strong><br/>
            Manager: manager@company.com / password123<br/>
            Employee: alice@company.com / password123
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
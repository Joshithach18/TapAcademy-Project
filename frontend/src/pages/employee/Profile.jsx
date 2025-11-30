import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../../components/Layout';
import api from '../../utils/api';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const { data } = await api.get('/attendance/my-summary');
      setSummary(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (loading) return <Layout><div>Loading...</div></Layout>;

  return (
    <Layout>
      <h1 style={{marginBottom: '24px'}}>My Profile</h1>

      <div className="card">
        <h2>Personal Information</h2>
        <div className="profile-info">
          <div className="info-item">
            <label>Name</label>
            <p>{user.name}</p>
          </div>
          <div className="info-item">
            <label>Email</label>
            <p>{user.email}</p>
          </div>
          <div className="info-item">
            <label>Employee ID</label>
            <p>{user.employeeId}</p>
          </div>
          <div className="info-item">
            <label>Department</label>
            <p>{user.department}</p>
          </div>
          <div className="info-item">
            <label>Role</label>
            <p style={{textTransform: 'capitalize'}}>{user.role}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Monthly Summary</h2>
        <div className="dashboard-grid">
          <div className="stat-card">
            <h3>Present Days</h3>
            <div className="stat-value">{summary.present}</div>
          </div>
          <div className="stat-card">
            <h3>Absent Days</h3>
            <div className="stat-value">{summary.absent}</div>
          </div>
          <div className="stat-card">
            <h3>Late Days</h3>
            <div className="stat-value">{summary.late}</div>
          </div>
          <div className="stat-card">
            <h3>Half Days</h3>
            <div className="stat-value">{summary.halfDay}</div>
          </div>
          <div className="stat-card">
            <h3>Total Hours</h3>
            <div className="stat-value">{summary.totalHours.toFixed(1)}h</div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
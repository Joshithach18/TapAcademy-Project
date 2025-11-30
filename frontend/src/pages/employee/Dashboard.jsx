import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../utils/api';

const EmployeeDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/dashboard/employee');
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      await api.post('/attendance/checkin');
      alert('Checked in successfully!');
      fetchStats();
    } catch (error) {
      alert(error.response?.data?.message || 'Error checking in');
    }
  };

  const handleCheckOut = async () => {
    try {
      await api.post('/attendance/checkout');
      alert('Checked out successfully!');
      fetchStats();
    } catch (error) {
      alert(error.response?.data?.message || 'Error checking out');
    }
  };

  if (loading) return <Layout><div>Loading...</div></Layout>;

  return (
    <Layout>
      <h1 style={{marginBottom: '24px'}}>Employee Dashboard</h1>
      
      <div className="dashboard-grid">
        <div className="stat-card">
          <h3>Today's Status</h3>
          <div className="stat-value" style={{fontSize: '18px'}}>
            {stats.todayStatus === 'checked-in' ? 'Checked In' : 'Not Checked In'}
          </div>
          {stats.todayAttendance && (
            <div style={{marginTop: '12px', fontSize: '14px', color: '#666'}}>
              Check In: {new Date(stats.todayAttendance.checkInTime).toLocaleTimeString()}
              {stats.todayAttendance.checkOutTime && (
                <><br/>Check Out: {new Date(stats.todayAttendance.checkOutTime).toLocaleTimeString()}</>
              )}
            </div>
          )}
        </div>

        <div className="stat-card">
          <h3>Present Days</h3>
          <div className="stat-value">{stats.monthlyPresent}</div>
        </div>

        <div className="stat-card">
          <h3>Absent Days</h3>
          <div className="stat-value">{stats.monthlyAbsent}</div>
        </div>

        <div className="stat-card">
          <h3>Late Days</h3>
          <div className="stat-value">{stats.monthlyLate}</div>
        </div>

        <div className="stat-card">
          <h3>Total Hours</h3>
          <div className="stat-value">{stats.monthlyHours.toFixed(1)}h</div>
        </div>
      </div>

      <div style={{marginBottom: '30px', display: 'flex', gap: '12px'}}>
        <button 
          className="btn btn-success" 
          onClick={handleCheckIn}
          disabled={stats.todayStatus === 'checked-in'}
          style={{width: 'auto', padding: '12px 24px'}}
        >
          Check In
        </button>
        <button 
          className="btn btn-danger" 
          onClick={handleCheckOut}
          disabled={stats.todayStatus !== 'checked-in' || stats.todayAttendance?.checkOutTime}
          style={{width: 'auto', padding: '12px 24px'}}
        >
          Check Out
        </button>
      </div>

      <div className="card">
        <h2>Recent Attendance (Last 7 Days)</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
                <th>Hours</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentAttendance.map((record) => (
                <tr key={record._id}>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>{record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}</td>
                  <td>{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}</td>
                  <td>
                    <span className={`badge badge-${record.status === 'present' ? 'present' : record.status === 'absent' ? 'absent' : record.status === 'late' ? 'late' : 'half'}`}>
                      {record.status}
                    </span>
                  </td>
                  <td>{record.totalHours ? record.totalHours.toFixed(2) : '0'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeDashboard;
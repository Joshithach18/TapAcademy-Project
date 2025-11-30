import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';

const MarkAttendance = () => {
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const { data } = await api.get('/attendance/today');
      setTodayAttendance(data);
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
      fetchTodayAttendance();
    } catch (error) {
      alert(error.response?.data?.message || 'Error checking in');
    }
  };

  const handleCheckOut = async () => {
    try {
      await api.post('/attendance/checkout');
      alert('Checked out successfully!');
      fetchTodayAttendance();
    } catch (error) {
      alert(error.response?.data?.message || 'Error checking out');
    }
  };

  if (loading) return <Layout><div>Loading...</div></Layout>;

  return (
    <Layout>
      <h1 style={{marginBottom: '24px'}}>Mark Attendance</h1>

      <div className="card" style={{maxWidth: '600px', margin: '0 auto'}}>
        <h2>Today's Attendance</h2>
        
        {!todayAttendance ? (
          <div>
            <p style={{marginBottom: '20px', color: '#666'}}>
              You haven't checked in today yet.
            </p>
            <button className="btn btn-success" onClick={handleCheckIn}>
              Check In Now
            </button>
          </div>
        ) : (
          <div>
            <div className="info-item" style={{marginBottom: '16px'}}>
              <label>Status</label>
              <p>
                <span className={`badge badge-${todayAttendance.status === 'present' ? 'present' : todayAttendance.status === 'late' ? 'late' : 'half'}`}>
                  {todayAttendance.status}
                </span>
              </p>
            </div>

            <div className="info-item" style={{marginBottom: '16px'}}>
              <label>Check In Time</label>
              <p>{new Date(todayAttendance.checkInTime).toLocaleTimeString()}</p>
            </div>

            {todayAttendance.checkOutTime ? (
              <>
                <div className="info-item" style={{marginBottom: '16px'}}>
                  <label>Check Out Time</label>
                  <p>{new Date(todayAttendance.checkOutTime).toLocaleTimeString()}</p>
                </div>
                <div className="info-item" style={{marginBottom: '16px'}}>
                  <label>Total Hours</label>
                  <p>{todayAttendance.totalHours.toFixed(2)} hours</p>
                </div>
                <p style={{color: '#27ae60', fontWeight: '500'}}>
                  ✓ You have successfully checked out for today
                </p>
              </>
            ) : (
              <button className="btn btn-danger" onClick={handleCheckOut}>
                Check Out Now
              </button>
            )}
          </div>
        )}
      </div>

      <div className="card" style={{maxWidth: '600px', margin: '30px auto 0', background: '#e3f2fd'}}>
        <h3 style={{marginBottom: '12px'}}>Guidelines</h3>
        <ul style={{paddingLeft: '20px', color: '#666', lineHeight: '1.8'}}>
          <li>Check in time is before 9:00 AM for on-time attendance</li>
          <li>After 9:00 AM check-in is marked as Late</li>
          <li>Working less than 4 hours is marked as Half-Day</li>
          <li>Don't forget to check out at the end of your shift</li>
        </ul>
      </div>
    </Layout>
  );
};

export default MarkAttendance;
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';

const TeamCalendar = () => {
  const [todayStatus, setTodayStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayStatus();
  }, []);

  const fetchTodayStatus = async () => {
    try {
      const { data } = await api.get('/attendance/today-status');
      setTodayStatus(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (loading) return <Layout><div>Loading...</div></Layout>;

  return (
    <Layout>
      <h1 style={{marginBottom: '24px'}}>Team Calendar View</h1>

      <div className="card">
        <h2>Today's Status - {new Date().toLocaleDateString()}</h2>
        
        <div style={{marginBottom: '30px'}}>
          <h3 style={{marginBottom: '12px', color: '#27ae60'}}>Present Employees ({todayStatus.present.length})</h3>
          {todayStatus.present.length === 0 ? (
            <p style={{color: '#666'}}>No employees present yet</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Check In</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {todayStatus.present.map((record) => (
                    <tr key={record._id}>
                      <td>{record.userId.employeeId}</td>
                      <td>{record.userId.name}</td>
                      <td>{record.userId.department}</td>
                      <td>{new Date(record.checkInTime).toLocaleTimeString()}</td>
                      <td>
                        <span className={`badge badge-${record.status === 'present' ? 'present' : 'late'}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={{marginBottom: '30px'}}>
          <h3 style={{marginBottom: '12px', color: '#f39c12'}}>Late Arrivals ({todayStatus.late.length})</h3>
          {todayStatus.late.length === 0 ? (
            <p style={{color: '#666'}}>No late arrivals today</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Check In</th>
                  </tr>
                </thead>
                <tbody>
                  {todayStatus.late.map((record) => (
                    <tr key={record._id}>
                      <td>{record.userId.employeeId}</td>
                      <td>{record.userId.name}</td>
                      <td>{record.userId.department}</td>
                      <td>{new Date(record.checkInTime).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
          <h3 style={{marginBottom: '12px', color: '#e74c3c'}}>Absent Employees ({todayStatus.absent.length})</h3>
          {todayStatus.absent.length === 0 ? (
            <p style={{color: '#666'}}>All employees are present!</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Department</th>
                  </tr>
                </thead>
                <tbody>
                  {todayStatus.absent.map((emp) => (
                    <tr key={emp._id}>
                      <td>{emp.employeeId}</td>
                      <td>{emp.name}</td>
                      <td>{emp.department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TeamCalendar;
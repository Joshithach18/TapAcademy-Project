import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';

const ManagerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/dashboard/manager');
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (loading) return <Layout><div>Loading...</div></Layout>;

  return (
    <Layout>
      <h1 style={{marginBottom: '24px'}}>Manager Dashboard</h1>

      <div className="dashboard-grid">
        <div className="stat-card">
          <h3>Total Employees</h3>
          <div className="stat-value">{stats.totalEmployees}</div>
        </div>
        <div className="stat-card">
          <h3>Present Today</h3>
          <div className="stat-value">{stats.todayPresent}</div>
        </div>
        <div className="stat-card">
          <h3>Absent Today</h3>
          <div className="stat-value">{stats.todayAbsent}</div>
        </div>
        <div className="stat-card">
          <h3>Late Today</h3>
          <div className="stat-value">{stats.todayLate}</div>
        </div>
      </div>

      <div className="chart">
        <h2>Weekly Attendance Trend</h2>
        <div className="bar-chart">
          {stats.weeklyTrend.map((day) => (
            <div key={day.date} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div 
                className="bar" 
                style={{
                  height: `${(day.present / stats.totalEmployees) * 100}%`,
                  minHeight: '30px'
                }}
              >
                {day.present}
              </div>
              <div className="bar-label">{day.date}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>Absent Employees Today</h2>
        {stats.absentEmployeesToday.length === 0 ? (
          <p style={{color: '#666'}}>All employees are present today!</p>
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
                {stats.absentEmployeesToday.map((emp) => (
                  <tr key={emp.employeeId}>
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
    </Layout>
  );
};

export default ManagerDashboard;
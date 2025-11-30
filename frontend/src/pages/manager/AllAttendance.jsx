import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';

const AllAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    employeeId: '',
    date: '',
    status: ''
  });

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.employeeId) params.append('employeeId', filters.employeeId);
      if (filters.date) params.append('date', filters.date);
      if (filters.status) params.append('status', filters.status);

      const { data } = await api.get(`/attendance/all?${params.toString()}`);
      setAttendance(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = () => {
    fetchAttendance();
  };

  const handleReset = () => {
    setFilters({
      employeeId: '',
      date: '',
      status: ''
    });
    setTimeout(() => {
      fetchAttendance();
    }, 0);
  };

  if (loading) return <Layout><div>Loading...</div></Layout>;

  return (
    <Layout>
      <h1 style={{marginBottom: '24px'}}>All Employees Attendance</h1>

      <div className="card">
        <h2>Filters</h2>
        <div className="filters">
          <input
            type="text"
            name="employeeId"
            placeholder="Employee ID"
            value={filters.employeeId}
            onChange={handleFilterChange}
          />
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
            <option value="half-day">Half Day</option>
          </select>
          <button className="btn btn-small" onClick={handleSearch}>
            Search
          </button>
          <button className="btn btn-small btn-secondary" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      <div className="card">
        <h2>Attendance Records</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
                <th>Hours</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>
                    No attendance records found
                  </td>
                </tr>
              ) : (
                attendance.map((record) => (
                  <tr key={record._id}>
                    <td>{record.userId.employeeId}</td>
                    <td>{record.userId.name}</td>
                    <td>{record.userId.department}</td>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default AllAttendance;
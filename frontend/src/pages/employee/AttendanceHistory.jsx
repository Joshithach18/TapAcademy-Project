import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';

const AttendanceHistory = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState('table');

  useEffect(() => {
    fetchAttendance();
  }, [month, year]);

  const fetchAttendance = async () => {
    try {
      const { data } = await api.get(`/attendance/my-history?month=${month}&year=${year}`);
      setAttendance(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const renderCalendar = () => {
    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const attendanceMap = {};
    attendance.forEach(record => {
      const day = new Date(record.date).getDate();
      attendanceMap[day] = record.status;
    });

    const calendar = [];
    
    days.forEach(day => {
      calendar.push(
        <div key={`header-${day}`} className="calendar-day calendar-header">
          {day}
        </div>
      );
    });

    for (let i = 0; i < firstDay; i++) {
      calendar.push(<div key={`empty-${i}`} className="calendar-day calendar-empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const status = attendanceMap[day];
      const className = status 
        ? `calendar-day calendar-${status}` 
        : 'calendar-day';
      
      calendar.push(
        <div key={day} className={className} title={status || 'No record'}>
          {day}
        </div>
      );
    }

    return calendar;
  };

  if (loading) return <Layout><div>Loading...</div></Layout>;

  return (
    <Layout>
      <h1 style={{marginBottom: '24px'}}>My Attendance History</h1>

      <div className="card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px'}}>
          <div style={{display: 'flex', gap: '12px'}}>
            <select 
              value={month} 
              onChange={(e) => setMonth(Number(e.target.value))}
              style={{padding: '8px', border: '1px solid #ddd', borderRadius: '4px'}}
            >
              {Array.from({length: 12}, (_, i) => (
                <option key={i} value={i + 1}>
                  {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
            <select 
              value={year} 
              onChange={(e) => setYear(Number(e.target.value))}
              style={{padding: '8px', border: '1px solid #ddd', borderRadius: '4px'}}
            >
              {Array.from({length: 5}, (_, i) => (
                <option key={i} value={new Date().getFullYear() - i}>
                  {new Date().getFullYear() - i}
                </option>
              ))}
            </select>
          </div>
          <div style={{display: 'flex', gap: '8px'}}>
            <button 
              className={`btn btn-small ${viewMode === 'table' ? '' : 'btn-secondary'}`}
              onClick={() => setViewMode('table')}
            >
              Table View
            </button>
            <button 
              className={`btn btn-small ${viewMode === 'calendar' ? '' : 'btn-secondary'}`}
              onClick={() => setViewMode('calendar')}
            >
              Calendar View
            </button>
          </div>
        </div>

        {viewMode === 'table' ? (
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
                {attendance.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>
                      No attendance records found
                    </td>
                  </tr>
                ) : (
                  attendance.map((record) => (
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="calendar-grid">
            {renderCalendar()}
          </div>
        )}
      </div>

      <div className="card" style={{display: 'flex', gap: '20px', justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <div style={{width: '20px', height: '20px', background: '#d4edda', borderRadius: '4px'}}></div>
          <span>Present</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <div style={{width: '20px', height: '20px', background: '#f8d7da', borderRadius: '4px'}}></div>
          <span>Absent</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <div style={{width: '20px', height: '20px', background: '#fff3cd', borderRadius: '4px'}}></div>
          <span>Late</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <div style={{width: '20px', height: '20px', background: '#fde2d0', borderRadius: '4px'}}></div>
          <span>Half Day</span>
        </div>
      </div>
    </Layout>
  );
};

export default AttendanceHistory;
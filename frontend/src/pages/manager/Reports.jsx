import { useState } from 'react';
import Layout from '../../components/Layout';

const Reports = () => {
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const handleChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
  };

  const handleExport = async () => {
    const { startDate, endDate } = dateRange;
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/attendance/export?startDate=${startDate}&endDate=${endDate}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance-report-${startDate}-to-${endDate}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      alert('Report exported successfully!');
    } catch (error) {
      alert('Failed to export report. Please try again.');
      console.error(error);
    }
  };

  return (
    <Layout>
      <h1 style={{marginBottom: '24px'}}>Attendance Reports</h1>

      <div className="card" style={{maxWidth: '600px'}}>
        <h2>Export Attendance Data</h2>
        <p style={{color: '#666', marginBottom: '20px'}}>
          Select a date range to export attendance records as CSV
        </p>

        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={dateRange.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>End Date</label>
          <input
            type="date"
            name="endDate"
            value={dateRange.endDate}
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-success" onClick={handleExport}>
          Export to CSV
        </button>
      </div>

      <div className="card" style={{maxWidth: '600px', background: '#e3f2fd'}}>
        <h3 style={{marginBottom: '12px'}}>Report Information</h3>
        <ul style={{paddingLeft: '20px', color: '#666', lineHeight: '1.8'}}>
          <li>CSV file includes all employee attendance records</li>
          <li>Columns: Employee ID, Name, Department, Date, Check In, Check Out, Status, Total Hours</li>
          <li>Records are sorted by date (newest first)</li>
          <li>File can be opened in Excel or Google Sheets</li>
        </ul>
      </div>
    </Layout>
  );
};

export default Reports;
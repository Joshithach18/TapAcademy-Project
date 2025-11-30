import express from 'express';
import Attendance from '../models/Attendance.js';
import User from '../models/User.js';
import { protect, managerOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/employee', protect, async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const todayAttendance = await Attendance.findOne({
      userId: req.user._id,
      date: today
    });

    const monthAttendance = await Attendance.find({
      userId: req.user._id,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const last7Days = await Attendance.find({
      userId: req.user._id,
      date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    }).sort({ date: -1 });

    const stats = {
      todayStatus: todayAttendance ? 'checked-in' : 'not-checked-in',
      todayAttendance,
      monthlyPresent: monthAttendance.filter(a => a.status === 'present').length,
      monthlyAbsent: monthAttendance.filter(a => a.status === 'absent').length,
      monthlyLate: monthAttendance.filter(a => a.status === 'late').length,
      monthlyHours: monthAttendance.reduce((sum, a) => sum + (a.totalHours || 0), 0),
      recentAttendance: last7Days
    };

    res.json(stats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/manager', protect, managerOnly, async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);

    const totalEmployees = await User.countDocuments({ role: 'employee' });

    const todayAttendance = await Attendance.find({ date: today })
      .populate('userId', 'name employeeId department');

    const weeklyAttendance = await Attendance.find({
      date: { $gte: startOfWeek, $lte: today }
    });

    const weeklyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayAttendance = weeklyAttendance.filter(a => 
        new Date(a.date).toDateString() === date.toDateString()
      );
      
      weeklyTrend.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        present: dayAttendance.filter(a => a.status === 'present' || a.status === 'late').length
      });
    }

    const allEmployees = await User.find({ role: 'employee' });
    const presentEmployeeIds = todayAttendance.map(a => a.userId._id.toString());
    const absentEmployees = allEmployees.filter(
      emp => !presentEmployeeIds.includes(emp._id.toString())
    );

    const stats = {
      totalEmployees,
      todayPresent: todayAttendance.filter(a => a.status === 'present' || a.status === 'late').length,
      todayAbsent: absentEmployees.length,
      todayLate: todayAttendance.filter(a => a.status === 'late').length,
      weeklyTrend,
      absentEmployeesToday: absentEmployees.map(emp => ({
        name: emp.name,
        employeeId: emp.employeeId,
        department: emp.department
      }))
    };

    res.json(stats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
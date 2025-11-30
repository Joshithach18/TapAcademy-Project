import express from 'express';
import Attendance from '../models/Attendance.js';
import User from '../models/User.js';
import { protect, managerOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/checkin', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      userId: req.user._id,
      date: today
    });

    const now = new Date();
    const checkInTime = now;
    const nineAM = new Date(today);
    nineAM.setHours(9, 0, 0, 0);

    let status = 'present';
    if (checkInTime > nineAM) {
      status = 'late';
    }

    if (attendance) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    attendance = await Attendance.create({
      userId: req.user._id,
      date: today,
      checkInTime,
      status
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/checkout', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      userId: req.user._id,
      date: today
    });

    if (!attendance) {
      return res.status(400).json({ message: 'No check-in found for today' });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({ message: 'Already checked out' });
    }

    const checkOutTime = new Date();
    const totalHours = (checkOutTime - attendance.checkInTime) / (1000 * 60 * 60);

    attendance.checkOutTime = checkOutTime;
    attendance.totalHours = parseFloat(totalHours.toFixed(2));

    if (totalHours < 4) {
      attendance.status = 'half-day';
    }

    await attendance.save();
    res.json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/today', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      userId: req.user._id,
      date: today
    });

    res.json(attendance || null);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/my-history', protect, async (req, res) => {
  try {
    const { month, year } = req.query;
    let query = { userId: req.user._id };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendance = await Attendance.find(query).sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/my-summary', protect, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const attendance = await Attendance.find({
      userId: req.user._id,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const summary = {
      present: attendance.filter(a => a.status === 'present').length,
      absent: attendance.filter(a => a.status === 'absent').length,
      late: attendance.filter(a => a.status === 'late').length,
      halfDay: attendance.filter(a => a.status === 'half-day').length,
      totalHours: attendance.reduce((sum, a) => sum + (a.totalHours || 0), 0)
    };

    res.json(summary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/all', protect, managerOnly, async (req, res) => {
  try {
    const { employeeId, date, status, startDate, endDate } = req.query;
    let query = {};

    if (employeeId) {
      const user = await User.findOne({ employeeId });
      if (user) query.userId = user._id;
    }

    if (date) {
      const searchDate = new Date(date);
      searchDate.setHours(0, 0, 0, 0);
      query.date = searchDate;
    }

    if (status) {
      query.status = status;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name email employeeId department')
      .sort({ date: -1 })
      .limit(100);

    res.json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/employee/:id', protect, managerOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const attendance = await Attendance.find({ userId: req.params.id })
      .sort({ date: -1 })
      .limit(50);

    res.json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/summary', protect, managerOnly, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const attendance = await Attendance.find({
      date: { $gte: startOfMonth, $lte: endOfMonth }
    }).populate('userId', 'department');

    const summary = {
      totalPresent: attendance.filter(a => a.status === 'present').length,
      totalAbsent: attendance.filter(a => a.status === 'absent').length,
      totalLate: attendance.filter(a => a.status === 'late').length,
      totalHalfDay: attendance.filter(a => a.status === 'half-day').length
    };

    res.json(summary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/today-status', protect, managerOnly, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.find({ date: today })
      .populate('userId', 'name employeeId department');

    const allEmployees = await User.find({ role: 'employee' });
    const presentEmployeeIds = attendance.map(a => a.userId._id.toString());
    
    const absentEmployees = allEmployees.filter(
      emp => !presentEmployeeIds.includes(emp._id.toString())
    );

    res.json({
      present: attendance.filter(a => a.status === 'present' || a.status === 'late'),
      absent: absentEmployees,
      late: attendance.filter(a => a.status === 'late')
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/export', protect, managerOnly, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name email employeeId department')
      .sort({ date: -1 });

    let csv = 'Employee ID,Name,Department,Date,Check In,Check Out,Status,Total Hours\n';
    
    attendance.forEach(record => {
      const date = new Date(record.date).toLocaleDateString();
      const checkIn = record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-';
      const checkOut = record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-';
      
      csv += `${record.userId.employeeId},${record.userId.name},${record.userId.department},${date},${checkIn},${checkOut},${record.status},${record.totalHours}\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('attendance-report.csv');
    res.send(csv);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
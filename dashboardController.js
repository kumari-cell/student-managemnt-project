const Attendance = require('../models/Attendance');
const Fee = require('../models/Fee');

exports.getStudentDashboard = async (req, res) => {
    try {
        const studentId = req.params.id;
        const attendance = await Attendance.findOne({ studentId });
        const fees = await Fee.findOne({ studentId });
        
        res.status(200).json({ attendance, fees });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
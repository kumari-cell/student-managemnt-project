const express = require('express');
const router = express.Router();
const { addStudent } = require('../controllers/studentController');
const { getStudentDashboard } = require('../controllers/dashboardController');

router.post('/add', addStudent); // Admin adds student
router.get('/dashboard/:id', getStudentDashboard); // Student views data
// POST /add-student logic lo idhi add cheyandi
const newExam = new ExamResult({
    studentId: studentId,
    subjects: [
        { name: 'Maths', marks: 0 },
        { name: 'Science', marks: 0 },
        { name: 'English', marks: 0 },
        { name: 'Computer', marks: 0 },
        { name: 'Physics', marks: 0 }
    ],
    totalMarks: 0,
    percentage: 0,
    result: 'N/A'
});
await newExam.save();
module.exports = router;
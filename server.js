require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// --- 1. Middlewares ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// --- 2. MongoDB Connection ---
// Note: process.env.MONGO_URI lekapothe local db ki connect avtundi
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/studentDB';
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected... ✅"))
  .catch(err => console.error("Connection error: ❌", err));

// --- 3. Schemas & Models ---

// Student Profile
const studentSchema = new mongoose.Schema({
    studentId: { type: String, unique: true, required: true },
    name: String,
    email: String,
    phone: String,
    gender: String,
    course: String,
    address: String,
    password: { type: String, default: 'student123' } // Login kosam default password
});
const Student = mongoose.model('Student', studentSchema);

// Fee Details Schema
const feeSchema = new mongoose.Schema({
    studentId: String,
    totalFee: { type: Number, default: 50000 },
    paidAmount: { type: Number, default: 0 },
    balance: { type: Number, default: 50000 },
    status: { type: String, default: 'Pending' }
});
const Fee = mongoose.model('Fee', feeSchema);

// Attendance Schema
const attendanceSchema = new mongoose.Schema({
    studentId: String,
    totalClasses: { type: Number, default: 100 },
    attended: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 }
});
const Attendance = mongoose.model('Attendance', attendanceSchema);

// Exam Result Schema
const examSchema = new mongoose.Schema({
    studentId: String,
    subjects: [
        { name: String, marks: Number }
    ],
    totalMarks: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    result: { type: String, default: 'N/A' }
});
const ExamResult = mongoose.model('ExamResult', examSchema);

// Admin Schema (Login kosam)
const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const Admin = mongoose.model('Admin', adminSchema);

// --- 4. Routes ---

// Default Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login2.html'));
});

// Admin Login API
app.post('/api/login-admin', async (req, res) => {
    const { username, password } = req.body;
    // Simple static check leda database check
    if (username === "admin" && password === "1234") {
        res.json({ success: true, message: "Admin Login Success" });
    } else {
        res.status(401).json({ success: false, message: "Invalid Admin Credentials" });
    }
});

// Student Add chesetappudu anni tables records create avvali
app.post('/add-student', async (req, res) => {
    try {
        const { studentId, name, email, phone, gender, course, address } = req.body;

        // 1. Student Profile Save
        const newStudent = new Student({ studentId, name, email, phone, gender, course, address });
        await newStudent.save();

        // 2. Fee Record Create
        const newFee = new Fee({ studentId, balance: 50000 });
        await newFee.save();

        // 3. Attendance Record Create
        const newAttendance = new Attendance({ studentId, totalClasses: 100, attended: 0 });
        await newAttendance.save();

        // 4. Exam Record Create (Empty initial marks)
        const newExam = new ExamResult({
            studentId,
            subjects: [
                { name: 'Maths', marks: 0 },
                { name: 'Science', marks: 0 },
                { name: 'English', marks: 0 }
            ]
        });
        await newExam.save();

        console.log(`All records created for ${studentId} ✅`);
        res.redirect('/viewstudent.html'); 

    } catch (err) {
        console.error("Save Error: ❌", err);
        res.status(500).send("Error: Student ID duplicate leda database issue.");
    }
});

// Student Login API
app.post('/api/login-student', async (req, res) => {
    try {
        const { studentId, password } = req.body;
        const student = await Student.findOne({ studentId: studentId });

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found!" });
        }

        if (password === student.password) {
            res.json({ success: true, student });
        } else {
            res.status(401).json({ success: false, message: "Incorrect Password!" });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Student Details fetch (Dashboard & Profile)
app.get('/api/student-details/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const student = await Student.findOne({ studentId: id });
        const fees = await Fee.findOne({ studentId: id });
        const attendance = await Attendance.findOne({ studentId: id });

        if (!student) return res.status(404).json({ error: "Student not found" });
        res.json({ student, fees, attendance });
    } catch (err) {
        res.status(500).json({ error: "Data fetch error" });
    }
});

// Get All Students (Admin View)
app.get('/api/get-students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).send("Error fetching students");
    }
});

// Get Exam Results
app.get('/api/exam-results/:id', async (req, res) => {
    try {
        const result = await ExamResult.findOne({ studentId: req.params.id });
        if (!result) return res.status(404).json({ error: "Results not found" });
        res.json(result);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// DELETE Student & Related Records
app.delete('/api/delete-student/:id', async (req, res) => {
    try {
        const mongoId = req.params.id;
        const student = await Student.findById(mongoId);
        
        if (!student) return res.status(404).json({ success: false, message: "Student not found" });

        const sid = student.studentId;

        // Delete from all collections
        await Student.findByIdAndDelete(mongoId);
        await Attendance.findOneAndDelete({ studentId: sid });
        await Fee.findOneAndDelete({ studentId: sid });
        await ExamResult.findOneAndDelete({ studentId: sid });

        res.json({ success: true, message: "All records deleted successfully!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- 5. Server Start ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT} 🚀`);
});
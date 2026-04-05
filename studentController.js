const Student = require('../models/Student');
const User = require('../models/User');

exports.addStudent = async (req, res) => {
    try {
        const { name, email, password, rollNo, gender, course } = req.body;
        
        // 1. User create cheyali (Login kosam)
        const newUser = new User({ name, email, password, role: 'student' });
        await newUser.save();

        // 2. Student details save cheyali
        const newStudent = new Student({
            userId: newUser._id,
            rollNo, gender, course
        });
        await newStudent.save();

        res.status(201).json({ message: "Student added successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
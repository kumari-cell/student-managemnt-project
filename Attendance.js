const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subjects: [{
    subjectName: { type: String, required: true }, // e.g., Maths, Science [cite: 542]
    totalClasses: { type: Number, default: 50 }, [cite: 542]
    attended: { type: Number, required: true } [cite: 542]
  }],
  overallPercentage: { type: Number } // logic: (attended/total)*100 
});

module.exports = mongoose.model('Attendance', attendanceSchema);
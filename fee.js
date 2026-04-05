const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }, [cite: 505]
  feeItems: [{
    feeType: { type: String, required: true }, // e.g., Tuition, Exam [cite: 545]
    totalAmount: { type: Number, required: true }, [cite: 505, 545]
    paidAmount: { type: Number, default: 0 } [cite: 505, 545]
  }],
  totalDue: { type: Number } // logic: totalAmount - paidAmount 
}, { timestamps: true });

module.exports = mongoose.model('Fee', feeSchema);
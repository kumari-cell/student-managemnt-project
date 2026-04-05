const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, [cite: 503]
  rollNo: { type: String, required: true, unique: true }, [cite: 503]
  gender: { type: String, required: true }, [cite: 503]
  course: { type: String, required: true }, [cite: 503]
  phone: { type: String }, [cite: 411]
  address: { type: String } [cite: 411]
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
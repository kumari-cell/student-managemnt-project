const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, [cite: 472]
  email: { type: String, required: true, unique: true }, [cite: 472]
  password: { type: String, required: true }, [cite: 472]
  role: { type: String, enum: ['admin', 'student'], default: 'student' } [cite: 408, 532]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
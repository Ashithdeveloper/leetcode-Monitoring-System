import mongoose from 'mongoose';

const HistorySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  totalSolved: { type: Number, default: 0 },
  easy: { type: Number, default: 0 },
  medium: { type: Number, default: 0 },
  hard: { type: Number, default: 0 }
});

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  year: { type: String, required: true },
  dept: { type: String, required: true },
  leetcode: {
    username: { type: String, required: true }
  },
  history: [HistorySchema]
}, { timestamps: true });

export default mongoose.model('Student', StudentSchema);

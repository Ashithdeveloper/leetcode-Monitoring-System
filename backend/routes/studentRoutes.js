import express from 'express';
import { addStudent, getAllStudents, getStudentById, deleteStudent } from '../controllers/studentController.js';
import { protect, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all students with latest stats (Public for now, can be protected)
router.get('/', getAllStudents);

// Get a single student by ID with 7-day history (Public for now)
router.get('/:id', getStudentById);

// Add a student (Protected - Admin/SuperAdmin only)
router.post('/add', protect, requireAdmin, addStudent);

// Delete a student (Protected - Admin/SuperAdmin only)
router.delete('/:id', protect, requireAdmin, deleteStudent);

export default router;

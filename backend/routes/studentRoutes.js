import express from 'express';
const router = express.Router();
import { addStudent, getAllStudents, getStudentById } from '../controllers/studentController.js';

// Add a student
router.post('/add', addStudent);

// Get all students with latest stats
router.get('/', getAllStudents);

// Get a single student by ID with 7-day history
router.get('/:id', getStudentById);

export default router;

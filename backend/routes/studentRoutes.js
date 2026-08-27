import express from 'express';
import { 
  addStudent, 
  getAllStudents, 
  getDeletedStudents, 
  getStudentById, 
  deleteStudent, 
  restoreStudent, 
  permanentDeleteStudent 
} from '../controllers/studentController.js';
import { protect, requireAdmin, isSuperAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all active students with latest stats
router.get('/', getAllStudents);

// Get all soft-deleted students (SuperAdmin only)
router.get('/deleted', protect, isSuperAdmin, getDeletedStudents);

// Get a single student by ID with 7-day history
router.get('/:id', getStudentById);

// Add a student (Admin/SuperAdmin only)
router.post('/add', protect, requireAdmin, addStudent);

// Soft delete a student (Admin/SuperAdmin)
router.delete('/:id', protect, requireAdmin, deleteStudent);

// Restore a soft-deleted student (SuperAdmin only)
router.put('/:id/restore', protect, isSuperAdmin, restoreStudent);

// Permanently delete a student (SuperAdmin only)
router.delete('/:id/permanent', protect, isSuperAdmin, permanentDeleteStudent);

export default router;

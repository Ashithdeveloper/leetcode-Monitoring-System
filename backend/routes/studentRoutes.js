import { addStudent, getAllStudents, getStudentById, deleteStudent } from '../controllers/studentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get all students with latest stats (Public for now, can be protected)
router.get('/', getAllStudents);

// Get a single student by ID with 7-day history (Public for now)
router.get('/:id', getStudentById);

// Add a student (Protected)
router.post('/add', protect, addStudent);

// Delete a student (Protected)
router.delete('/:id', protect, deleteStudent);

export default router;

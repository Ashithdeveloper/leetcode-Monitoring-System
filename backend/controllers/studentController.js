import Student from '../models/Student.js';
import { extractUsername, fetchLeetCodeStats } from '../utils/leetcode.js';

/**
 * Add a new student
 * Extract username from leetcode link, fetch initial stats, and save
 */
export const addStudent = async (req, res) => {
  const { name, rollNo, year, dept, leetcodeLink } = req.body;

  if (!name || !rollNo || !year || !dept || !leetcodeLink) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  console.log(`Adding student: ${name}, Roll: ${rollNo}, Dept: ${dept}`);

  try {
    // Check if student already exists
    const existingStudent = await Student.findOne({ rollNo });
    if (existingStudent) {
      if (existingStudent.isDeleted) {
        return res.status(400).json({ 
          error: 'A student with this roll number is in the Trash. A Super Admin can recover or permanently delete it.' 
        });
      }
      return res.status(400).json({ error: 'Student with this roll number already exists' });
    }

    // Extract username
    let username = extractUsername(leetcodeLink);
    if (!username) {
      return res.status(400).json({ error: 'Invalid LeetCode link' });
    }

    // Handle standard generic profile URLs like /u/username or /username
    if (username === 'u') { // Edge case: trailing slash on root
      username = extractUsername(leetcodeLink.slice(0, -2)); 
    }

    // Fetch initial stats
    const stats = await fetchLeetCodeStats(username);

    // Create and save student
    const student = new Student({
      name,
      rollNo,
      year,
      dept,
      leetcode: { username },
      isDeleted: false,
      history: [stats]
    });

    await student.save();
    res.status(201).json({ message: 'Student added successfully', student });
  } catch (error) {
    if (error.message === 'User not found') {
      res.status(404).json({ error: 'LeetCode user not found' });
    } else {
      res.status(500).json({ error: 'Server error adding student' });
    }
  }
};

/**
 * Get all active students
 * Returns basic info and the latest stats (last item in history)
 */
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({ isDeleted: { $ne: true } }).lean();
    
    // Process to return only latest stats
    const processedStudents = students.map(student => {
      const latestStats = student.history && student.history.length > 0
        ? student.history[student.history.length - 1]
        : null;
        
      return {
        _id: student._id,
        name: student.name,
        rollNo: student.rollNo,
        year: student.year,
        dept: student.dept,
        leetcodeUsername: student.leetcode?.username,
        latestStats: latestStats,
        isDeleted: false
      };
    });

    res.status(200).json(processedStudents);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Server error retrieving students' });
  }
};

/**
 * Get all soft-deleted students (Trash / Archive)
 * Super Admin only
 */
export const getDeletedStudents = async (req, res) => {
  try {
    const students = await Student.find({ isDeleted: true }).lean();

    const processedStudents = students.map(student => {
      const latestStats = student.history && student.history.length > 0
        ? student.history[student.history.length - 1]
        : null;

      return {
        _id: student._id,
        name: student.name,
        rollNo: student.rollNo,
        year: student.year,
        dept: student.dept,
        leetcodeUsername: student.leetcode?.username,
        latestStats: latestStats,
        isDeleted: true,
        deletedAt: student.deletedAt,
        deletedBy: student.deletedBy
      };
    });

    res.status(200).json(processedStudents);
  } catch (error) {
    console.error('Error fetching deleted students:', error);
    res.status(500).json({ error: 'Server error retrieving deleted students' });
  }
};

/**
 * Get student by ID
 * Returns full 7-day history
 */
export const getStudentById = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student.findById(id).lean();
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error(`Error fetching student ${id}:`, error);
    res.status(500).json({ error: 'Server error retrieving student' });
  }
};

/**
 * Soft delete a student
 * Preserves history and flags isDeleted: true
 */
export const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    if (student.isDeleted) {
      return res.status(400).json({ error: 'Student is already in trash' });
    }

    student.isDeleted = true;
    student.deletedAt = new Date();
    student.deletedBy = req.user?.username || 'admin';

    await student.save();

    res.status(200).json({ message: 'Student moved to trash successfully', student });
  } catch (error) {
    console.error(`Error deleting student ${id}:`, error);
    res.status(500).json({ error: 'Server error deleting student' });
  }
};

/**
 * Restore a soft-deleted student
 * Super Admin only
 */
export const restoreStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    if (!student.isDeleted) {
      return res.status(400).json({ error: 'Student is already active' });
    }

    student.isDeleted = false;
    student.deletedAt = null;
    student.deletedBy = null;

    await student.save();

    res.status(200).json({ message: 'Student restored successfully', student });
  } catch (error) {
    console.error(`Error restoring student ${id}:`, error);
    res.status(500).json({ error: 'Server error restoring student' });
  }
};

/**
 * Permanently delete a student
 * Super Admin only
 */
export const permanentDeleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json({ message: 'Student permanently deleted' });
  } catch (error) {
    console.error(`Error permanently deleting student ${id}:`, error);
    res.status(500).json({ error: 'Server error deleting student permanently' });
  }
};

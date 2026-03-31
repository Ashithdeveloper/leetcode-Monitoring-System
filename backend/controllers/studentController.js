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
      return res.status(400).json({ error: 'Student with this roll number already exists' });
    }

    // Extract username
    let username = extractUsername(leetcodeLink);
    if (!username) {
      return res.status(400).json({ error: 'Invalid LeetCode link' });
    }

    // Handle standard generic profile URLs like /u/username or /username
    // Leetcode link might be just username or full URL
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
 * Get all students
 * Returns basic info and the latest stats (last item in history)
 */
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().lean();
    
    // Process to return only latest stats
    const processedStudents = students.map(student => {
      // The last element in the history array represents the latest stats (or null if empty)
      const latestStats = student.history && student.history.length > 0
        ? student.history[student.history.length - 1]
        : null;
        
      return {
        _id: student._id,
        name: student.name,
        rollNo: student.rollNo,
        year: student.year,
        dept: student.dept,
        leetcodeUsername: student.leetcode.username,
        latestStats: latestStats
      };
    });

    res.status(200).json(processedStudents);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Server error retrieving students' });
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
 * Delete a student
 */
export const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error(`Error deleting student ${id}:`, error);
    res.status(500).json({ error: 'Server error deleting student' });
  }
};

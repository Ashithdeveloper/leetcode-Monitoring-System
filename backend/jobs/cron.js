import cron from 'node-cron';
import Student from '../models/Student.js';
import { fetchLeetCodeStats } from '../utils/leetcode.js';

// Helper to delay execution (rate limit prevention)
const delay = ms => new Promise(res => setTimeout(res, ms));

const startDailyCron = () => {
  // Run everyday at 00:00 (Midnight)
  cron.schedule('0 0 * * *', async () => {
    console.log('--- Starting Daily LeetCode Stats Update ---');
    try {
      const students = await Student.find();
      console.log(`Found ${students.length} students to update.`);

      for (let student of students) {
        try {
          const stats = await fetchLeetCodeStats(student.leetcode.username);
          
          // Add to history
          student.history.push(stats);

          // Maintain max history length of 7 days
          if (student.history.length > 7) {
            // Remove the oldest elements from the array
            // Since we push to the end, shift removes from the beginning
            student.history.shift();
          }

          await student.save();
          console.log(`Updated stats for ${student.name} (${student.leetcode.username})`);
          
          // Add 2 seconds delay to avoid aggressive rate limiting from LeetCode
          await delay(2000); 
        } catch (error) {
          console.error(`Failed to update ${student.name} (${student.leetcode.username}):`, error.message);
        }
      }
      
      console.log('--- Daily LeetCode Stats Update Complete ---');
    } catch (err) {
      console.error('Cron Job failed to retrieve students:', err);
    }
  });

  console.log('Daily cron job scheduled (Runs every midnight)');
};

export default startDailyCron;

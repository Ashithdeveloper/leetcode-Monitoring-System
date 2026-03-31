import axios from 'axios';

/**
 * Extract username from LeetCode profile link
 * Example: https://leetcode.com/u/user123/ -> user123
 */
export const extractUsername = (link) => {
  if (!link) return null;
  // Remove trailing slashes
  link = link.replace(/\/+$/, '');
  const urlParts = link.split('/');
  return urlParts[urlParts.length - 1];
};

/**
 * Fetch LeetCode stats for a given username
 * Uses the public GraphQL API endpoint
 */
export const fetchLeetCodeStats = async (username) => {
  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post('https://leetcode.com/graphql', {
      query,
      variables: { username }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com'
      }
    });

    const data = response.data;
    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    const matchedUser = data.data.matchedUser;
    if (!matchedUser) {
      throw new Error('User not found');
    }

    const stats = matchedUser.submitStatsGlobal.acSubmissionNum;
    
    // Stats array contains objects for All, Easy, Medium, Hard
    let totalSolved = 0, easy = 0, medium = 0, hard = 0;

    stats.forEach(stat => {
      const difficulty = stat.difficulty.toLowerCase();
      if (difficulty === 'all') totalSolved = stat.count;
      if (difficulty === 'easy') easy = stat.count;
      if (difficulty === 'medium') medium = stat.count;
      if (difficulty === 'hard') hard = stat.count;
    });

    return {
      totalSolved,
      easy,
      medium,
      hard,
      date: new Date()
    };
  } catch (error) {
    console.error(`Error fetching stats for ${username}:`, error.message);
    throw error;
  }
};

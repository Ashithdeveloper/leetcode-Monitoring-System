import axios from 'axios';

const test = async () => {
  try {
    console.log('Testing Add Student...');
    const addRes = await axios.post('http://localhost:5000/api/students/add', {
      name: 'Test Student',
      rollNo: '12345',
      year: '2023-2027',
      leetcodeLink: 'https://leetcode.com/u/aniket2002/' 
    });
    console.log('Add Student Success:', addRes.data.student.name);

    console.log('\nTesting Get All Students...');
    const allRes = await axios.get('http://localhost:5000/api/students');
    console.log(`Get All Success: Found ${allRes.data.length} students. Latest stats:`, allRes.data[0].latestStats);

    const studentId = allRes.data[0]._id;
    console.log(`\nTesting Get Single Student (${studentId})...`);
    const singleRes = await axios.get(`http://localhost:5000/api/students/${studentId}`);
    console.log('Get Single Success: History length:', singleRes.data.history.length);
    
  } catch (err) {
    if (err.response) {
      console.error('Error Response:', err.response.data);
    } else {
      console.error('Error:', err.message);
    }
  }
};

test();

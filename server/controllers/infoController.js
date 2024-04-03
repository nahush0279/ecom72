const pool = require('./db');

const getUser = async (req, res) => {
  const { email } = req.query; 
  if (!email) {
    return res.status(400).json({ message: 'Enter email to get user info' });
  }

  try {
    const [result] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (result.length < 1) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(result[0]); 
    }
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const getAllUsers = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM users');
      res.json(result); 

  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports = {
  getUser, getAllUsers
};

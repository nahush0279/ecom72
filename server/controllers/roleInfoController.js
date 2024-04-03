const pool = require('./db');

const getRole = async (req, res) => {
  const { name } = req.query; 
  
  try {
    const [result] = await pool.query('SELECT * FROM roles WHERE name = ?', [name]);

      res.json(result[0]); 
    
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getAllRoles = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM roles ');

      res.json(result); 

  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports = {
  getRole, getAllRoles
};

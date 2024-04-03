const pool = require('../db');





const getData = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM cart ;');
      res.json(result); 

  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports = {
  getData
};

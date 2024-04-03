const pool = require('./db');

const getProduct = async (req, res) => {
  const { id } = req.body; 
  if (!id) {
    return res.status(400).json({ message: 'Enter id to get products info' });
  }

  try {
    const [result] = await pool.query('SELECT productId, product_name, price FROM products WHERE productId = ?', [id]);
    if (result.length < 1) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json(result[0]); 
    }
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const getAllProducts = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM products');
      res.json(result); 

  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports = {
  getProduct, getAllProducts
};

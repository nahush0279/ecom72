const pool = require('../db')

const removeProduct = async (req, res) => {
    const {id} = req.body
    if (!id) return res.status(400).json({ 'message': 'Select id to remove' })
    try {
      
             await  pool.query('UPDATE products SET quantity = quantity + 1 WHERE productId =?', [id])
            
             res.status(200).json({"success": `Product Removed`})
            
    
    } catch (error) {
        console.error('Error executing login query:', error);
        res.status(500).json({ error: 'Internal Server Error.' });
    }
};

module.exports = removeProduct
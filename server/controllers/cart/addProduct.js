const pool = require('../db')

const addProduct = async (req, res) => {
    const {id} = req.body
    if (!id) return res.status(400).json({ 'message': 'Select id to add' })
    try {
      
             await  pool.query('UPDATE products SET quantity = quantity - 1 WHERE productId =?', [id])
            
             res.status(200).json({"success": `Product Added`})
            
    
    } catch (error) {
        console.error('Error executing login query:', error);
        res.status(500).json({ error: 'Internal Server Error.' });
    }
};

module.exports = addProduct
const pool = require('./db')

const productDelete    = async (req, res) => {
    const {id} = req.body
    if (!id) return res.status(400).json({ 'message': 'Select product to delete' })
    try {  
           await pool.query('DELETE FROM products WHERE productId=?', [id])
           res.status(200).json({"success": `PRoduct deleted`})
    } catch (error) {
        console.error('Error executing login query:', error);
        res.status(500).json({ error: 'Internal Server Error.' });
    }
};


module.exports = productDelete                 
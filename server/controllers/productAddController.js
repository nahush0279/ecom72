const pool = require('./db');

const productAdd = async (req, res) => {
    const { name, rating, description, category, seller, price, quantity, image_data } = req.body;
    if (!image_data || !name || !description || !category || !seller || !price || !quantity) {
        return res.status(400).json({ 'message': 'Enter values to continue' });
    }

    const prrice = parseInt(price);

    try {
        await pool.query('INSERT INTO products (product_name, description, category, seller,rating, price, quantity, image_data) VALUES (?, ?,?, ?, ?, ?, ?, ?)', [name, description, category, seller, rating, prrice, quantity, image_data]);
        res.json({ "success": "Product Added Successfully" });
    } catch (error) {
        console.log(error);
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = productAdd;

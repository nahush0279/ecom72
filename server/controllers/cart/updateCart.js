const pool = require('../db');


const updateCart = async (req, res) => {
    const { userId , product_ids } = req.body
    if (!userId  ) return res.status(400).json({ 'message': 'enter field and value to continue' })
   
    try {
        console.log(userId , product_ids)
        await pool.query('UPDATE cart SET product_ids= ? where userId = ?',[product_ids, userId])
        res.json({"success" : "Cart Updated Successfully"})
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
module.exports = {
    updateCart
};
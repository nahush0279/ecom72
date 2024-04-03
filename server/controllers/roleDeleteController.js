const pool = require('./db')

const deleteRole = async (req, res) => {
    const {name} = req.body
    if (!name) return res.status(400).json({ 'message': 'Select role to delete' })
    try {  
           await pool.query('DELETE FROM roles WHERE name=?', [name])
           res.status(200).json({"success": `Role deleted`})
    } catch (error) {
        console.error('Error executing login query:', error);
        res.status(500).json({ error: 'Internal Server Error.' });
    }
};


module.exports = deleteRole
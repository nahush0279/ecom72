const pool = require('./db')

const deleteUser = async (req, res) => {
    const {id} = req.body
    if (!id) return res.status(400).json({ 'message': 'Select user to delete' })
    try {
      
             await  pool.query('DELETE FROM users WHERE userId=?', [id])
            
             res.status(200).json({"success": `User Deleted`})
            
    
    } catch (error) {
        console.error('Error executing login query:', error);
        res.status(500).json({ error: 'Internal Server Error.' });
    }
};

module.exports = deleteUser
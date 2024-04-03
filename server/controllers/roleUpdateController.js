const pool = require('./db');


const updateRole = async (req, res) => {
    const {newname, name, description } = req.body
    if (!newname || !name ||! description ) return res.status(400).json({ 'message': 'enter field and value to continue' })
   
    try {
        await pool.query('UPDATE roles SET name=? , description=? WHERE name=?',[newname, description, name])
        res.json({"success" : "Role Updated Successfully"})
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
module.exports = {
    updateRole
};
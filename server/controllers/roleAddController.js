const pool = require('./db')


const createNewRole = async (req, res) => {
    const { name, description } = req.body
    console.log(name, description )
    if (!description || !name) return res.status(400).json({ 'message': 'all fields are required' })
    const [result] = await pool.query('SELECT * FROM roles WHERE name = ?', [name]);
    const duplicate = result.length > 0
    if (duplicate) return res.json({ "message": "Role Already Exist" })
    try {
        await pool.query('INSERT INTO roles(name, description) values (?,?)', [name, description])
        res.status(201).json({ "message": `added role ${name}` })
        
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = createNewRole
const pool = require('./db');


const updateUser = async (req, res) => {
    const {id ,email, password,   name, gender, role} = req.body
    if (!email||!id||! name||!gender|| !role) return res.status(400).json({ 'message': 'enter field and value to continue' })

    if(password){
        try {
            await pool.query('UPDATE users SET email=? , password = ?,  name=? , gender=? ,  role =? WHERE userId=?',[email, password,  name, gender, role,  id])
            res.json({"success" : "User Information Successfully Updated"})
        } catch (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    else{
        try {
            await pool.query('UPDATE users SET email=? ,   name=? , gender=? ,  role =? WHERE userId=?',[email,  name, gender, role,  id])
            res.json({"success" : "User Information Successfully Updated"})
        } catch (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
 

};
module.exports = {
    updateUser
};
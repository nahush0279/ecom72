const pool = require('./db')
const axios = require('axios')

const saveToken = async (req, res) => {
    const { accessToken, userId } = req.body;
    if (!accessToken || !userId) {
        return res.status(400).json({ error: 'Enter all fields' });
    }

    try {
        const [tokenObj] = await pool.query('SELECT ACCESS_TOKEN FROM users WHERE userId=?', [userId]);
        const [tokens] = await pool.query('SELECT * FROM users WHERE userId=?', [userId]);
console.log(tokens)
        const token = tokenObj[0]?.ACCESS_TOKEN;
        if (token) {
            return res.json({ error: 'User is already logged in' });
        } else {
            await pool.query('UPDATE users SET ACCESS_TOKEN = ? WHERE userId=?', [accessToken, userId]);
            return res.json({ success: 'Token saved' });
        }
    } catch (error) {
        console.error('Error executing login query:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


const removeToken = async (req, res) => {
    const {userId} = req.body
    
    try {
        const resp =  await  pool.query('UPDATE users SET ACCESS_TOKEN = ?  WHERE userId=? ', [null, userId])
        res.status(200).json({success : 'removed token successfully'})
    } catch (error) {
        console.error('Error executing login query:', error);
        res.status(500).json({ error: 'Internal Server Error.' });
    }
};

module.exports = {saveToken, removeToken}
const pool = require('./db');


const productUpdate = async (req, res) => {
    const {id, name ,description, category, seller , price, quantity , image_data,rating  } = req.body
    if (!id || !name || !description || !category || !seller || !price || !quantity || !rating) return res.status(400).json({ 'message': 'enter  value to continue' })
   console.log(id, name ,description, category, seller , price, quantity )
   
   if(image_data){
   try {
        await pool.query('UPDATE products SET  product_name = ?, category=?, seller = ?, price =? , quantity = ?, image_data=?, rating=?  WHERE productId=?',[name, category, seller, price, quantity,image_data, rating, id ])
        res.json({"success" : "Product Updated Successfully"})
    } catch (error) {
        console.log(error)
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
else{
    try {
        await pool.query('UPDATE products SET  product_name = ?, category=?, seller = ?, price =? , quantity = ?  WHERE productId=?',[name, category, seller, price, quantity, id ])
        res.json({"success" : "Product Updated Successfully"})
    } catch (error) {
        console.log(error)
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
};
module.exports = productUpdate
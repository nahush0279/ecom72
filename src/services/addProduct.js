import axios from "axios";


const addProduct = async (name, description, category, seller, price, quantity, image_data, rating) => {
  console.log(name, description, category, seller, price, quantity)
  try {
    const response = await axios.post(process.env.REACT_APP_API_URL + 'products/add', {
      name,
      description,
      category,
      seller,
      price,
      quantity,
      image_data,
      rating
    })
    const data = response.data;
    console.log(data);
    return data



  } catch (error) {
    console.error('Error fetching data:', error);
    return error
  }
};

export default addProduct;

import axios from "axios";

const updateCart = async (userId, product_ids ) => {
  try {
    const response = await axios.post(process.env.REACT_APP_API_URL +'cart/update', {
    userId, product_ids
    });
    const data = response.data;
    return data
  } catch (error) {
    console.error('Error fetching data:', error);
    return error
  }
};

export default updateCart;

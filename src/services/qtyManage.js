import axios from "axios";

export const addQty = async (id) => {
  try {
    const response = await axios.post(process.env.REACT_APP_API_URL + 'products/qty/add', { id })
    const data = response.data;
    return data
  } catch (error) {
    console.error('Error fetching data:', error);
    return error
  }
};

export const removeQty = async (id) => {
  try {
    const response = await axios.post(process.env.REACT_APP_API_URL  +'products/qty/remove', { id })
    const data = response.data;
    return data
  } catch (error) {
    console.error('Error fetching data:', error);
    return error
  }
};


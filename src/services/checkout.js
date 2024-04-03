import axios from "axios";

const checkout = async (items) => {
  try {
    const response = await axios.post( process.env.REACT_APP_API_URL  +'checkout', {
      items
    })
    const data = response.data;
    console.log(data);
    return data
  } catch (error) {
    console.error('Error fetching data:', error);
    return error
  }
};

export default checkout;

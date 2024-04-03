import axios from "axios";




const addUser = async (name, email, password, gender) => {
  try {
    const response = await axios.post(process.env.REACT_APP_API_URL + 'register', { name, email, password, gender })
    const data = response.data;
    console.log(data);
    return data



  } catch (error) {
    console.error('Error fetching data:', error);
    return error
  }
};

export default addUser;

import axios from "axios";

const userAuth = async (email, password ) => {
  try {  
    const response = await axios.post(process.env.REACT_APP_API_URL +'auth', {  email, password  });
    const data = response.data;
    return data
  } catch (error) {
    console.error('Error fetching data:', error);
    return error
  }
};

export default userAuth;

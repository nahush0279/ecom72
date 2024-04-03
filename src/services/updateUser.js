import axios from "axios";

const updateUser = async (id, name, email, password, gender, role) => {
  try {
    const response = await axios.post(process.env.REACT_APP_API_URL + 'update', {
      id,
      name,
      email,
      password,
      gender,
      role
    })
    const data = response.data;
    console.log(data);
    return data
  } catch (error) {
    console.error('Error fetching data:', error);
    return error
  }
};

export default updateUser;

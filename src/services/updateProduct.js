import axios from "axios";

const updateProduct = async (id, name ,description, category, seller , price, quantity , image_data, rating ) => {
  console.log(rating)
  try {
    if(image_data){
    const response = await axios.post(process.env.REACT_APP_API_URL +'products/update', {
      id, 
      name,
      description,
      category,
      seller,
      price,
      quantity,
      image_data,
      rating
  
    });
    const data = response.data;
    console.log(data);
    return data
   }else{
      const response = await axios.post(process.env.REACT_APP_API_URL  + 'products/update', {
      id, 
      name,
      description,
      category,
      seller,
      price,
      quantity
    })
    const data = response.data;
    console.log(data);
    return data
    }
   
    
  } catch (error) {
    console.error('Error fetching data:', error);
    return error
  }
};

export default updateProduct;

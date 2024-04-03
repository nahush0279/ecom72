import { useFormik } from 'formik'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import React from 'react'
import updateProduct from '../../services/updateProduct'
import addProduct from '../../services/addProduct';
import * as yup from 'yup';
import { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';

function Form({ type, visible, setVisible, product }) {
  const isAdd = type == 'Add'
  const toast = useRef(null);
  const productSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    description: yup.string().required('Description is required'),
    price: yup
      .number()
      .typeError('Price must be a number')
      .positive('Price must be a positive number')
      .required('Price is required'),
    category: yup.string().required('Category is required'),
    seller: yup.string().required('Seller is required'),
    rating: yup
      .number()
      .typeError('Rating must be a number')
      .min(0, 'Rating must be at least 0')
      .max(5, 'Rating cannot be more than 5')
      .required('Rating is required'),
    quantity: yup
      .number()
      .typeError('Quantity must be a number')
      .integer('Quantity must be an integer')
      .min(0, 'Quantity must be at least 0')
      .required('Quantity is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: '',
      category: '',
      seller: '',
      rating: '',
      quantity: '',
      img_data: ''

    },
    validationSchema: productSchema,
    onSubmit: (values) => {
      handleSubmit(values)
    },
  });

  const handleSubmit = async (values) => {
    if (!isAdd) {
      const res = await updateProduct(product.productId, values.name, values.description, values.category,
        values.seller, values.price, values.quantity, values.img_data, values.rating
      )
      setVisible(false)
      if (res.success) {
        toast.current.show({ severity: 'success', detail: 'Product Updated Successfully' });
      }
      else {
        toast.current.show({ severity: 'error', detail: 'Something went wrong !' });
      }
    }

    else {
      const res = await addProduct(values.name, values.description, values.category,
        values.seller, values.price, values.quantity, values.img_data, values.rating
      )
      setVisible(false)
      if (res.success) {
        toast.current.show({ severity: 'success', detail: 'Product Added Successfully' });
      }
      else {
        toast.current.show({ severity: 'error', detail: 'Something went wrong !' });
      }
    }
  }

  const convertToBase64 = (e) => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleImage = async (event) => {
    const image = event.target.files[0];
    try {
      const imageBase64 = await convertToBase64(event);
      formik.setValues({ ...formik.values, img_data: imageBase64 })
    } catch (error) {
    }
  };

  const demoImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPsAAADJCAMAAADSHrQyAAAAe1BMVEXr6+sAAADx8fHu7u7z8/PKysosLCyfn5+GhobHx8d4eHhiYmLn5+dmZmbR0dHY2NhycnLh4eG/v7+vr6+Ojo5dXV2BgYFlZWXd3d20tLSVlZWFhYVtbW1QUFCmpqbCwsJISEg6OjpXV1cMDAwgICAnJyczMzMTExNKSkpHmETRAAAFWUlEQVR4nO2cC3eiSBBGsaoYFBHkIQIaSZyZZP//L9zqRhSSzI46ZyfafvfkBOkHcukHDTZ4HgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgHNgupKv3vE/h+Lt67creG74q3f9T2F/ci3ze5en56vdJ/Wdy9P16pPpnTf5zr0ILmTljPtOLu3j+cUVd//ihisrV9xn57kzH9M9mDtxm9epdEkfyp29xvaK88QKP5b7U39mi03iR3Kn7fGs/j31Hsp9NPI1yg/kTsXA/U0eyt2qHknh/iju04H6d1Pn5w/jzrOBe0hOu7PI2IvWJ/eKXXanZPtUjMOib716ZoyddefYBO5HgeyV1vwp7sa0jrpz9MNqLmScMq2DXUyHaxlX3fuhe/jOjYn6hI66y/I0epVfZXPTXYLB6Sw4yjON6oaT7pQNR3CT3UGe4iAZmrrozslkTG3lxdy4aAeqDrpz9POd+yQTjzm0H/2Tq4Pusn+vbko+PXT835PTvUrn3CX8qD7krXL2HDfq4j/lW9QfJcfc33Xxn/LqOTmu+9DFf8pTl80tdz5dqf0newevZeTpN9I9S+euYaU8U10vcRy7ZyW7s9Unk0JccpfZb3THNOKOu19dpG4ucZxxn71c6D7Jtq64n3d2G/HqivuVwP1+gTvc4Q73c9jcu/vb9e7BvbtfchEz5kf01Tv/p1BzpfprfOfT5xXy/GtI5P7VPTtH+Aq+eq8BAAAAAAAAAJzLWZdwN3Kd9/luXH3XhbP0jET5LcjTMrPTaZbju2vR87U7R9OPd2w+HA1Z/XIe8l9ElgtTxLQ27oN7DnaioF0/BPZx/Z2JQVoeJqEi5kGs+cCN8HgLMr8Nd7/U/aCFecQnzrN+nyv9o1keE2e5mSfMcV2nZuKNn7exH3mU5Nmhqmi22vhSlsfSuZtYq5vWuc9tGPveMQfpt8j6Jty3MtXdNO48bfx63k2OjLYkmzL3i6CsZ2HNnBWzbJV4XASz3UudSjCd1XO7BSqaWVtUHG1zfxqQcSeNzTWW8rBt8yqY5/kprNAtlfvbcGdvb8uda62alHQNP1oShbmwPPvEumJmyIsfUBVqWBFTXOqy3nUPPQszqVOrSdapxnIXG1CiqZVKV/swMUuq3m7EndtS1J3C7vEuG2zcy8TUB7Omx4fFS9uC4kJrddCqoJCk9rERPUbmLUa8EiLZ1SaqMbG8lqbtpiWWemhGYfJ0I+6elK2o+9J0x3oETLBx3wzcOV6GxbQgb55yuoikXIZhuDz85BbMA4+jfzQk3NrDUm7N56mUdlud+6YPS+wRvhV3z9tz7y72/3t3ip4ikaQgTp7LacUSpnJ6aRVRtk+9tQnR+qzum6R7NcomPpV7H9a538Y5zrhrT6aujZ08ujq294G7ZAGZVNowyDwUybt8NB7Qpi/zbha1utMhluudPXMad84PYTvzviN+uQn3he2vpi/C6VzLttn1/XzX3m3zX1C1EG3eBUlQFsVOLVdajGyrSFqJyGZGWciaxo5tIo0VE2tS6ca0K7BhmkOX+i35z1twp+6FY5EpmkSbcN2VZ9Qw7ypTimatYaq3YRHlNGvSKJot9MS90dZr33yThkvNpoep1T6g1Gx6JkxLjY2ZI001ZdbMVZdDw/RbwuwmxrQeDRZan4/PxhwG+nT4Z95jp+OxhanYUqY27eHBsP6TJjGl3GU7dAaHIPvsMJmOvgu7x9+sZF1pb+bN7/735SvgeB7kzfbytzy5AEs8q9z4ffkK7rGpAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMD/zL9TY0eo5T7NEgAAAABJRU5ErkJggg=='
  React.useEffect(() => {
    if (product) {
      formik.setValues({
        name: product.product_name,
        description: product.description,
        price: product.price,
        category: product.category,
        seller: product.seller,
        rating: product.rating,
        quantity: product.quantity,
        img_data: product.image_data
      });
    }
  }, [product]);
  return (
    <div>
      <Toast ref={toast} />
      <Dialog header={isAdd ? 'Add Product' : 'Update Product'} visible={visible} onHide={() => setVisible(false)} className='dialog'>
        <form className="container-fluid" style={{ maxWidth: '80vw' }} onSubmit={formik.handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-4">
                <label htmlFor="name" className="form-label">Name</label>
                <InputText
                  className="form-control"
                  id="name"
                  name="name"
                  type="name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                {formik.errors.name && formik.touched.name && (
                  <div className="text-danger">{formik.errors.name}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="form-label">Description</label>
                <InputTextarea
                  className="form-control"
                  style={{ height: '132px' }}
                  id="description"
                  name="description"
                  type="description"
                  onChange={formik.handleChange}
                  value={formik.values.description}
                />
                {formik.errors.description && formik.touched.description && (
                  <div className="text-danger">{formik.errors.description}</div>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-4">
                <label htmlFor="seller" className="form-label">Seller</label>
                <InputText
                  className="form-control"
                  id="seller"
                  name="seller"
                  type="seller"
                  onChange={formik.handleChange}
                  value={formik.values.seller}
                />
                {formik.errors.seller && formik.touched.seller && (
                  <div className="text-danger">{formik.errors.seller}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="quantity" className="form-label">Quantity</label>
                <InputText
                  className="form-control"
                  id="quantity"
                  name="quantity"
                  type="quantity"
                  onChange={formik.handleChange}
                  value={formik.values.quantity}
                />
                {formik.errors.quantity && formik.touched.quantity && (
                  <div className="text-danger">{formik.errors.quantity}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="category" className="form-label">Category</label>
                <InputText
                  className="form-control"
                  id="category"
                  name="category"
                  type="category"
                  onChange={formik.handleChange}
                  value={formik.values.category}
                />
                {formik.errors.category && formik.touched.category && (
                  <div className="text-danger">{formik.errors.category}</div>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-4">
                <label htmlFor="image" className="form-label">Image</label>
                <div className="d-flex align-items-center flex-column">
                  <img className="img-fluid" style={{ maxHeight: '200px', maxWidth: '240px', marginBottom: '20px' }} src={formik.values.img_data || demoImg} alt="Product" />
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImage(e)}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-4">
                <label htmlFor="price" className="form-label">Price</label>
                <InputText
                  className="form-control"
                  id="price"
                  name="price"
                  type="price"
                  onChange={formik.handleChange}
                  value={formik.values.price}
                />
                {formik.errors.price && formik.touched.price && (
                  <div className="text-danger">{formik.errors.price}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="rating" className="form-label">Rating</label>
                <InputText
                  className="form-control"
                  id="rating"
                  name="rating"
                  type="rating"
                  onChange={formik.handleChange}
                  value={formik.values.rating}
                />
                {formik.errors.rating && formik.touched.rating && (
                  <div className="text-danger">{formik.errors.rating}</div>
                )}
              </div>
            </div>
          </div>
          <hr />
          <div style={{ display: 'grid', justifyContent: 'end' }} className=" container text-center row align-self-end  mt-3">
            <div className='row'>
              <div className='col'>
                <Button
                
                  type="submit"
                  label={isAdd ? 'Add Product' : 'Save Changes'}
                  severity="success"
                  className="btn btn-primary"
                ></Button>
              </div>
              <div className='col-2'>
                <Button
                  type='button'
                  onClick={() => setVisible(false)}
                  label={'Cancel'}
                  severity="danger"
                  className="btn btn-secondary"
                ></Button>
              </div>
            </div>
          </div>

        </form>



      </Dialog>
    </div>
  )
}

export default Form
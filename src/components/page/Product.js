import React, { useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'primereact/button';
import { removeQty } from '../../services/qtyManage';
import updateCart from '../../services/updateCart';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchProducts } from '../../features/products/productsSlice';
import { fetchCartData } from '../../features/cart/cartSlice';
import { Tag } from 'primereact/tag';
import { Rating } from 'primereact/rating';
import { Card } from 'primereact/card';
import { Carousel } from 'primereact/carousel';
import { setCurrentProduct } from '../../features/currentProduct/currentProductSlice';

function Product() {
  const dispatch = useDispatch()
  const toast = useRef(null);
  const navigate = useNavigate()
  const products = useSelector((state) => state.products?.data);
  const productId = useSelector((state) => state.currentProduct?.currentProduct?.product.productId);
  const pObj = products.filter((product) => product.productId == productId)
  const product = pObj[0]
  const [manage, setManage] = useState(false)
  const user = useSelector((state) => state.user.users);
  const cart = useSelector((state) => state.cart.cartSlice);
  const userCart = cart.find((item) => item.userId == user?.userId);
  const idsAndQuantities = userCart?.product_ids?.split(',');

  const quantitiesMap = {};
  idsAndQuantities?.forEach((entry) => {
    const [productId, decimalPart] = entry.split('.').map((part) => part.trim());
    quantitiesMap[productId] = parseFloat(decimalPart);
  });

  if (!product) {
    navigate('/')
  }



  const getRandomProducts = (products) => {
    const randomProducts = [];
    const selectedIndices = new Set();

    while (randomProducts.length < 10 && selectedIndices.size < products.length) {
      const randomIndex = Math.floor(Math.random() * products.length);

      if (!selectedIndices.has(randomIndex)) {
        selectedIndices.add(randomIndex);
        randomProducts.push(products[randomIndex]);
      }
    }

    return randomProducts;
  };

  const sponseredProducts = getRandomProducts(products)



  const responsiveOptions = [
    {
      breakpoint: '1400px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '1199px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '767px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '575px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  const handleProduct = (product) => {
    dispatch(setCurrentProduct({ product }))
    navigate('/product');
  };

  const productTemplate = (product) => {
    return (
      <div className="border-1 surface-border border-round m-2 text-center py-5 px-3">
        <div className='product'>
          <img
            onClick={() => handleProduct(product)}
            className="w-100 shadow-2 border-round my-2"
            style={{
              cursor: 'pointer',
              maxHeight: '200px',
              maxWidth: '35%',
              height: 'auto',
            }}
            src={product.image_data}
            alt={product.product_name}
          />

          <div className="row gx-3">
            <div className="col-sm-7">
              <div className="text-xl font-bold text-900 mb-2">{product.product_name}</div>
              <Rating className='  mb-2' value={product.rating} readOnly cancel={false}></Rating>
              <div>
                <Tag value={getStock(product)} severity={getSeverity(product)}></Tag>
              </div>
            </div>
            <div className="col-sm-5 d-flex justify-content-between align-items-center">
              <span className="text-2xl font-semibold  mb-2">₹{product.price}</span>
              <Button
                onClick={() => onAdd(product.productId)}
                icon="pi pi-shopping-cart"
                className="btn btn-primary"
                style={{ fontSize: '0.75rem' }}
                disabled={product.inventoryStatus === 'OUTOFSTOCK'}
              ></Button>
            </div>
          </div>
        </div>
      </div>

    );
  };
  const onAdd = async () => {
    if (!user) {
      toast.current?.show({ severity: 'error', classNames: 'p-button-error', detail: 'You need to be logged in to shop', life: '2000' });
      return;
    }
    const updatedCarts = updateProductQuantity(product.productId, 1)
    const res = await updateCart(user.userId, objectToString(updatedCarts))
    await removeQty(product.productId)
    toast.current?.show({ severity: 'success', classNames: 'p-button-success', detail: 'Product Added', life: '2000' });
    setManage((manage) => !manage)
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchProducts());
        await dispatch(fetchCartData());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [manage, dispatch]);

  const onSignUp = async () => {
    if (!user) {
      toast.current?.show({ severity: 'error', classNames: 'p-button-error', detail: 'You need to be logged in to shop', life: '2000' });
      return;
    }
    await onAdd().then(navigate('/cart'))
  }

  function updateProductQuantity(productId, quantityChange) {

    const updatedObject = { ...quantitiesMap };

    if (productId in updatedObject) {
      updatedObject[productId] += quantityChange;

      if (updatedObject[productId] <= 0) {
        delete updatedObject[productId];
      }
    } else {
      updatedObject[productId] = quantityChange;
    }
    return updatedObject;
  }

  const getStock = (product) => {
    if (product.quantity == 0) {
      return 'OUT OF STOCK'
    }
    if (product.quantity > 30)
      return 'IN STOCK';

    else if (product.quantity <= 30)
      return 'LOW STOCK';

  }

  const getSeverity = (product) => {
    if (product.quantity == 0) {
      return 'danger'
    }
    if (product.quantity > 30)
      return 'success';

    else if (product.quantity <= 30)
      return 'warning';

  };

  function objectToString(inputObject) {
    return Object.entries(inputObject)
      .map(([productId, quantity]) => `${productId}.${quantity}`)
      .join(',');
  }

  return (
    <>
      {product &&

        <div
          className="row justify-content-between p-5"
          style={{width : '100%'}}
          >
          <div className="col-md-4 ">
            <Toast ref={toast} />
            <div className="m-6">
              <img
                className="img-fluid"
                style={{height : '15rem'}}
                src={product.image_data}
                alt={product.product_name}
              />
            </div>
          </div>
          <div className="col-md-8 ">
            <div className="w-100">
              <h2 className="font-bold mb-4">{product.product_name}</h2>
              <p className="mb-4">{product.description}</p>
              <p className="mb-4"><strong>Price: </strong>₹{product.price}</p>
              <p className="mb-4"><strong>Rating: </strong><Rating className='m-4' value={product.rating} readOnly cancel={false}></Rating></p>
              <p className="mb-4"><strong>Availability </strong>:  <Tag value={getStock(product)} severity={getSeverity(product)}></Tag></p>
              <p className="mb-4"><strong>Seller: </strong>{product.seller}</p>
              <p className="mb-4"><strong>Shipping</strong>: Free</p>
              <p className="mb-4"><strong>Items Left: </strong>  {product.quantity}</p>
              <Card
                style={{maxWidth : '825px'}}
                title="Fast Delivery"
                subTitle="In 2 Days"
                className="p-card-shadow p-card-rounded my-3"
              >
                <div className="p-d-flex p-ai-center p-jc-center">
                  <i className={`pi pi-clock p-mr-1`} style={{ fontSize: '1.5rem', color: '#2196F3' }}></i>
                  <p className="m-0">Get your order delivered quickly in just 2 days!</p>
                </div>
              </Card>
              <div className="flex flex-row items-center space-x-4">
                <Button
                  disabled={product.quantity < 1}
                  className="btn btn-success"
                  onClick={() => onSignUp()}
                  style={{ marginRight: '20px' }}
                  label='Buy Now'
                />
                <Button
                  disabled={product.quantity < 1}
                  onClick={() => onAdd()}
                  className="btn btn-primary"
                  label='Add to Cart'
                />
              </div>
            </div>
          </div>

          <Card title='You may also like' className='mt-5'>
            <Carousel value={sponseredProducts} responsiveOptions={responsiveOptions} numScroll={3} numVisible={3} itemTemplate={productTemplate} />
          </Card>
        </div>

      }

    </>
  )
}

export default Product
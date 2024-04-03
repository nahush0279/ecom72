import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCartData } from '../../features/cart/cartSlice';
import { useRef } from 'react';
import { fetchProducts } from '../../features/products/productsSlice';
import { Button } from 'primereact/button';
import updateCart from '../../services/updateCart';
import { Toast } from 'primereact/toast';
import { addQty, removeQty } from '../../services/qtyManage';
import { setCurrentProduct } from '../../features/currentProduct/currentProductSlice';
import { useNavigate } from 'react-router-dom';
import checkout from '../../services/checkout';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Card } from 'primereact/card';
import { Carousel } from 'primereact/carousel';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';


function Cart() {
  const dispatch = useDispatch();
  const [isScreenLarge, setIsScreenLarge] = useState(window.innerWidth > 425)
  const toast = useRef(null);
  const navigate = useNavigate()
  const isAuth = useSelector((state) => state.auth.isAuthenticated)
  const [dataFetched, setDataFetched] = useState(false);
  const [removeState, setRemoveState] = useState(false);
  const user = useSelector((state) => state.user?.users);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsScreenLarge(window.innerWidth > 425);
    };

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  function objectToString(inputObject) {
    return Object.entries(inputObject)
      .map(([productId, quantity]) => `${productId}.${quantity}`)
      .join(',');
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

  const onRemove = async (id) => {

    const updatedids = updateProductQuantity(id, -1)
    const res = await addQty(id)
    updateCart(user.userId, objectToString(updatedids))
    setRemoveState(!removeState)

  }

  const onAdd = async (id) => {

    const updatedids = updateProductQuantity(id, 1)
    const res = await removeQty(id)
    updateCart(user.userId, objectToString(updatedids))
    setRemoveState(!removeState)

  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchProducts());
        await dispatch(fetchCartData());
        setDataFetched(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dispatch, removeState]);

  const products = useSelector((state) => state.products?.data);
  const sponseredProducts = getRandomProducts(products)
  const carts = useSelector((state) => state.cart.cartSlice);
  const [selectedId, setSelectedId] = useState([]);
  const cm = useRef(null)
  const userCart = carts.find((item) => item.userId == user?.userId);
  const idsAndQuantities = userCart?.product_ids?.split(',');
  const quantitiesMap = {};
  idsAndQuantities?.forEach((entry) => {
    const [productId, decimalPart] = entry.split('.').map((part) => part.trim());
    quantitiesMap[productId] = parseFloat(decimalPart);
  });
  const ids = Object.keys(quantitiesMap)
  const cartProducts = products?.filter((product) => ids?.some((id) => String(product?.productId) === id));
  const productsWithQuantities = cartProducts.map((product) => ({
    ...product,
    cartQuantity: quantitiesMap[String(product.productId)] || 0,
  }));

  if (cartProducts.length === 0) {
    const product = products?.find((product) => ids?.includes(String(product?.productId)));
    if (product) {
      cartProducts.push(product);
    }
  }



  const handleCheckout = async () => {
    const items = productsWithQuantities.map(product => ({
      key: product.productId,
      id: product.productId,
      quantity: product.cartQuantity,
      price: Math.floor(product.price),
      name: product.product_name,
    }));
        
    const handleProduct = (product) => {
      dispatch(setCurrentProduct({ product }))
      navigate('/product');
  };


    const res = await checkout(items)
    if (res.url) {
      window.location.href = res.url
    }
  }


  const onRightClick = (event, id) => {
    if (cm.current) {
      setSelectedId(id);
      cm.current.show(event);
    }
  };

  const total = productsWithQuantities.reduce((total, product) => {
    if (ids.includes(String(product.productId)) && product.cartQuantity) {

      return total + product.price * product.cartQuantity;
    } else {
      return Number(total.toFixed(2));;
    }
  }, 0);
  if (!dataFetched) {
    return <div>Loading...</div>;
  }

  const handleProduct = (product) => {
    dispatch(setCurrentProduct({ product }))
    navigate('/product');
  };


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

  function calculateProductTotal(productId) {
    const product = productsWithQuantities.find(item => item.productId == productId);
    const total = Math.floor(product.price * product.cartQuantity);
    return total;

  }
  if (!isAuth) {
    return <div
      style={{ marginTop: '80px', display: 'flex', justifyContent: 'center', height: '500px' }}
    >Login to manage your cart</div>;
  }


 

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

  const productTemplate = (product) => {
    return (
      <div className="surface-border border-round m-2 text-center py-5 px-3">
        <div>
          <img
            onClick={() => handleProduct(product)}
            className="w-100 shadow-2 border-round"
            style={{
              cursor: 'pointer',
              maxHeight: '200px',
              maxWidth: '50%',
              height: 'auto',
            }}
            src={product.image_data}
            alt={product.product_name}
          />

          <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
              <div className="text-xl font-bold text-900">{product.product_name}</div>
              <Rating value={product.rating} readOnly cancel={false}></Rating>
              <div>
                <Tag value={getStock(product)} severity={getSeverity(product)}></Tag>
              </div>
            </div>
            <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
              <span className="text-2xl font-semibold">₹{product.price}</span>
              <Button
                onClick={() => onAdd(product.productId)}
                icon="pi pi-shopping-cart"
                className="p-button-rounded"
                style={{ fontSize: '2.5rem' }}
                disabled={product.inventoryStatus === 'OUTOFSTOCK'}
              ></Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const quantityBody = (product) => {
    return (
      <div className='row quantity'>
        <div className='col'>
          <Button
            className='quantityBtn rounded-circle'
            rounded
            disabled={product.quantity < 1}
            onClick={() => onAdd(product.productId)}
            style={{ height: '30px', width: '30px', marginRight: '10px' }}
            icon='pi pi-plus'
          />
          {product.cartQuantity}
          <Button
            className='quantityBtn rounded-circle'
            onClick={() => onRemove(product.productId)}
            style={{ height: '30px', width: '30px', marginLeft: '10px' }}
            icon='pi pi-minus'
          />
        </div>
      </div>
    );
  };
  
  const productBody = (product) => {
    return (
      <div className='row'>
        <div className='col-md-4'>
          <img onClick={()=> handleProduct(product)} className="img-fluid" src={product.image_data} alt={product.product_name} />
        </div>
        <div className='col-md-8'>
          <p className='h5'>{product.product_name}</p>
          <div>
            <p className='font-semibold'><span className='pi pi-tag px-2'></span>{product.category}</p>
          </div>
        </div>
      </div>
    );
  };
  
  const priceBody = (product) => {
    return (
      <p className='font-semibold'>₹ {product.price}</p>
    );
  };
  
  const totalBody = (product) => {
    return (
      <p className='font-semibold'>₹ {calculateProductTotal(product.productId)}</p>
    );
  };
  
  

  if (!userCart || cartProducts.length === 0) {
    return <div
      style={{ marginTop: '80px', display: 'flex', justifyContent: 'center', height: '500px' }}
    >No items in the cart.</div>;
  }

  return (
    <div className="card flex md:justify-content-center" >
      <Toast ref={toast} />

      {dataFetched ?
        <>
          <div className='row cartRow'>
            <div className='col-xxl-9 '>
              <DataTable
                stripedRows
                value={productsWithQuantities}
                selectionMode="single"
                dataKey="id"
                stateStorage="session"
                stateKey="dt-state-demo-local"
                emptyMessage="No customers found."
                responsive 
                className="p-datatable-responsive-demo" 
              >
                <Column body={productBody} header="Product" style={{ width: '30%' }} />
                <Column field='price' body={priceBody} header="Price" style={{ width: '10%' }} sortable sortField="price" />
                <Column header="Quantity" body={quantityBody} style={{ width: '15%' }} />
                <Column header="Total" body={totalBody} style={{ width: '15%' }} sortable />
              </DataTable>

            </div>

            <div className='col-xxl-3 mt-2 checkout'>
              <Card title="Checkout">
                <div className='row justify-content-between'>
                  <div className='col-md-8'> Subtotal : </div>
                  <div className='col-md-4'> {Number(total.toFixed(2))}  </div>
                </div>
                <div className='row justify-content-center'>
                  <Button className='mt-5' style={{ width: '50%' }} onClick={() => handleCheckout()} label='Proceed to checkout' />
                </div>
              </Card>

              <Card title='You may also like' className='mt-5'>
                <Carousel value={sponseredProducts} responsiveOptions={responsiveOptions} numScroll={1} numVisible={1} itemTemplate={productTemplate} />
              </Card>


            </div>
          </div>

        </> : <h1>Loading....</h1>}
    </div>
  );
}

export default Cart;

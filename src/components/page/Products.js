import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../features/products/productsSlice';
import { useNavigate } from 'react-router-dom';
import { setCurrentProduct } from '../../features/currentProduct/currentProductSlice';
import { fetchCartData } from '../../features/cart/cartSlice';
import updateCart from '../../services/updateCart';
import { Toast } from 'primereact/toast';
import 'react-toastify/dist/ReactToastify.css';
import { removeQty } from '../../services/qtyManage';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';

export default function Data() {
    const [isScreenLarge, setIsScreenLarge] = useState(window.innerWidth > 425)
    const [rateFilter, setRateFilter] = useState(false)
    const [sortPriceUp, setSortPriceUp] = useState(false)
    const [sortPriceDown, setSortPriceDown] = useState(false)
    const [filter, setFilter] = useState({ price: 0, category: null })
    const [filteredProducts, setFilteredProducts] = useState(null)
    const [searchFilteredProducts, setSearchFilteredProducts] = useState(null)
    const [searchText, setSearchText] = useState('')
    const [isAdding, setIsAdding] = useState(false)
    const toast = useRef(null);
    const [dataFetched, setDataFetched] = useState(false);
    const user = useSelector((state) => state.user.users);
    const op = useRef(null);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchCartData());
        setDataFetched(true)
    }, [dispatch, dataFetched, isAdding])

    useEffect(() => {
        handleSearch()
    }, [filteredProducts])


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

    const cart = useSelector((state) => state.cart.cartSlice);
    const userCart = cart.find((item) => item.userId == user?.userId);
    const idsAndQuantities = userCart?.product_ids?.split(',');
    const quantitiesMap = {};
    idsAndQuantities?.forEach((entry) => {
        const [productId, decimalPart] = entry.split('.').map((part) => part.trim());
        quantitiesMap[productId] = parseFloat(decimalPart);
    });

    const show = () => {
        toast.current?.show({ severity: 'success', classNames: 'p-button-success', detail: 'Product Added', life: '2000' });
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

    function objectToString(inputObject) {
        return Object.entries(inputObject)
            .map(([productId, quantity]) => `${productId}.${quantity}`)
            .join(',');
    }

    const onAdd = async (id) => {
        setIsAdding(true);
        if (!user) {
            toast.current?.show({ severity: 'error', classNames: 'p-button-error', detail: 'You need to be logged in to shop', life: '2000' });
            return;
        }
        const updatedCarts = updateProductQuantity(id, 1)


        await removeQty(id)
        const res = await updateCart(user.userId, objectToString(updatedCarts))
        show()
        setIsAdding(false)
    }


    const [layout, setLayout] = useState('grid');
    const products = useSelector((state) => state.products.data);
    const navigate = useNavigate();


    const handleFilter = () => {
        setSearchFilteredProducts(null)
        const filteredProducts = products.filter((product) => (filter.price ? product.price <= filter.price : 1) && (filter.category ? product.category == filter.category : 1))
        setFilteredProducts(filteredProducts)
        if (op.current) {
            op.current.hide();
        }
    }

    const handleClearFilter = () => {
        setRateFilter(false)
        setSortPriceDown(false)
        setSortPriceUp(false)
        setFilteredProducts(null)
        handleSearch()

    }

    const handleSearch = () => {
        if (searchText === '' || searchText === null) {
            setSearchFilteredProducts(filteredProducts ? filteredProducts : products);
        } else {
            const filtered = filteredProducts ?
                filteredProducts.filter(product => product.product_name.toLowerCase().includes(searchText.toLowerCase()))
                :
                products.filter(product => product.product_name.toLowerCase().includes(searchText.toLowerCase()));
    if(filtered.length <1){
        toast.current?.show({ severity: 'error', classNames: 'p-button-error', detail: 'No Products found!', life: '2000' });

    }
            setSearchFilteredProducts(filtered.length > 0 ? filtered : []);
        }
    }
    
    
    const handleProduct = (product) => {
        dispatch(setCurrentProduct({ product }))
        navigate('/product');
    };

    const clearSearch = () => {
        setSearchText('')
        setSearchFilteredProducts('')
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

    const listItem = (product, index) => {
        return (
            <div className="col-12" key={product.productId}>

                <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
                    <img onClick={() => handleProduct(product)} className="w-32 shadow-2 border-round" style={{ cursor: 'pointer', maxHeight: '200px', marginBottom: '20px', maxWidth: '190px' }} src={product.image_data} alt={product.product_name} />

                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-xl font-bold text-900">{product.product_name}</div>
                            <Rating value={product.rating} readOnly cancel={false}></Rating>
                            <div  >
                                <div>
                                    <Tag value={getStock(product)} severity={getSeverity(product)}></Tag>
                                </div>
                            </div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <span className="text-2xl font-semibold">₹{product.price}</span>
                            <Button onClick={() => onAdd(product.productId)} icon="pi pi-shopping-cart" className="p-button-rounded" style={{ fontSize: '2.5rem' }} disabled={product.inventoryStatus === 'OUTOFSTOCK'}></Button>
                        </div>
                    </div>
                </div>
            </div>

        );
    };

    const gridItem = (product) => {
        return (
            <div className="tre col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={product.productId}>
                <div className="product p-4 border-1 surface-border surface-card">
                    <div className="flex flex-row">
                        <div className="flex-1 " >
                            <img onClick={() => handleProduct(product)} className="w-32 shadow-2 border-round" style={{ cursor: 'pointer', maxHeight: '200px', marginBottom: '20px', maxWidth: '190px' }} src={product.image_data} alt={product.product_name} />
                        </div>
                        <div className="flex-1 pl-4">
                            <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                                <div className="flex align-items-center gap-2">
                                    <i className="pi pi-tag"></i>
                                    <span style={{fontSize : '0.75rem'}}>{product.category}</span>
                                </div>
                            </div>
                            <div className="flex flex-column align-items-center gap-3 py-5">
                                <div className="text-1rem font-bold">{product.product_name}</div>
                                <Rating value={product.rating} readOnly cancel={false}></Rating>
                            <Tag className='block ' style={{ maxWidth: '90px' }} value={getStock(product)} severity={getSeverity(product)}></Tag>

                            </div>
                            <div className="flex align-items-center justify-content-between text-lime-700	">
                                <span className="text-1rem font-semibold">₹{product.price}</span>
                                <Button disabled={product.quantity < 1} tooltip='Add to cart' onClick={() => onAdd(product.productId)} icon="pi pi-shopping-cart" className="p-button-rounded text-lime-700" ></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplate = (product, layout, index) => {
        if (!product) {
            return;
        }

        if (layout === 'list') return listItem(product, index);
        else if (layout === 'grid') return gridItem(product);
    };

    const listTemplate = (products, layout) => {
        return <div className="grid grid-nogutter">{products?.map((product, index) => itemTemplate(product, layout, index))}</div>;
    };

    const priceOptions = [
        { label: 'All', value: '' },
        { label: 'Less than ₹200', value: 200 },
        { label: 'Less than ₹500', value: 500 },
        { label: 'Less than ₹1000', value: 1000 },
    ];

    const categoryOptions = [
        { label: 'All', value: '' },
        { label: 'Electronics', value: 'Electronics' },
        { label: 'Clothing', value: 'Clothing' },
        { label: 'Beauty', value: 'Beauty' },
        { label: 'Home and Kitchen', value: 'Home and Kitchen' },
        { label: 'Sports and Outdoors', value: 'Sports and Outdoors' },
        { label: 'Toys and Games', value: 'Toys and Games' },
    ];

    let showProducts;

    if (sortPriceUp || sortPriceDown) {
        showProducts = [...(searchFilteredProducts || []), ...(filteredProducts || []), ...products];
        if (showProducts?.length > 0) {
            if (sortPriceUp) {
                showProducts.sort((a, b) => a.price - b.price);
            } else {
                showProducts.sort((a, b) => b.price - a.price);
            }
            if (rateFilter) {
                showProducts.sort((a, b) => b.rating - a.rating);
            }
        }
    } else if (rateFilter) {
        showProducts = [...(searchFilteredProducts || []), ...(filteredProducts || []), ...products];
        if (showProducts?.length > 0) {
            showProducts.sort((a, b) => b.rating - a.rating);
        }
    } else {
        showProducts = searchFilteredProducts?.length > 0 ? searchFilteredProducts : (filteredProducts?.length > 0 ? filteredProducts : products);
    }
    



    const header = () => {
        return (

            isScreenLarge ?
                <>
                    <div className="d-flex justify-content-between align-items-center">
                        <Button type="button" icon="pi pi-filter" label="Filter" onClick={(e) => op.current.toggle(e)} />
                        <div className='d-flex align-items-center'>

                            <span className="p-input-icon-right" style={{ width: '35vw' }}>
                                <i onClick={() => clearSearch()} className="pi pi-times" />
                                <InputText onChange={(e) => { setSearchText(e.target.value) }} value={searchText} className='w-100 mr-2' placeholder="Search" />
                            </span>

                            <Button onClick={() => handleSearch()} icon='pi pi-search'></Button>
                        </div>
                        <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
                    </div>

                </>

                :

                <>
                    <div className="d-flex justify-content-between align-items-center">
                        <Button type="button" icon="pi pi-filter" label="Filter" onClick={(e) => op.current.toggle(e)} />

                        <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
                    </div>
                    <div className='d-flex align-items-center mx-5 my-5' >

                        <span className="p-input-icon-right">
                            <i onClick={() => clearSearch()} className="pi pi-times" />
                            <InputText onChange={(e) => { setSearchText(e.target.value) }} value={searchText} className='w-100 mr-2' placeholder="Search" />
                        </span>

                        <Button onClick={() => handleSearch()} icon='pi pi-search'></Button>
                    </div>
                </>
        );
    };

    return (
        <div className="">
            <Toast ref={toast} />
            <Toast ref={toast} />

            <OverlayPanel ref={op} showCloseIcon>
                <div className="filter-panel">
                    <h4 className='py-2'>Filter Options</h4>
                    <div className="p-grid p-fluid">
                        <div className="p-col-12 p-md-6">
                            <div className="p-field py-2">
                                <label htmlFor="price-filter">Price:</label>

                                <Dropdown value={filter.price} onChange={(e) => setFilter({ ...filter, price: e.value })} id="price-filter" options={priceOptions} placeholder="Select a price range" />

                                <div className='row my-2 justify-content-center mx-4'>
                                    <Button tooltip='Price Low to High' disabled={sortPriceDown} onClick={() => setSortPriceUp(!sortPriceUp)} className='col-md-4 mx-2' icon='pi pi-sort-numeric-down' />
                                    <Button tooltip='Price High to Low'   disabled={sortPriceUp} onClick={() => setSortPriceDown(!sortPriceDown)} className='col-md-4 mx-2' icon='pi pi-sort-numeric-up ' />
                                </div>
                            </div>
                        </div>
                        <div className="p-col-12 p-md-6">
                            <div className="p-field py-4">
                                <label htmlFor="category-filter">Category:</label>
                                <Dropdown value={filter.category} onChange={(e) => setFilter({ ...filter, category: e.value })} id="category-filter" options={categoryOptions} placeholder="Select a category" />
                            </div>
                            <div className="py-2 flex justify-content-center">
                                <InputSwitch tooltip='Most rated to least rated' checked={rateFilter} onChange={(e) => setRateFilter(e.value)} />
                                <p className='px-2'> Most Rated</p>
                            </div>
                        </div>
                    </div>
                    <Button label="Apply Filters" icon="pi pi-filter"
                        onClick={() => handleFilter()}
                    />
                    <Button type='button' severity='secondary' label="Clear Filters" icon="pi pi-filter" className="block my-3"
                        onClick={() => { handleClearFilter() }}
                    />
                </div>
            </OverlayPanel>

            <DataView paginator rows={12} value={showProducts} listTemplate={listTemplate} layout={layout} header={header()} />
        </div>
    )
}
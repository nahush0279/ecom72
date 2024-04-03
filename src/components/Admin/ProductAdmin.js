import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import deleteProduct from '../../services/deleteProduct';
import { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { fetchProducts } from '../../features/products/productsSlice';
import Form from '../common/Form';
import DataTableCom from '../common/DataTable';

function ProductAdmin() {
    const toast = useRef(null);
    const [editVisible, setEditVisible] = useState(false)
    const [product, setProduct] = useState('')
    const [addVisible, setAddVisible] = useState(false)
    const [deleteVisible, setDeleteVisible] = useState(false)
    const [productId, setProductId] = useState('')

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch, addVisible, editVisible, deleteVisible]);

    const products = useSelector((state) => state.products.data)
    const imageBodyTemplate = (rowData) => {
        return <img style={{ height: '86px' , maxWidth : '200px'}} src={rowData.image_data} />
    };
    const handleEditClick = (rowData) => {
        setEditVisible(true)
        setProduct(rowData)
    }

    const handleDeleteClick = (rowData) => {
        setProductId(rowData.productId)
        setDeleteVisible(true)

    }

    const handleDelete = async () => {
        const res = await deleteProduct(productId);
        if (res.success) {
            toast.current.show({ severity: 'success', detail: 'Product Deleted' });
        }
        else {
            toast.current.show({ severity: 'error', detail: 'Something went wrong !' });
        }
        setDeleteVisible(false)
    }


    const actionBodyTemplate = (rowData) => {
        return (
            <div className='flex flex-row'>
                <Button icon="pi pi-pencil" rounded outlined className="rounded bg-yellow-400 text-white mr-2" onClick={() => handleEditClick(rowData)} />
                <Button icon="pi pi-trash" className="rounded bg-red-500 text-white mr-2" rounded outlined onClick={() => handleDeleteClick(rowData)} />
            </div>
        );
    }

    const cols = [
        { field: 'image', header: 'Image', body: imageBodyTemplate },
        { field: 'product_name', header: 'Name' },
        { field: 'quantity', header: 'Quantity' },
        { field: 'seller', header: 'Seller' },
        { field: 'description', header: 'Description' },
        { field: 'rating', header: 'Rating' },
        { field: 'category', header: 'Category' },
        { field: 'price', header: 'Price' },
    ]


    return (
        <div style={{ marginTop: '30px' }}>
            <div className="justify-content-center">
                <Form type='Add' visible={addVisible} setVisible={setAddVisible} />
            </div>
            <div className="justify-content-center">
                <Form type='Edit' visible={editVisible} product={product} setVisible={setEditVisible} />
            </div>
            <div>
                <Dialog header="Confirm Delete" visible={deleteVisible} style={{ width: '50vw' }} onHide={() => setDeleteVisible(false)}>
                    <p className="m-0">
                        Are you sure you want to delete the product?
                    </p>
                    <div className='flex justify-content-center' style={{ marginTop: '30px' }}>
                        <Button className="rounded bg-red-500 text-white mr-2 justify-content-center" style={{ height: '40px', width: '80px' }} onClick={() => handleDelete(productId)}>Delete</Button>
                        <Button className="rounded bg-blue-500 text-white mr-2 justify-content-center" style={{ height: '40px', width: '80px' }} onClick={() => { setDeleteVisible(false) }}>Cancel</Button>
                    </div>
                </Dialog>
            </div>

            <Toast ref={toast} />
            <div style={{ width: '100vw', maxWidth: '100vw'}}>
                <div style={{ display: 'flex ', justifyContent: 'space-between' }}>
                    <div className=' ' >
                        <h2>  Products  </h2>
                    </div>
                    <div className='' >
                        <Button onClick={() => { setAddVisible(true) }} style={{ width: '116px', marginBottom: '10px' }} className="justify-content-center rounded bg-green-400 text-white mr-2" header='Add'>Add</Button>
                    </div></div>
                <DataTableCom  actionBodyTemplate={actionBodyTemplate}
                    data={products}
                    cols={cols}
                />

            </div>

        </div>
    );
}

export default ProductAdmin
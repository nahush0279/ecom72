import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { fetchUserData } from '../../features/users/usersSlice';
import FormUser from '../common/FormUser';
import deleteUser from '../../services/deleteUser';
import { useRef } from 'react';
import { Toast } from 'primereact/toast';
import DataTableCom from '../common/DataTable';

function UserAdmin() {

    const toast = useRef(null);

    const [editVisible, setEditVisible] = useState(false)
    const [userCurr, setUserCurr] = useState('')
    const [addVisible, setAddVisible] = useState(false)
    const [deleteVisible, setDeleteVisible] = useState(false)
    const [userId, setUserId] = useState('')


    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchUserData());
    }, [dispatch, addVisible, editVisible, deleteVisible]);

    const users = useSelector((state) => state.users.userData)
    const handleEditClick = (rowData) => {
        setEditVisible(true)
        setUserCurr(rowData)
    }

    const handleDeleteClick = (rowData) => {
        setUserId(rowData.userId)
        setDeleteVisible(true)

    }

    const handleDelete = async () => {
        const res = await deleteUser(userId);
        if (res.success) {
            toast.current.show({ severity: 'success', detail: 'User Deleted' });
        }
        else {
            toast.current.show({ severity: 'error', detail: 'Something went wrong !' });
        }
        setDeleteVisible(false)
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className='flex flex-row'>
                <Button icon="pi pi-pencil" className="rounded bg-yellow-400 text-white mr-2" rounded outlined onClick={() => handleEditClick(rowData)} />
                <Button icon="pi pi-trash" className="rounded bg-red-500 text-white mr-2" rounded outlined onClick={() => handleDeleteClick(rowData)} />
            </div>

        );
    }

    const cols = [
        { field: 'name', header: 'Name' , width : '25%'},
        { field: 'email', header: 'Email' , width : '25%'},
        { field: 'gender', header: 'Gender', width : '25%' },
        { field: 'role', header: 'Roles' , width : '25%' }

    ]


    return (
        <div  style={{ marginTop: '30px' }}>
            <Toast ref={toast} />
            <Dialog header="Confirm Delete" visible={deleteVisible} style={{ width: '50vw' }} onHide={() => setDeleteVisible(false)}>
                <p className="m-0">
                    Are you sure you want to delete the user?
                </p>
                <div className='flex justify-content-center' style={{ marginTop: '30px' }}>
                    <Button className="rounded bg-red-500 text-white mr-2 justify-content-center" style={{ height: '40px', width: '80px' }} onClick={() => handleDelete(userId)}>Delete</Button>
                    <Button className="rounded bg-blue-500 text-white mr-2 justify-content-center" style={{ height: '40px', width: '80px' }} onClick={() => { setDeleteVisible(false) }}>Cancel</Button>
                </div>
            </Dialog>

            <div style={{ width: '100vw', maxWidth: '100vw' }}>
                <div style={{ display: 'flex ', justifyContent: 'space-between' }}>
                    <div className=' ' >
                        <h2 > Users </h2>
                    </div>
                    <div className='' >
                        <Button onClick={() => { setAddVisible(true) }} style={{ width: '116px', marginBottom: '10px' }} className="justify-content-center rounded bg-green-400 text-white mr-2" header='Add'>Add</Button>
                    </div></div>
                <DataTableCom cols={cols} actionBodyTemplate={actionBodyTemplate} data={users} />
                <FormUser type='Add' visible={addVisible} setVisible={setAddVisible} />
                <FormUser type='Edit' visible={editVisible} user={userCurr} setVisible={setEditVisible} />

            </div></div>
    )
}

export default UserAdmin
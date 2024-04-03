import React, { useRef, useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { Badge } from 'primereact/badge';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { setTable } from '../../features/auth/authSlice';
import FormUser from './FormUser';
import axios from 'axios'
import { Dialog } from 'primereact/dialog';
export default function () {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const carts = useSelector((state) => state.cart.cartSlice);
    const user = useSelector((state) => state.user?.users);
    const [visible, setVisible] = useState(false);
    const isAdmin = user?.role == 'admin'
    const [profile, setProfile] = useState(false)
    const buttonEl = useRef(null);
    const handleCart = () => {
        if (user) {
            navigate('/cart')
        }
        else {
            setVisible(true)
        }
    }

    const onLogout = async () => {
        const userId = user?.userId
        await axios.post(process.env.REACT_APP_API_URL + 'removeToken', {
            userId
        });
        window.localStorage.removeItem('AUTH')
        window.sessionStorage.removeItem("CURRENT_USER")
        window.sessionStorage.removeItem("accessToken")
        window.localStorage.removeItem("USER")
        window.sessionStorage.removeItem("ROLE")
        navigate('/login')
        window.location.reload()
    }

    const itemsUserLogged = [
        {
            id: "1",
            label: 'Cart',
            icon: 'pi pi-shopping-cart',
            command: () => handleCart()
        },
        {
            id: "2",
            label: 'Products',
            icon: 'pi pi-list',
            url: '/'
        },
        {
            label: 'Profile',
            icon: 'pi pi-user',
            id: "3",
            items: [{
                id: "2",
                label: 'Edit Profile',
                icon: 'pi pi-user-edit',
                command: () => setProfile(true)
            },
            {
                id: "7",
                label: 'Change Password',
                icon: 'pi pi-refresh',
                command: () => navigate('/reset')
            },
            {
                id: "4",
                label: 'Logout',
                icon: 'pi pi-user-minus',
                command: () => onLogout()

            }]
        }
    ];


    const itemsUser = [
        {
            id: "1",
            label: 'Cart',
            icon: 'pi pi-shopping-cart',
            command: () => handleCart(),


        },
        {
            id: "2",
            label: 'Products',
            icon: 'pi pi-list',
            url: '/'
        },
        {
            id: "3",
            label: 'Login',
            icon: 'pi pi-user',
            url: '/login'
        }
    ];

    const itemsAdmin = [
        {
            id: "1",
            label: 'Admin',
            icon: 'pi pi-database',
            command: () => dispatch(setTable('admin'))
        },
        {
            label: 'Manage',
            icon: 'pi pi-eye',
            id: "3",
            items: [{
                id: "4",
                label: 'Users',
                icon: 'pi pi-user',
                command: () => dispatch(setTable('users'))
            },
            {
                id: "2",
                label: 'Products',
                icon: 'pi pi-tags',
                command: () => dispatch(setTable('products'))
            }]
        },
        {
            id: "4",
            label: 'Logout',
            icon: 'pi pi-user-minus',
            command: () => onLogout()

        }
    ];

    const userName = useSelector((state) => state.user?.users?.name)?.split(' ')[0]
    const start = null
    const end = (
        <div className="flex align-items-center gap-2">
            {userName ?
                <h4>Hi , {userName}</h4> : null
            }

        </div>
    );

    return (
        <header id='header' className="card" style={{ position: 'sticky', top: '0', zIndex: '1000' }} >
            {
                profile && <FormUser
                    type='Edit' visible={profile} user={user} setVisible={setProfile}
                    isUser={'false'}
                    client = {true}
                />
            }

            <Dialog
             style={{
                display: 'inline-block',
                maxWidth: '100%', 
                overflow: 'hidden', 
                whiteSpace: 'nowrap',
                fontSize: '0.75rem' 
            }} visible={visible} position='top-left'  onHide={() => setVisible(false)} draggable={false} resizable={false}>
                <p className="m-0 mb-2">
                    You have to be logged in to manage your cart
                </p>
                <Button label='Login' onClick={() => {setVisible(false); navigate('/login')}} />
            </Dialog>

            <Menubar
                id='2'
                style={{ height: '60px' }}
                model={user ? isAdmin ? itemsAdmin : itemsUserLogged : itemsUser}
                start={start}
                end={end} />

        </header>
    )
}
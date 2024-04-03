import React, { useState } from 'react'
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import '../../flag.css';
import { setUser } from '../../features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import userAuth from '../../services/userAuth';
import { useNavigate } from 'react-router-dom';
import { setAuthenticated } from '../../features/auth/authSlice';
import axios from 'axios';
import FormUser from '../common/FormUser';
import { useRef } from 'react';
import { Toast } from 'primereact/toast';
import ReCAPTCHA from 'react-google-recaptcha';
import { Dialog } from 'primereact/dialog';


function Login() {
  const recaptcha = useRef()
  const [addVisible, setAddVisible] = useState(false)
  const [forgetDialog, setForgetDialog] = useState(false)
  const [email, setEmail] = useState('')
  const [profile, setProfile] = useState(false)
  const toast = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuth = useSelector(state => state.auth.isAuthenticated);
  const user = useSelector((state) => state.user?.users)
  const userName = useSelector((state) => state.user?.users?.name)?.split(' ')[0]
  const verifyUser = async (Token) => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        if (Token) {
            const response = await axios.get(process.env.REACT_APP_API_URL + 'verify', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (response.data) {
                const userId = response?.data?.user?.userId;
                const saveRes = await axios.post(process.env.REACT_APP_API_URL +'saveToken', {
                    accessToken,
                    userId
                });
                if (saveRes.data.success) {
                    localStorage.setItem('accessToken', accessToken);
                    dispatch(setAuthenticated(true));
                    if (response.data.user.role === 'admin') {
                        navigate('/admin');
                    } else {
                        navigate('/');
                    }
                    return 'success'; 
                } else {
                    toast.current.show({ severity: 'error', detail: 'User Already Logged in' });
                    return 'error';
                }
            } else {
                toast.current.show({ severity: 'error', detail: 'Incorrect Email or Password' });
            }
        } else {
        }
    } catch (error) {
        console.error('Error in verifyUser:', error);
        toast.current.show({ severity: 'error', detail: 'Incorrect Email or Password' });
        return 'error'; 
    }
};


  const handleSubmit = async (values) => {
    const captchaValue = recaptcha?.current?.getValue()
    const res = await fetch(process.env.REACT_APP_API_URL +'verifyCaptcha', {
      method: 'POST',
      body: JSON.stringify({ captchaValue }),
      headers: {
        'content-type': 'application/json',
      },
    })
    const data = await res.json()
    if (!data.success) {
      try {
        const res = await userAuth(values.email, values.password)
        const resUser = res.user
        dispatch(setUser(resUser))

        const accessToken = res?.accessToken
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken)
           const val = await verifyUser(accessToken)
          if(val == 'success'){
            dispatch(setAuthenticated({ isAuthenticated: true, role: resUser.role }))

          }
        } else {
          toast.current.show({ severity: 'error', detail: 'Incorrect Email or Password' });

        }
      } catch (error) {
        console.error('Error during authentication:', error)
      }
    } else {
      toast.current.show({ severity: 'error', detail: 'Complete the captcha to login' });
    }
  }

  const handleLogout = async () => {
    const userId = user?.userId
    await axios.post(process.env.REACT_APP_API_URL +'removeToken', {
      userId
    });
    window.localStorage.removeItem('AUTH')
    window.sessionStorage.removeItem("CURRENT_USER")
    window.sessionStorage.removeItem("accessToken")
    window.localStorage.removeItem("USER")
    window.location.reload()
  }

  const handleForget = async () => {
    const response = await axios.post(process.env.REACT_APP_API_URL + 'sendPasswordMail', {
      email
    });

    if (response.data.accepted) {
      toast.current.show({ severity: 'success', detail: 'Email has been sent successfully' });
    }

    else {
      toast.current.show({ severity: 'error', detail: 'Something got wrong' });
    }

    setForgetDialog(false)

  }


  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema,
    onSubmit: (values) => {
      handleSubmit(values)

    },
  });


  return (
    <div>
      {
        profile && <FormUser
          type='Edit' visible={profile} user={user} setVisible={setProfile}
          isUser={'false'}

        />
      }

      <Dialog header='Forgot Password' visible={forgetDialog} modal style={{ width: '50rem' }} onHide={() => setForgetDialog(false)}>
        <p className="m-0 py-3">
          You will receive a mail with your current password. Click Continue to proceed.
        </p>
        <label className='block'>Email</label>
        <InputText id='email' placeholder='Enter your email' onChange={(e) => setEmail(e.target.value)} />
        <Button onClick={() => handleForget()} className='block my-5' label='Continue' severity='info' />
      </Dialog>

      <Toast ref={toast} position='top-center' />

      <FormUser type='Add' login={true} visible={addVisible} setVisible={setAddVisible} />
      {!isAuth ?
        <form className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%" style={{ marginTop: '80px' }} onSubmit={formik.handleSubmit}>
          <div >

            <div className="flex flex-column md:flex-row">

              <div className="w-full md:w-5 flex flex-column align-items-center justify-content-center gap-3 py-5">
                <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                  <label className="w-6rem">Email</label>
                  <InputText id="email" onChange={formik.handleChange} type="text" className="w-12rem border-2 hover:border-t-4 " />
                </div>
                {formik.errors.email && formik.touched.email && (
                  <div style={{ marginLeft: '100px' }} className="text-red-500">{formik.errors.email}</div>
                )}
                <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                  <label className="w-6rem">Password</label>
                  <InputText id="password" onChange={formik.handleChange} type="password" className="w-12rem border-2 hover:border-t-4" />

                </div>
                {formik.errors.password && formik.touched.password && (
                  <div style={{ marginLeft: '100px' }} className="text-red-500">{formik.errors.password}</div>
                )}
                <ReCAPTCHA style={{ marginLeft: '85px' }} ref={recaptcha} sitekey={String(process.env.REACT_APP_SITE_KEY)} />

                <div className='flex my-5'>
                  <Button severity='info' onClick={() => setForgetDialog(true)} style={{ marginLeft: '90px' }} label="Forgot Password" type='button' ></Button>
                  {/* <Button severity='info' onClick={() => navigate('/reset')} style={{ marginLeft: '90px' }} label="Reset Password" type='button'  ></Button> */}
                  <Button style={{ marginLeft: '90px', width: '170px' }} severity='success' label="Login" type='submit' icon="pi pi-user" ></Button>
                
                </div>
              </div>

              <div className="w-full md:w-2">
                <Divider layout="vertical" className="hidden md:flex">
                  <b>OR</b>
                </Divider>
                <Divider layout="horizontal" className="flex md:hidden" align="center">
                  <b>OR</b>
                </Divider>
              </div>
              <div className="w-full md:w-5 flex align-items-center justify-content-center py-5">
                <Button
                  type='button'
                  label="Sign Up" onClick={() => setAddVisible(true)} icon="pi pi-user-plus" severity="success" ></Button>
              </div>
            </div>
          </div>
        </form> :

      null
      }
    </div>

  )
}

export default Login
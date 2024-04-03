import { useFormik } from 'formik'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { RadioButton } from 'primereact/radiobutton'
import React from 'react'
import addUser from '../../services/addUser';
import updateUser from '../../services/updateUser';
import { useRef } from 'react';
import { Toast } from 'primereact/toast';
import * as yup from 'yup';

function FormUser({ type, visible, setVisible, user, login, isUser, client }) {
  const isAdd = type == 'Add'
  const toast = useRef(null);

  const userSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    gender: yup.string().oneOf(['male', 'female', 'other'], 'Invalid gender').required('Gender is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
  });

  const handleSubmit = async (values) => {
    if (!isAdd) {
      const res = await updateUser(user.userId, values.name, values.email, values.password,
        values.gender, values.role)
      setVisible(false)
      if (res.success) {
        toast.current.show({ severity: 'success', detail: 'User Updated' });
      }
      else {
        toast.current.show({ severity: 'error', detail: 'Something went wrong !' });
      }
    }

    else {
      const res = await addUser(values.name, values.email, values.password,
        values.gender
      )
      setVisible(false)
      if (res.message) {
        toast.current.show({ severity: 'success', detail: 'User Added' });
      }
      else {
        toast.current.show({ severity: 'error', detail: 'Something went wrong !' });
      }
    }
  }
  const formik = useFormik({
    initialValues: {
      name: '',
      gender: '',
      password: '',
      email: '',
      role: ''

    },
    validationSchema: userSchema,
    onSubmit: (values) => {
      handleSubmit(values)

    },
  });

  React.useEffect(() => {
    if (user) {
      formik.setValues({
        name: user.name,
        gender: user.gender,
        password: user.password,
        email: user.email,
        role: user.role
      });
    }
  }, [user]);
  return (
    <div>
      <Toast ref={toast} />
      <Dialog
      style={{maxWidth : '80vw'}}
      header={isAdd && login ? 'Register' : isAdd ? 'Add User' : 'Update User'} visible={visible} onHide={() => setVisible(false)} className='dialog'>
        <form className="container text-center" onSubmit={formik.handleSubmit}>

          <div className="row justify-content-center">

            <div className="mb-4"  >
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
          </div>

          <div className="row">

            {!client
              &&
              <div className="col-md-6">
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Password</label>
                  <InputText
                    className="form-control"
                    id="password"
                    name="password"
                    type="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                  />
                  {formik.errors.password && formik.touched.password && (
                    <div className="text-danger">{formik.errors.password}</div>
                  )}
                </div>
              </div>}

            <div className={!client ? 'col-md-6' : 'col-md-12'}>
              <div className="mb-4">
                <label htmlFor="email" className="form-label">Email</label>
                <InputText
                  className="form-control"
                  id="email"
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}

                />
                {formik.errors.email && formik.touched.email && (
                  <div className="text-danger">{formik.errors.email}</div>
                )}
              </div>
            </div>
          </div>

          <div className='col'>
  <div className="row">
  <div className="col-md-3">
    <label htmlFor="gender" className="form-label me-3 d-block">Gender</label>
  </div>
  <div className="col-md-9">
    <div className="row">
      <div className="col-md-2">
        
          <RadioButton
            inputId="male"
            name="gender"
            value="male"
            onChange={formik.handleChange}
            className=""
            checked={formik.values.gender === 'male' || formik.values.gender === 'Male'}
          />
      </div>
      <label className="col-md-2 mr-5 form-check-label d-block" htmlFor="male">Male</label>

      <div className="col-md-2">
          <RadioButton
            inputId="female"
            name="gender"
            value="female"
            onChange={formik.handleChange}
            className=""
            checked={formik.values.gender === 'female' || formik.values.gender === 'Female'}
          />
      </div>
      <label className="col-md-2 form-check-label d-block" htmlFor="female">Female</label>

    </div>
    {formik.errors.gender && formik.touched.gender && (
      <div className="col-md-12 text-danger">{formik.errors.gender}</div>
    )}
  </div>
</div>

</div>


          {!isAdd && !isUser && (

            <div className='col '>
              <div className="row d-flex align-items-center">
                <div className="col-md-7 d-flex justify-content-center align-items-center">
                  <div className="mb-2 mt-1">

                    <div className="d-flex gap-3">
                      <label htmlFor="role" className="form-label">Role</label>
                      <div className="form-check flex">
                        <RadioButton
                          inputId="user"
                          name="role"
                          value="user"
                          onChange={formik.handleChange}
                          checked={formik.values.role === 'user'}
                          className="mx-0.25 me-1"
                        />
                        <label className="form-check-label" htmlFor="user">User</label>
                      </div>

                      <div className="form-check flex">
                        <RadioButton
                          inputId="admin"
                          name="role"
                          value="admin"
                          onChange={formik.handleChange}
                          checked={formik.values.role === 'admin'}
                          className="mx-0.25 me-1"
                        />
                        <label className="form-check-label" htmlFor="admin">Admin</label>
                      </div>
                    </div>
                  </div>
                </div></div>
            </div>

          )}

          <div className='row justify-content-end'>
            <div className={ client ? 'col-md-5 align-self-end mb-2' : 'col-md-3 align-self-end mb-2'} style={{ marginRight: '20px' }}>
              <Button
                style={{ width: '130px' }}
                type="submit"
                label={isAdd ? 'Add User' : 'Save Changes'}
                severity="success"
                className="btn btn-primary"
              ></Button>
            </div>
            <div className={ client ? 'col-md-3 align-self-end mb-2' : 'col-md-2 align-self-end mb-2'}>
              <Button
                type='button'
                onClick={() => setVisible(false)}
                label={'Cancel'}
                severity="danger"
                className="btn btn-secondary"
              ></Button>
            </div>
          </div>


        </form>

      </Dialog>
    </div>
  )
}

export default FormUser
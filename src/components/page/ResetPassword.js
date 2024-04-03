import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import axios from 'axios';

const ResetPassword= () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [email, setEmail] = useState('');
    const toast = useRef(null);

    const handleSubmit = async () => {
        const response = await axios.post(process.env.REACT_APP_API_URL  + 'resetPassword', {
            email, oldPassword, newPassword
          }); 
          if(response.data.success)   {
        toast.current.show({ severity: 'success', summary: 'Password Updated', detail: 'Your password has been updated successfully.' });
          }  else if(response.data.error){
        toast.current.show({ severity: 'error', summary: 'Incorrect Password Entered' });

          }
    };

    return (
        <div className="container my-5">
        <div className="row justify-content-center">
            <div className="col-md-4">
                <div className="p-fluid p-formgrid p-grid">
                <div className="p-field p-col-12 p-md-6 my-3">
                        <label htmlFor="email">Email</label>
                        <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="p-field p-col-12 p-md-6">
                        <label htmlFor="oldPassword">Old Password</label>
                        <InputText id="oldPassword" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                    </div>
                    <div className="p-field p-col-12 p-md-6 my-3">
                        <label htmlFor="newPassword">New Password</label>
                        <InputText id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div className="p-field p-col-12">
                        <Button label="Submit" onClick={handleSubmit} />
                    </div>
                    <Toast ref={toast} />
                </div>
            </div>
        </div>
    </div>
    );
};

export default ResetPassword

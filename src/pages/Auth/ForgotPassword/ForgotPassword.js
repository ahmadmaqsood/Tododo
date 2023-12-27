import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './forgot.scss'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../../../Config/firebase';
import { AuthContext } from '../../../context/AuthContext';

const initialState = {
  email: ''
}
export default function ForgotPassword() {
  const [state, setState] = useState(initialState)
  const [isProcessing, setIsProcessing] = useState(false)
  const { user,dispatch } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState(s => ({ ...s, [name]: value }))
  }

  const handleForgot = (e) => {
    e.preventDefault();
    const { email } = state;

    setIsProcessing(true)

    sendPasswordResetEmail(auth, email)
      .then(() => {
        navigate("/auth/login")
        window.toastify('Email is sent Go to Gmail','success')
        // Password reset email sent!
        // ..
        setIsProcessing(false)
      })
      .catch((error) => {
        console.error(error)
          window.toastify('Something is error','error')
        // ..
        setIsProcessing(false)
      });

  }



  return (
    <div className="forgotPassword">
      <div className="container  ">
        <div className="row">
          <div className="col">
            <div class="card mx-auto ">
              <div className="logo bg-white mx-auto" >
                <AccountCircleIcon style={{ fontSize: 35, marginLeft: 20, marginRight: 20, marginTop: 20, marginBottom: 20, }} className=' mt-3' />
              </div>
              <h5 className='text-center fw-bold text-white mt-2'>Forgot Password</h5>
              <div class="card-body">
                <div class="input-group mb-2 ">
                  <span class="input-group-text bg-transparent border-0 " id="basic-addon1"><EmailIcon className='text-white' /></span>
                  <input type="email" class="form-control bg-transparent border-0  text-white" placeholder="Email" onChange={handleChange} name='email' aria-label="Username" aria-describedby="basic-addon1" />
                </div>
                <div className="button text-center">
                  <button class="btn  mb-5 px-4 py-2" onClick={handleForgot} >{
                    !isProcessing ?
                      'Send Request' :
                      <div className="spinner-border spinner-border-sm"></div>
                  }</button>
                </div>

                <div className='text-center text-white'>
                  <Link to='/auth/login' className='text-decoration-none text-white'>Already Login</Link>
                  <ArrowForwardIcon />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

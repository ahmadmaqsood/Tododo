import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './register.scss'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import EmailIcon from '@mui/icons-material/Email';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../../Config/firebase';
import {AuthContext} from '../../../context/AuthContext'


const initialState = {
  firstname: '',
  lastname: ' ', email: '', password: ''
}
export default function Register() {
  const [state, setState] = useState(initialState)
  const [isProcessing, setIsProcessing] = useState(false)
  const { dispatch } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState(s => ({ ...s, [name]: value }))
  }

  const handleRegister = (e) => {
    e.preventDefault();
    const { email, password } = state;

    setIsProcessing(true)
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        dispatch({ type: "LOGIN" })
        window.toastify('User is Created SuccessFully', 'success')
        navigate('/')
        // ...
        setIsProcessing(false)
      })
      .catch((error) => {
        window.toastify('Something error', 'error')
        console.log(error.message)
        // ..
        setIsProcessing(false)
      });

  }


  return (
    <div className="register">
      <div className="container">
        <div className="row">
          <div className="col">
            <div class="card mx-auto " >
              <div className="logo bg-white mx-auto" >
                <AccountCircleIcon style={{ fontSize: 35, marginLeft: 20, marginRight: 20, marginTop: 20, marginBottom: 20, }} className=' mt-3' />
              </div>
              <h5 className='text-center fw-bold text-white mt-2'>Member Register</h5>
              <div class="card-body">
                <div class="input-group mb-2 ">
                  <span class="input-group-text bg-transparent border-0 " id="basic-addon1"><PersonIcon className='text-white' /></span>
                  <input type="text" class="form-control bg-transparent border-0  text-white" placeholder="First Name" onChange={handleChange} name='firstname' aria-label="Firstname" aria-describedby="basic-addon1" />
                </div>
                <div class="input-group mb-2 ">
                  <span class="input-group-text bg-transparent border-0 " id="basic-addon1"><AutoFixHighIcon className='text-white' /></span>
                  <input type="text" class="form-control bg-transparent border-0 text-white " placeholder="Last Name" onChange={handleChange} aname='lastname' ria-label="Lastname" aria-describedby="basic-addon1" />
                </div>
                <div class="input-group mb-2 ">
                  <span class="input-group-text bg-transparent border-0 " id="basic-addon1"><EmailIcon className='text-white' /></span>
                  <input type="email" class="form-control bg-transparent border-0  text-white" placeholder="Email" onChange={handleChange} name='email' aria-label="Username" aria-describedby="basic-addon1" />
                </div>
                <div class="input-group mb-4">
                  <span class="input-group-text bg-transparent border-0 " id="basic-addon1"><LockIcon className='text-white' /></span>
                  <input type="password" class="form-control bg-transparent border-0 text-white" placeholder="Password" onChange={handleChange} name='password' aria-label="Password" aria-describedby="basic-addon1" />
                </div>
                <div className="button text-center">
                  <button class="btn  mb-3 px-4 py-2" onClick={handleRegister} disabled={isProcessing} >{
                    !isProcessing ?
                      'Register' :
                      <div className="spinner-border spinner-border-sm"></div>
                  }</button>
                </div>
                <div className="security d-flex align-items-center mb-5 text-white">
                  <input type="checkbox" name="remember" id="remember" />
                  <span className='ms-1 ' style={{ fontSize: 13 }}>I agree the Terms and Conditions of the agreement</span>
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

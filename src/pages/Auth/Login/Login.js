import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './login.scss'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../../Config/firebase';
import { AuthContext } from '../../../context/AuthContext';


const initialState = { email: '', password: '' }

export default function Login() {
  const [state, setState] = useState(initialState)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useContext(AuthContext)
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState(s => ({ ...s, [name]: value }))

  }
  const handleLogin = (e) => {
    e.preventDefault();

    const { email, password } = state;

    setIsLoading(true)
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        dispatch({ type: "LOGIN", payload: { user } })
        console.log('user is sign in')
        navigate("/")
        window.toastify('User is sign in successfully', 'success')
        setIsLoading(false)
        // ...
      })
      .catch((err) => {
        console.log(err.message)
        window.toastify('Something got error while login', 'error')
        setIsLoading(false)
      });


  }


  return (
    <div className="login">
      <div className="container">
        <div className="row">
          <div className="col">
            <div class="card mx-auto" >
              <div className="logo bg-white mx-auto" >
                <AccountCircleIcon style={{ fontSize: 35, marginLeft: 20, marginRight: 20, marginTop: 20, marginBottom: 20, }} className=' mt-3' />
              </div>
              <h5 className='text-center fw-bold text-white mt-2'>Member Login</h5>
              <div class="card-body">
                <div class="input-group mb-2 ">
                  <span class="input-group-text bg-transparent border-0 " id="basic-addon1"><PersonIcon className='text-white' /></span>
                  <input type="email" name='email' class="form-control bg-transparent border-0 text-white " placeholder="Email" aria-label="Username" aria-describedby="basic-addon1" onChange={handleChange} />
                </div>
                <div class="input-group mb-4">
                  <span class="input-group-text bg-transparent border-0 " id="basic-addon1"><LockIcon className='text-white' /></span>
                  <input type="password" name='password' class="form-control bg-transparent border-0 text-white" placeholder="Password" aria-label="Password" aria-describedby="basic-addon1" onChange={handleChange} />
                </div>
                <div className="button text-center">
                  <button class="btn mb-3 px-4 py-2" onClick={handleLogin} disabled={isLoading} >
                    {
                      !isLoading ?
                        'Login' :
                        <div className="spinner-border spinner-border-sm"></div>
                    }
                  </button>
                </div>
                <div className="security d-flex justify-content-between mb-5 text-white">
                  <div className="policy ">
                    <input type="checkbox" name="remember" id="remember" />
                    <span className='ms-1'>Remember</span>
                  </div>
                  <Link to='/auth/forgot-password' className='text-decoration-none text-white'>Forgot Password</Link>
                </div>
                <div className='text-center text-white'>
                  <Link to='/auth/register' className='text-decoration-none text-white'>Create Your Account</Link>
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

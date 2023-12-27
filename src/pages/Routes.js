import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Frontend from './Frontend'
import Auth from './Auth'
import { AuthContext } from '../context/AuthContext'
import PrivateRoute from '../components/PrivateRoute/PrivateRoute'
export default function Index() {
    const { isAuthenticated, } = useContext(AuthContext)
    return (
        <>
            <Routes>
                <Route path='/*' element={<PrivateRoute Component={Frontend} />} />
                <Route path='/auth/*' element={!isAuthenticated ? <Auth/> : <Navigate to='/'/>} />
            </Routes>
        </>
    )
}

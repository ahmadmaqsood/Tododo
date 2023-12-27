import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function PrivateRoute(props) {

    const { isAuthenticated } = useContext(AuthContext)
    const { Component } = props

    if (isAuthenticated)
        return <Component/>

    return(
    <Navigate to='/auth/login' />
    )
}

import { useEffect, useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import axios from 'axios'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'

const PublicRoute = () => {
    const [auth, setAuth] = useState(null)

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_URL}/auth/status`, { withCredentials: true })
            .then(res => setAuth(res.data.authenticated))
            .catch(() => setAuth(false))
    }, [])

    if (auth === null) return <LoadingSpinner />
    if (auth === true) return <Navigate to="/modulos" replace />

    return <Outlet />
}

export default PublicRoute
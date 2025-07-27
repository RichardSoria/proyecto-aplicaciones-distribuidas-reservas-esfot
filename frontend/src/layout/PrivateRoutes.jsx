import { Outlet, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import usePerfil from '../hooks/usePerfil'
import { set } from '../store'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'

const PrivateRoutes = () => {
    const [auth, setAuth] = useState(null)
    const { consultarPerfil } = usePerfil()
    const dispatch = useDispatch()

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/auth/status`, { withCredentials: true })
            .then(res => {
                setAuth(res.data.authenticated)
                if (res.data.authenticated) {
                    dispatch(set({ user: res.data.user }))
                    return consultarPerfil(res.data.user.rol)
                } else {
                    dispatch(set({ user: null }))
                }
            })
            .catch(() => {
                setAuth(false)
                dispatch(set({ user: null }))
            })
    }, [dispatch, consultarPerfil])

    if (auth === null) return <LoadingSpinner />
    if (auth === false) return <Navigate to="/iniciar-sesion" replace />

    return <Outlet />
}

export default PrivateRoutes

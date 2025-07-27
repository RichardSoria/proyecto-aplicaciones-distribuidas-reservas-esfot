// src/App.jsx
import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useRef } from 'react'

import { ToastContainer } from 'react-toastify'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner'

// Estilos globales
import './scss/style.scss'
import './scss/examples.scss'

// Páginas públicas
const Login = React.lazy(() => import('./views/pages/login/Login'))
const RecoverPassword = React.lazy(() => import('./views/pages/recover-password/RecoverPassword'))
const VerifyToken = React.lazy(() => import('./views/pages/verfiy-token/VerfiyToken'))

// Rutas públicas y privadas
const PublicRoutes = React.lazy(() => import('./layout/PublicRoutes'))
const PrivateRoutes = React.lazy(() => import('./layout/PrivateRoutes'))

// Layout protegido y páginas internas
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))


const AppRoutes = () => {
  const location = useLocation()
  const prevLocation = useRef(location.pathname)

  useEffect(() => {
    const from = prevLocation.current
    const to = location.pathname
    prevLocation.current = to

    if (from === '/iniciar-sesion' && to === '/modulos') {
      const timer = setTimeout(() => {
        toast.dismiss()
      }, 5000)
      return () => clearTimeout(timer)
    } else if (to === '/iniciar-sesion') {
      const timer = setTimeout(() => {
        toast.dismiss()
      }, 5000)
      return () => clearTimeout(timer)
    }

    toast.dismiss()
  }, [location])


  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Rutas públicas */}
          <Route element={<PublicRoutes />}>
            <Route path="/" element={<Navigate to="/iniciar-sesion" replace />} />
            <Route path="/iniciar-sesion" element={<Login />} />
            <Route path="/recuperar-contrasena" element={<RecoverPassword />} />
            <Route path="/enviar-contrasena-recuperacion/:token" element={<VerifyToken />} />
          </Route>

          {/* Rutas protegidas */}
          <Route element={<PrivateRoutes />}>
            <Route path="/*" element={<DefaultLayout />}>
            </Route>
          </Route>
        </Routes>
      </Suspense>

      {/* ToastContainer global para notificaciones */}
      <ToastContainer position="top-right" />
    </>
  )
}

export default AppRoutes
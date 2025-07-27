/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import axios from 'axios'
import {
    CButton,
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CContainer,
    CForm,
    CRow,
    CAlertLink,
} from '@coreui/react'
import { toast } from 'react-toastify'

const VerfiyToken = () => {
    const { token } = useParams()
    const [showButtonPassword, setShowButtonPassword] = useState(false)

    const verifyToken = async () => {
        const roles = ['admin', 'docente', 'estudiante']

        for (const rol of roles) {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/${rol}/verify-token/${token}`
                )
                toast.success(response.data.message, { autoClose: 4000 })
                setShowButtonPassword(true)
                return // si uno funciona, sale del ciclo
            } catch (error) {
                if (rol === roles[roles.length - 1]) {
                    const msg =
                        error.response?.data?.message || 'Error al verificar el token'
                    toast.error(msg, { autoClose: 5000 })
                }
            }
        }
    }

    const sendRecoverEmail = async () => {
        const roles = ['admin', 'docente', 'estudiante']

        for (const rol of roles) {
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/${rol}/send-recover-password/${token}`
                )
                toast.info(response.data.message, { autoClose: 4000 })
                return // si uno funciona, sale del ciclo
            } catch (error) {
                if (rol === roles[roles.length - 1]) {
                    const msg =
                        error.response?.data?.message || 'Error al enviar correo de recuperación'
                    toast.warn(msg, { autoClose: 5000 })
                }
            }
        }
    }

    useEffect(() => {
        verifyToken()
    }, [])

    return (
        <div className="bg-esfot min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol lg={5} md={9} >
                        <CCardGroup>
                            <CCard className="p-4 bg-white">
                                <CCardBody>
                                    <CForm>
                                        <CRow>
                                            <CCol md={12} className="text-center">
                                                <h1 className="titulos-esfot">Recuperar Contraseña</h1>
                                                <p className="subtitulos-esfot">
                                                    Sistema de Gestión de Reservas de Aulas y Laboratorios
                                                </p>
                                            </CCol>
                                            <CCol
                                                md={12}
                                                className="text-center mb-3"
                                            >
                                                <img
                                                    src="https://esfot.epn.edu.ec/images/logo_esfot_buho.png"
                                                    alt="Logo"
                                                    style={{ width: '50%', maxWidth: '200px', height: 'auto' }}
                                                />
                                            </CCol>
                                        </CRow>
                                        <CRow>
                                            <CCol md={12} className="text-center">
                                                {showButtonPassword && (
                                                    <CButton
                                                        onClick={sendRecoverEmail}
                                                        className="btn-esfot px-4 mb-3"
                                                    >
                                                        Enviar Contraseña de Recuperación
                                                    </CButton>
                                                )}
                                            </CCol>
                                            <CCol
                                                md={12}
                                                className={'text-center'}
                                            >
                                                <CButton
                                                    color="link"
                                                    className="px-0 text-secondary"
                                                    to={`${showButtonPassword ? '/' : '/recuperar-contrasena'}`}
                                                    as={NavLink}
                                                >
                                                    {showButtonPassword
                                                        ? '¿Recuperaste tu contraseña? Iniciar sesión'
                                                        : '¿No puedes verificar tu enlace de recuperación? Enviar correo de recuperación'}
                                                </CButton>
                                            </CCol>
                                        </CRow>
                                    </CForm>
                                </CCardBody>
                            </CCard>
                        </CCardGroup>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}

export default VerfiyToken

import React from 'react'
import { useForm } from 'react-hook-form'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import ajvErrors from 'ajv-errors'
import { recoverPasswordSchema } from '../../../validations/authenticationSchema.jsx'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import {
    CButton,
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CContainer,
    CForm,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CRow,
    CFormSelect,
} from '@coreui/react'
import { Mail, User } from 'lucide-react'
import { toast } from 'react-toastify'

const ajv = new Ajv({ allErrors: true })
addFormats(ajv)
ajvErrors(ajv)
const validate = ajv.compile(recoverPasswordSchema)

const RecoverPassword = () => {
    const {
        register,
        handleSubmit,
        setError,
        watch,
        formState: { errors },
    } = useForm()

    const watchedFields = watch()

    React.useEffect(() => {
        if (watchedFields.email || watchedFields.role) {
            // Opcional: limpiar errores si quieres
        }
    }, [watchedFields.email, watchedFields.role])

    React.useEffect(() => {
        Object.values(errors).forEach((err) => {
            toast.error(err.message)
        })
    }, [errors])

    const onSubmit = async (data) => {
        const valid = validate(data)
        if (!valid) {
            validate.errors.forEach((err) => {
                const field = err.instancePath.replace('/', '') || err.params.missingProperty
                setError(field, { type: 'manual', message: err.message })
            })
            return
        }

        try {
            let response
            if (data.role === 'admin') {
                response = await axios.post(`${import.meta.env.VITE_API_URL}/admin/recover-password`, data)
            } else if (data.role === 'docente') {
                response = await axios.post(`${import.meta.env.VITE_API_URL}/docente/recover-password`, data)
            } else if (data.role === 'estudiante') {
                response = await axios.post(`${import.meta.env.VITE_API_URL}/estudiante/recover-password`, data)
            }
            toast.success(response.data.message)
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al enviar el correo de recuperación')
        }
    }

    return (
        <div className="bg-esfot min-vh-100 d-flex flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol lg={5} md={9} >
                        <CCardGroup>
                            <CCard className="p-4 bg-white">
                                <CCardBody>
                                    <CForm onSubmit={handleSubmit(onSubmit)}>
                                        <CRow>
                                            <CCol md={12} className="text-center">
                                                <h1 className="titulos-esfot">Enviar Correo de Recuperación</h1>
                                                <p className="subtitulos-esfot">
                                                    Sistema de Gestión de Reservas de Aulas y Laboratorios
                                                </p>
                                            </CCol>
                                            <CCol md={12} className="text-center mb-3">
                                                <img
                                                    src="https://esfot.epn.edu.ec/images/logo_esfot_buho.png"
                                                    alt="Logo"
                                                    style={{ width: '50%', maxWidth: '200px', height: 'auto' }}
                                                />
                                            </CCol>
                                        </CRow>

                                        <CInputGroup className={`mb-3 ${errors.email ? 'is-invalid' : ''}`}>
                                            <CInputGroupText
                                                className={`bg-secondary border-secondary ${errors.email ? 'border-danger bg-danger' : 'text-white bg-esfot'
                                                    }`}
                                            >
                                                <Mail className={`${errors.email ? 'text-white' : ''}`} />
                                            </CInputGroupText>
                                            <CFormInput
                                                placeholder="Correo Electrónico"
                                                autoComplete="email"
                                                className={`border-secondary text-secondary custom-input ${errors.email ? 'border-danger' : ''
                                                    }`}
                                                invalid={!!errors.email}
                                                {...register('email')}
                                            />
                                        </CInputGroup>

                                        <CInputGroup className={`mb-4 ${errors.role ? 'is-invalid' : ''}`}>
                                            <CInputGroupText
                                                className={`bg-secondary border-secondary ${errors.role ? 'border-danger bg-danger' : 'text-white bg-esfot'
                                                    }`}
                                            >
                                                <User className={`${errors.role ? 'text-white' : ''}`} />
                                            </CInputGroupText>
                                            <CFormSelect
                                                className={`border-secondary text-secondary custom-input ${errors.role ? 'border-danger' : ''
                                                    }`}
                                                invalid={!!errors.role}
                                                {...register('role')}
                                            >
                                                <option value="">Selecciona un rol</option>
                                                <option value="admin">Administrador</option>
                                                <option value="docente">Docente</option>
                                                <option value="estudiante">Estudiante</option>
                                            </CFormSelect>
                                        </CInputGroup>

                                        <CRow>
                                            <CCol md={12} className="text-center">
                                                <CButton type="submit" className="btn-esfot px-4">
                                                    Enviar Correo de Recuperación
                                                </CButton>
                                            </CCol>
                                            <CCol md={12} className="text-center mt-3">
                                                <CButton color="link" className="px-0 text-secondary" to="/" as={NavLink}>
                                                    ¿Recordaste tu contraseña? Iniciar sesión
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

export default RecoverPassword

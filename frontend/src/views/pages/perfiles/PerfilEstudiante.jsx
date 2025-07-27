import { useSelector } from 'react-redux'
import {
    CCard,
    CCardBody,
    CRow,
    CCol,
    CBadge,
    CFormInput,
    CButton,
    CForm,
    CInputGroup,
    CInputGroupText,
} from '@coreui/react'
import avatarDefault from '../../../assets/images/avatar.svg'
import { passwordUpdateSchema } from '../../../validations/passwordUpdateSchema'
import { useForm } from 'react-hook-form'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import ajvErrors from 'ajv-errors'
import React from 'react'
import axios from 'axios'
import { LockKeyhole, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { LoadingModal } from '../../../components/modals/LoadingModal'
import { ConfirmModal } from '../../../components/modals/ConfirmModal'
import { toast } from 'react-toastify'
import { Navigate } from 'react-router-dom'

const ajv = new Ajv({ allErrors: true })
addFormats(ajv)
ajvErrors(ajv)
const validate = ajv.compile(passwordUpdateSchema)

const PerfilDocente = () => {
    const { perfil } = useSelector((state) => state)

    const defaultValues = {
        password: '',
        confirmPassword: ''
    }

    const {
        register,
        handleSubmit,
        setError,
        watch,
        reset,
        formState: { errors },
    } = useForm({ defaultValues })

    const [generalMessage, setGeneralMessage] = React.useState('')
    const [showPassword, setShowPassword] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [isLoadingMessage, setIsLoadingMessage] = React.useState('Cargando...')
    const [confirmVisible, setConfirmVisible] = React.useState(false)
    const [pendingAction, setPendingAction] = React.useState(null)

    const watchedFields = watch()

    React.useEffect(() => {
        if (watchedFields.password || watchedFields.confirmPassword) {
            setGeneralMessage('')
        }
    }, [watchedFields.password, watchedFields.confirmPassword])

    React.useEffect(() => {
        Object.values(errors).forEach((err) => {
            toast.error(err.message, { autoClose: 4000 })
        })
    }, [errors])

    React.useEffect(() => {
        if (generalMessage) {
            toast.error(generalMessage, {
                autoClose: 5000,
                onClose: () => setGeneralMessage(''),
            })
        }
    }, [generalMessage])

    const resetForm = () => {
        reset(defaultValues)
    }

    const updatePassword = async (data) => {
        try {
            setIsLoading(true)
            setIsLoadingMessage('Actualizando contraseña...')
            await axios.put(`${import.meta.env.VITE_API_URL}/estudiante/update-password`, data, {
                withCredentials: true,
            })
            toast.success('Contraseña actualizada correctamente')
            resetForm()
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al actualizar la contraseña'
            setGeneralMessage(msg)
        } finally {
            setIsLoading(false)
        }
    }

    const onPasswordSubmit = (data) => {
        const valid = validate(data)
        if (!valid) {
            validate.errors.forEach((err) => {
                const field = err.instancePath.replace('/', '')
                setError(field, { type: 'manual', message: err.message })
            })
            return
        }
        setPendingAction(() => () => updatePassword(data))
        setConfirmVisible(true)
    }

    const handleConfirm = () => {
        if (pendingAction) pendingAction()
        setConfirmVisible(false)
        setPendingAction(null)
    }

    const handleCancel = () => {
        setConfirmVisible(false)
        setPendingAction(null)
    }

    if (!perfil) return <Navigate to="/modulos" replace />

    return (
        <CCard className="shadow-sm border-0">
            <CCardBody>
                <div className="mb-3 ms-3 me-3">
                    <h1 className="text-4xl textos-esfot">Perfil Estudiante</h1>
                    <hr />
                    <p className="text-muted">Visualiza a detalle tu información personal y académica.</p>
                </div>

                <CRow className="ms-3 me-3">
                    <CCol md={2} className="d-flex flex-column align-items-center justify-content-center text-center">
                        <img src={avatarDefault} alt="Avatar" className="rounded-circle mb-3" width={200} height={200} />
                    </CCol>

                    <CCol md={3}>
                        <h5 className="subtitulos-esfot mb-3">Datos Personales</h5>
                        <p><strong>Nombre:</strong> {perfil.name}</p>
                        <p><strong>Apellido:</strong> {perfil.lastName}</p>
                        <p><strong>Cédula:</strong> {perfil.cedula}</p>
                        <p><strong>Correo:</strong> {perfil.email}</p>
                        <p><strong>Teléfono:</strong> {perfil.phone}</p>
                        <p><strong>Carrera:</strong> {perfil.career || 'No especificado'}</p>
                    </CCol>

                    <CCol md={3}>
                        <h5 className="subtitulos-esfot mb-3">Información de Cuenta</h5>
                        <p><strong>Estado:</strong>{' '}
                            <CBadge color={perfil.status ? 'success' : 'danger'}>
                                {perfil.status ? 'Habilitado' : 'Deshabilitado'}
                            </CBadge>
                        </p>
                        <p><strong>Rol:</strong> {perfil.rol ? 'Estudiante' : ''}</p>
                    </CCol>

                    <ConfirmModal
                        visible={confirmVisible}
                        onClose={handleCancel}
                        onConfirm={handleConfirm}
                        title={'Cambiar Contraseña'}
                        message={'¿Estás seguro de que deseas cambiar tu contraseña?'}
                    />

                    <LoadingModal visible={isLoading} message={isLoadingMessage} />

                    <CCol md={4}>
                        <h5 className="subtitulos-esfot mb-3">Cambiar Contraseña</h5>
                        <CForm onSubmit={handleSubmit(onPasswordSubmit)}>
                            <CInputGroup className={`mb-3 ${errors.password ? 'is-invalid' : ''}`}>
                                <CInputGroupText className={`bg-secondary border-secondary ${errors.password ? 'border-danger bg-danger' : 'text-white bg-esfot'}`}>
                                    <LockKeyhole className={`${errors.password ? 'text-white' : ''}`} />
                                </CInputGroupText>
                                <CFormInput
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Contraseña"
                                    autoComplete="current-password"
                                    className={`border-secondary text-secondary custom-input ${errors.password ? 'border-danger' : ''}`}
                                    invalid={!!errors.password}
                                    {...register('password')}
                                />
                                <CInputGroupText
                                    className={`bg-secondary border-secondary ${errors.password ? 'border-danger bg-danger' : 'text-white bg-esfot'}`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? <EyeOff className={`${errors.password ? 'text-white' : ''}`} /> : <Eye className={`${errors.password ? 'text-white' : ''}`} />}
                                </CInputGroupText>
                            </CInputGroup>

                            <CInputGroup className={`mb-3 ${errors.confirmPassword ? 'is-invalid' : ''}`}>
                                <CInputGroupText className={`bg-secondary border-secondary ${errors.confirmPassword ? 'border-danger bg-danger' : 'text-white bg-esfot'}`}>
                                    <LockKeyhole className={`${errors.confirmPassword ? 'text-white' : ''}`} />
                                </CInputGroupText>
                                <CFormInput
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Confirmar Contraseña"
                                    autoComplete="current-password"
                                    className={`border-secondary text-secondary custom-input ${errors.confirmPassword ? 'border-danger' : ''}`}
                                    invalid={!!errors.confirmPassword}
                                    {...register('confirmPassword')}
                                />
                                <CInputGroupText
                                    className={`bg-secondary border-secondary ${errors.confirmPassword ? 'border-danger bg-danger' : 'text-white bg-esfot'}`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? <EyeOff className={`${errors.confirmPassword ? 'text-white' : ''}`} /> : <Eye className={`${errors.confirmPassword ? 'text-white' : ''}`} />}
                                </CInputGroupText>
                            </CInputGroup>

                            <CButton type="submit" className="btn-esfot-form w-100 fs-5 py-2">
                                <ShieldCheck className="me-2" />
                                Cambiar contraseña
                            </CButton>
                        </CForm>
                    </CCol>
                </CRow>
            </CCardBody>
        </CCard>
    )
}

export default PerfilDocente

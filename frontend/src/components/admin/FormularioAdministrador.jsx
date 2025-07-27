/* eslint-disable react-hooks/exhaustive-deps */

import React from 'react'
import { useForm } from 'react-hook-form'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import ajvErrors from 'ajv-errors'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { set } from '../../store'
import { limpiarSeleccionados } from '../../store'
import { adminSchema } from '../../validations/adminSchema'
import { CButton, CCard, CCardBody, CCol, CContainer, CForm, CFormInput, CInputGroup, CInputGroupText, CRow } from '@coreui/react'
import {
    FileUser,
    BookUser,
    Mail,
    Fingerprint,
    Smartphone,
    UserPlus,
    UserPen,
    UserCheck,
    UserX,
    Eraser,
} from 'lucide-react'
import useAdministrador from '../../hooks/useAdministrador'
import { ConfirmModal } from '../modals/ConfirmModal'
import { LoadingModal } from '../modals/LoadingModal'


const ajv = new Ajv({ allErrors: true })
addFormats(ajv)
ajvErrors(ajv)
const validate = ajv.compile(adminSchema)


const FormularioAdministrador = () => {

    // Hooks y estados

    const dispatch = useDispatch()
    const { listarAdministradores } = useAdministrador()
    const { administradorSeleccionado } = useSelector(state => state)
    const [confirmVisible, setConfirmVisible] = React.useState(false)
    const [pendingAction, setPendingAction] = React.useState(null)
    const [operation, setOperation] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false);
    const [isLoadingMessage, setIsLoadingMessage] = React.useState('Cargando...')

    // Manejo de eventos para campos numéricos
    const handleNumericKeyDown = (e) => {
        const invalidChars = ['e', 'E', '+', '-', '.'];
        const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End', 'ArrowLeft', 'ArrowRight'];

        if (allowedKeys.includes(e.key)) return;
        if (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) return;

        if (invalidChars.includes(e.key) || !/^[0-9]$/.test(e.key)) {
            e.preventDefault();
        }
    };

    // Configuración del formulario
    const defaultAdminValues = {
        name: '',
        lastName: '',
        email: '',
        cedula: '',
        phone: ''
    }
    
    const {
        register, handleSubmit, setError, reset, watch,
        formState: { errors }
    } = useForm({
        defaultValues: defaultAdminValues
    })

    const fullNameForm = `${watch('name') || ''} ${watch('lastName') || ''}`.trim()
    const fullNameAdmin = `${administradorSeleccionado?.name || ''} ${administradorSeleccionado?.lastName || ''}`.trim()


    // Validación de errores

    const validateForm = (data) => {
        const valid = validate(data)
        if (!valid) {
            validate.errors.forEach(err => {
                const field = err.instancePath.replace('/', '')
                setError(field, { type: 'manual', message: err.message })
            })
            return false
        }
        return true
    }

    // Función para limpiar el formulario

    React.useEffect(() => {
        dispatch(limpiarSeleccionados())
    }, [])

    // Cargar datos del administrador seleccionado al formulario

    React.useEffect(() => {
        if (administradorSeleccionado) {
            const { name, lastName, email, cedula, phone } = administradorSeleccionado
            reset({ name, lastName, email, cedula: cedula != null ? String(cedula) : '', phone: phone != null ? String(phone) : '' })
        } else {
            reset(defaultAdminValues)
        }
    }, [administradorSeleccionado, reset])

    // Mostrar errores de validación

    React.useEffect(() => {
        Object.entries(errors).forEach(([field, error]) => {
            toast.error(error.message, { autoClose: 4000 })
        })
    }, [errors])

    // Funciones de confirmación

    const showConfirm = (operation, action) => {
        setOperation(operation)
        setPendingAction(() => action)
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

    // Funciones de envío

    const onSubmitRegister = async (data) => {
        if (!validateForm(data)) {
            return
        }

        try {
            setIsLoadingMessage('Creando administrador...')
            setIsLoading(true)
            await axios.post(`${import.meta.env.VITE_API_URL}/admin/register`, data, { withCredentials: true })
            await listarAdministradores()
            toast.success('¡Administrador registrado con éxito!')
            resetForm()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al registrar administrador', { autoClose: 5000 })
        } finally {
            setIsLoading(false)
        }
    }

    const onSubmitUpdate = async (data) => {
        if (!administradorSeleccionado) {
            toast.error('Debe seleccionar un administrador para actualizar', { autoClose: 4000 })
            return
        }
        if (!validateForm(data)) {
            return
        }

        try {
            setIsLoadingMessage('Actualizando administrador...')
            setIsLoading(true)
            await axios.put(`${import.meta.env.VITE_API_URL}/admin/update/${administradorSeleccionado._id}`, data, { withCredentials: true })
            await listarAdministradores()
            toast.success('¡Administrador actualizado con éxito!')
            resetForm()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al actualizar administrador', { autoClose: 5000 })
        } finally {
            setIsLoading(false)
        }
    }

    const onSubmitEnable = async () => {
        if (!administradorSeleccionado) {
            toast.error('Debe seleccionar un administrador para habilitar', { autoClose: 4000 })
            return
        }
        if (administradorSeleccionado.status) {
            toast.error('El administrador ya está habilitado', { autoClose: 4000 })
            return
        }
        try {
            setIsLoadingMessage('Habilitando administrador...')
            setIsLoading(true)
            await axios.put(`${import.meta.env.VITE_API_URL}/admin/enable/${administradorSeleccionado._id}`, {}, { withCredentials: true })
            await listarAdministradores()
            toast.success('¡Administrador habilitado con éxito!')
            resetForm()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al habilitar administrador', { autoClose: 5000 })
        } finally {
            setIsLoading(false)
        }
    }

    const onSubmitDisable = async () => {
        if (!administradorSeleccionado) {
            toast.error('Debe seleccionar un administrador para deshabilitar', { autoClose: 4000 })
            return
        }
        if (!administradorSeleccionado.status) {
            toast.error('El administrador ya está deshabilitado', { autoClose: 4000 })
            return
        }
        try {
            setIsLoadingMessage('Deshabilitando administrador...')
            setIsLoading(true)
            await axios.put(`${import.meta.env.VITE_API_URL}/admin/disable/${administradorSeleccionado._id}`, {}, { withCredentials: true })
            await listarAdministradores()
            toast.success('¡Administrador deshabilitado con éxito!')
            resetForm()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al deshabilitar administrador', { autoClose: 5000 })
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        reset(defaultAdminValues)
        dispatch(set({ administradorSeleccionado: null }))
    }

    // Texto del modal de confirmación

    const getModalText = () => {
        switch (operation) {
            case 'create':
                return {
                    title: 'Registrar Administrador',
                    message: `¿Deseas registrar al nuevo administrador ${fullNameForm}?`
                };
            case 'update':
                return {
                    title: 'Actualizar Administrador',
                    message: `¿Deseas actualizar la información del administrador ${fullNameAdmin}?`
                };
            case 'enable':
                return {
                    title: 'Habilitar Administrador',
                    message: `¿Deseas habilitar al administrador ${fullNameAdmin}?`
                };
            case 'disable':
                return {
                    title: 'Deshabilitar Administrador',
                    message: `¿Deseas deshabilitar al administrador ${fullNameAdmin}?`
                };
            default:
                return {
                    title: 'Confirmar Acción',
                    message: '¿Estás seguro de realizar esta acción?'
                };
        }
    };

    const { title, message } = getModalText()

    // Funciones de confirmación

    const confirmRegister = (data) => {
        if (!validateForm(data)) {
            return
        }
        showConfirm('create', () => onSubmitRegister(data))
    }

    const confirmUpdate = (data) => {
        if (!administradorSeleccionado) {
            toast.error('Debe seleccionar un administrador para actualizar', { autoClose: 4000 })
            return
        }
        if (!validateForm(data)) {
            return
        }
        showConfirm('update', () => onSubmitUpdate(data))
    }
    const confirmEnable = () => {
        if (!administradorSeleccionado) {
            toast.error('Debe seleccionar un administrador para habilitar', { autoClose: 4000 })
            return
        }
        if (administradorSeleccionado.status) {
            toast.error('El administrador ya está habilitado', { autoClose: 4000 })
            return
        }
        showConfirm('enable', onSubmitEnable)
    }
    const confirmDisable = () => {
        if (!administradorSeleccionado) {
            toast.error('Debe seleccionar un administrador para deshabilitar', { autoClose: 4000 })
            return
        }
        if (!administradorSeleccionado.status) {
            toast.error('El administrador ya está deshabilitado', { autoClose: 4000 })
            return
        }
        showConfirm('disable', onSubmitDisable)
    }

    return (
        <>
            <CContainer className="mb-3">
                <CRow className="justify-content-center">
                    <CCol>
                        <CCard className="border-0 shadow-sm">
                            <CCardBody>
                                <CForm className="row g-3">
                                    {/* Nombre */}
                                    <CCol md={6}>
                                        <CInputGroup className={`${errors.name ? 'is-invalid' : ''}`}>
                                            <CInputGroupText className={`${errors.name ? 'border-danger bg-danger' : 'text-white bg-esfot'}`}>
                                                <FileUser className={`${errors.name ? 'text-white' : ''}`} />
                                            </CInputGroupText>
                                            <CFormInput
                                                placeholder={errors.name ? errors.name.message : "Nombre"}
                                                className={`${errors.name ? 'border-danger text-danger' : ''}`}
                                                invalid={!!errors.name}
                                                {...register('name')}
                                            />
                                        </CInputGroup>
                                    </CCol>

                                    {/* Apellido */}
                                    <CCol md={6}>
                                        <CInputGroup className={`${errors.lastName ? 'is-invalid' : ''}`}>
                                            <CInputGroupText className={`${errors.lastName ? 'border-danger bg-danger' : 'text-white bg-esfot'}`}>
                                                <BookUser className={`${errors.lastName ? 'text-white' : ''}`} />
                                            </CInputGroupText>
                                            <CFormInput
                                                placeholder={errors.lastName ? errors.lastName.message : "Apellido"}
                                                className={`${errors.lastName ? 'border-danger text-danger' : ''}`}
                                                invalid={!!errors.lastName}
                                                {...register('lastName')}
                                            />
                                        </CInputGroup>
                                    </CCol>

                                    {/* Correo */}
                                    <CCol md={12}>
                                        <CInputGroup className={`${errors.email ? 'is-invalid' : ''}`}>
                                            <CInputGroupText className={`${errors.email ? 'border-danger bg-danger' : 'text-white bg-esfot'}`}>
                                                <Mail className={`${errors.email ? 'text-white' : ''}`} />
                                            </CInputGroupText>
                                            <CFormInput
                                                type="email"
                                                placeholder={errors.email ? errors.email.message : "Correo"}
                                                className={`${errors.email ? 'border-danger text-danger' : ''}`}
                                                invalid={!!errors.email}
                                                {...register('email')}
                                            />
                                        </CInputGroup>
                                    </CCol>

                                    {/* Cédula */}
                                    <CCol md={6}>
                                        <CInputGroup className={`${errors.cedula ? 'is-invalid' : ''}`}>
                                            <CInputGroupText className={`${errors.cedula ? 'border-danger bg-danger' : 'text-white bg-esfot'}`}>
                                                <Fingerprint className={`${errors.cedula ? 'text-white' : ''}`} />
                                            </CInputGroupText>
                                            <CFormInput
                                                type='number'
                                                placeholder={errors.cedula ? errors.cedula.message : "Cédula"}
                                                className={`${errors.cedula ? 'border-danger text-danger' : ''}`}
                                                invalid={!!errors.cedula}
                                                onKeyDown={handleNumericKeyDown}
                                                {...register('cedula')}
                                            />
                                        </CInputGroup>
                                    </CCol>

                                    {/* Teléfono */}
                                    <CCol md={6}>
                                        <CInputGroup className={`${errors.phone ? 'is-invalid' : ''}`}>
                                            <CInputGroupText className={`${errors.phone ? 'border-danger bg-danger' : 'text-white bg-esfot'}`}>
                                                <Smartphone className={`${errors.phone ? 'text-white' : ''}`} />
                                            </CInputGroupText>
                                            <CFormInput
                                                type='number'
                                                placeholder={errors.phone ? errors.phone.message : "Teléfono"}
                                                className={`${errors.phone ? 'border-danger text-danger' : ''}`}
                                                invalid={!!errors.phone}
                                                onKeyDown={handleNumericKeyDown}
                                                {...register('phone')}
                                            />
                                        </CInputGroup>
                                    </CCol>

                                    {/* Modal de confirmación */}
                                    <ConfirmModal
                                        visible={confirmVisible}
                                        onClose={handleCancel}
                                        onConfirm={handleConfirm}
                                        title={title}
                                        message={message}
                                    />

                                    {/* Modal de carga */}
                                    <LoadingModal
                                        visible={isLoading}
                                        message={isLoadingMessage}
                                    />

                                    {/* Botones */}
                                    <CCol className="d-flex flex-wrap justify-content-between gap-1 mt-3">
                                        <div className="flex-fill text-center">
                                            <CButton type="button" className="btn-esfot-form w-100 fs-6 py-3" onClick={handleSubmit(confirmRegister)} >
                                                <UserPlus className="me-2" />
                                                Crear Administrador
                                            </CButton>
                                        </div>

                                        <div className="flex-fill text-center">
                                            <CButton type="button" className="btn-esfot-form w-100 fs-6 py-3" onClick={handleSubmit(confirmUpdate)}>
                                                <UserPen className="me-2" />
                                                Actualizar Administrador
                                            </CButton>
                                        </div>

                                        <div className="flex-fill text-center">
                                            <CButton type="button" className="btn-esfot-form w-100 fs-6 py-3" onClick={confirmEnable} >
                                                <UserCheck className="me-2" />
                                                Habilitar Administrador
                                            </CButton>
                                        </div>

                                        <div className="flex-fill text-center">
                                            <CButton type="button" className="btn-esfot-form w-100 fs-6 py-3" onClick={confirmDisable}>
                                                <UserX className="me-2" />
                                                Deshabilitar Administrador
                                            </CButton>
                                        </div>

                                        <div className="flex-fill text-center">
                                            <CButton type="button" className="btn-esfot-form w-100 fs-6 py-3" onClick={resetForm}>
                                                <Eraser className="me-2" />
                                                Limpiar Formulario
                                            </CButton>
                                        </div>
                                    </CCol>

                                </CForm>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>
        </>
    )
}

export default FormularioAdministrador
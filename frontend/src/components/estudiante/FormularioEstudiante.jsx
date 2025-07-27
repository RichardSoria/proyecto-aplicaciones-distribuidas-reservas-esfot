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
import { estudianteSchema } from '../../validations/estudianteSchema'
import { CButton, CCard, CCardBody, CCol, CContainer, CForm, CFormInput, CInputGroup, CInputGroupText, CRow, CFormSelect } from '@coreui/react'
import {
    FileUser,
    BookUser,
    Mail,
    Fingerprint,
    Smartphone,
    GraduationCap,
    CalendarClock,
    UserPlus,
    UserPen,
    UserCheck,
    UserX,
    Eraser,
} from 'lucide-react'
import useEstudiante from '../../hooks/useEstudiante'
import { ConfirmModal } from '../modals/ConfirmModal'
import { LoadingModal } from '../modals/LoadingModal'


const ajv = new Ajv({ allErrors: true })
addFormats(ajv)
ajvErrors(ajv)
const validate = ajv.compile(estudianteSchema)


const FormularioEstudiante = () => {

    // Hooks y estados

    const dispatch = useDispatch()
    const { estudianteSeleccionado } = useSelector(state => state)
    const { listarEstudiantes } = useEstudiante()
    const [confirmVisible, setConfirmVisible] = React.useState(false)
    const [pendingAction, setPendingAction] = React.useState(null)
    const [operation, setOperation] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false);
    const [isLoadingMessage, setIsLoadingMessage] = React.useState('Cargando...')

    // Manejadores de eventos para evitar caracteres no numéricos en campos específicos
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
    const defaultEstudianteValues = {
        name: '',
        lastName: '',
        email: '',
        cedula: '',
        phone: '',
        career: ''
    }

    const {
        register, handleSubmit, setError, reset, watch,
        formState: { errors }
    } = useForm({
        defaultValues: defaultEstudianteValues,
    })

    const fullNameForm = `${watch('name') || ''} ${watch('lastName') || ''}`.trim()
    const fullNameEstudiante = `${estudianteSeleccionado?.name || ''} ${estudianteSeleccionado?.lastName || ''}`.trim()


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
        if (estudianteSeleccionado) {
            const { name, lastName, email, cedula, phone, career } = estudianteSeleccionado
            reset({ name, lastName, email, cedula, phone, career })
        } else {
            reset(defaultEstudianteValues)
        }
    }, [estudianteSeleccionado, reset])

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
            setIsLoadingMessage('Creando estudiante...')
            setIsLoading(true)
            await axios.post(`${import.meta.env.VITE_API_URL}/estudiante/register`, data, { withCredentials: true })
            await listarEstudiantes()
            toast.success('Estudiante registrado con éxito!')
            resetForm()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al registrar estudiante', { autoClose: 5000 })
        } finally {
            setIsLoading(false)
        }
    }

    const onSubmitUpdate = async (data) => {
        if (!estudianteSeleccionado) {
            toast.error('Debe seleccionar un estudiante para actualizar', { autoClose: 4000 })
            return
        }
        if (!validateForm(data)) {
            return
        }

        try {
            setIsLoadingMessage('Actualizando estudiante...')
            setIsLoading(true)
            await axios.put(`${import.meta.env.VITE_API_URL}/estudiante/update/${estudianteSeleccionado._id}`, data, { withCredentials: true })
            await listarEstudiantes()
            toast.success('Estudiante actualizado con éxito!')
            resetForm()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al actualizar Estudiante', { autoClose: 5000 })
        } finally {
            setIsLoading(false)
        }
    }

    const onSubmitEnable = async () => {
        if (!estudianteSeleccionado) {
            toast.error('Debe seleccionar un estudiante para habilitar', { autoClose: 4000 })
            return
        }
        if (estudianteSeleccionado.status) {
            toast.error('El estudiante ya está habilitado', { autoClose: 4000 })
            return
        }
        try {
            setIsLoadingMessage('Habilitando estudiante...')
            setIsLoading(true)
            await axios.put(`${import.meta.env.VITE_API_URL}/estudiante/enable/${estudianteSeleccionado._id}`, {}, { withCredentials: true })
            await listarEstudiantes()
            toast.success('Estudiante habilitado con éxito!')
            resetForm()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al habilitar estudiante', { autoClose: 5000 })
        } finally {
            setIsLoading(false)
        }
    }

    const onSubmitDisable = async () => {
        if (!estudianteSeleccionado) {
            toast.error('Debe seleccionar un estudiante para deshabilitar', { autoClose: 4000 })
            return
        }
        if (!estudianteSeleccionado.status) {
            toast.error('El estudiante ya está deshabilitado', { autoClose: 4000 })
            return
        }
        try {
            setIsLoadingMessage('Deshabilitando estudiante...')
            setIsLoading(true)
            await axios.put(`${import.meta.env.VITE_API_URL}/estudiante/disable/${estudianteSeleccionado._id}`, {}, { withCredentials: true })
            await listarEstudiantes()
            toast.success('Estudiante deshabilitado con éxito!')
            resetForm()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al deshabilitar estudiante', { autoClose: 5000 })
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        reset(defaultEstudianteValues)
        dispatch(set({ estudianteSeleccionado: null }))
    }

    // Texto del modal de confirmación

    const getModalText = () => {
        switch (operation) {
            case 'create':
                return {
                    title: 'Registrar Estudiante',
                    message: `¿Deseas registrar al nuevo estudiante ${fullNameForm}?`
                };
            case 'update':
                return {
                    title: 'Actualizar Estudiante',
                    message: `¿Deseas actualizar la información del estudiante ${fullNameEstudiante}?`
                };
            case 'enable':
                return {
                    title: 'Habilitar Estudiante',
                    message: `¿Deseas habilitar al estudiante ${fullNameEstudiante}?`
                };
            case 'disable':
                return {
                    title: 'Deshabilitar Estudiante',
                    message: `¿Deseas deshabilitar al estudiante ${fullNameEstudiante}?`
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
        if (!estudianteSeleccionado) {
            toast.error('Debe seleccionar un estudiante para actualizar', { autoClose: 4000 })
            return
        }
        if (!validateForm(data)) {
            return
        }
        showConfirm('update', () => onSubmitUpdate(data))
    }

    const confirmEnable = () => {
        if (!estudianteSeleccionado) {
            toast.error('Debe seleccionar un estudiante para habilitar', { autoClose: 4000 })
            return
        }
        if (estudianteSeleccionado.status) {
            toast.error('El estudiante ya está habilitado', { autoClose: 4000 })
            return
        }
        showConfirm('enable', onSubmitEnable)
    }
    const confirmDisable = () => {
        if (!estudianteSeleccionado) {
            toast.error('Debe seleccionar un estudiante para deshabilitar', { autoClose: 4000 })
            return
        }
        if (!estudianteSeleccionado.status) {
            toast.error('El estudiante ya está deshabilitado', { autoClose: 4000 })
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
                                    <CCol md={4}>
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
                                    <CCol md={4}>
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


                                    {/* Cédula */}
                                    <CCol md={4}>
                                        <CInputGroup className={`${errors.cedula ? 'is-invalid' : ''}`}>
                                            <CInputGroupText className={`${errors.cedula ? 'border-danger bg-danger' : 'text-white bg-esfot'}`}>
                                                <Fingerprint className={`${errors.cedula ? 'text-white' : ''}`} />
                                            </CInputGroupText>
                                            <CFormInput
                                                placeholder={errors.cedula ? errors.cedula.message : "Cédula"}
                                                className={`${errors.cedula ? 'border-danger text-danger' : ''}`}
                                                onKeyDown={handleNumericKeyDown}
                                                invalid={!!errors.cedula}
                                                {...register('cedula')}
                                            />
                                        </CInputGroup>
                                    </CCol>

                                    {/* Teléfono */}
                                    <CCol md={3}>
                                        <CInputGroup className={`${errors.phone ? 'is-invalid' : ''}`}>
                                            <CInputGroupText className={`${errors.phone ? 'border-danger bg-danger' : 'text-white bg-esfot'}`}>
                                                <Smartphone className={`${errors.phone ? 'text-white' : ''}`} />
                                            </CInputGroupText>
                                            <CFormInput
                                                placeholder={errors.phone ? errors.phone.message : "Teléfono"}
                                                className={`${errors.phone ? 'border-danger text-danger' : ''}`}
                                                onKeyDown={handleNumericKeyDown}
                                                invalid={!!errors.phone}
                                                {...register('phone')}
                                            />
                                        </CInputGroup>
                                    </CCol>

                                    {/* Correo */}
                                    <CCol md={3}>
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

                                    {/* Carrera */}
                                    <CCol md={6}>
                                        <CInputGroup className={`${errors.career ? 'is-invalid' : ''}`}>
                                            <CInputGroupText className={`${errors.career ? 'border-danger bg-danger' : 'text-white bg-esfot'}`}>
                                                <GraduationCap className={`${errors.career ? 'text-white' : ''}`} />
                                            </CInputGroupText>
                                            <CFormSelect
                                                className={`${errors.career ? 'border-danger text-danger' : ''}`}
                                                invalid={!!errors.career}
                                                {...register('career')}
                                            >
                                                <option value="">{`${errors.career ? errors.career.message : 'Seleccione una carrera'}`}</option>
                                                <option value="Tecnología Superior en Agua y Saneamiento Ambiental">Tecnología Superior en Agua y Saneamiento Ambiental</option>
                                                <option value="Tecnología Superior en Desarrollo de Software">Tecnología Superior en Desarrollo de Software</option>
                                                <option value="Tecnología Superior en Electromecánica">Tecnología Superior en Electromecánica</option>
                                                <option value="Tecnología Superior en Redes y Telecomunicaciones">Tecnología Superior en Redes y Telecomunicaciones</option>
                                                <option value="Tecnología Superior en Procesamiento de Alimentos">Tecnología Superior en Procesamiento de Alimentos</option>
                                                <option value="Tecnología Superior en Procesamiento Industrial de la Madera">Tecnología Superior en Procesamiento Industrial de la Madera</option>
                                            </CFormSelect>
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
                                                Crear Estudiante
                                            </CButton>
                                        </div>

                                        <div className="flex-fill text-center">
                                            <CButton type="button" className="btn-esfot-form w-100 fs-6 py-3" onClick={handleSubmit(confirmUpdate)}>
                                                <UserPen className="me-2" />
                                                Actualizar Estudiante
                                            </CButton>
                                        </div>

                                        <div className="flex-fill text-center">
                                            <CButton type="button" className="btn-esfot-form w-100 fs-6 py-3" onClick={confirmEnable} >
                                                <UserCheck className="me-2" />
                                                Habilitar Estudiante
                                            </CButton>
                                        </div>

                                        <div className="flex-fill text-center">
                                            <CButton type="button" className="btn-esfot-form w-100 fs-6 py-3" onClick={confirmDisable}>
                                                <UserX className="me-2" />
                                                Deshabilitar Estudiante
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

export default FormularioEstudiante
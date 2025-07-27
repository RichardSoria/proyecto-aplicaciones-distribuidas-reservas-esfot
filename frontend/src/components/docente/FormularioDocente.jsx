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
import { docenteSchema } from '../../validations/docenteSchema'
import { CButton, CCard, CCardBody, CCol, CContainer, CForm, CFormInput, CInputGroup, CInputGroupText, CRow, CFormSelect } from '@coreui/react'
import {
    FileUser,
    BookUser,
    Mail,
    Fingerprint,
    Smartphone,
    GraduationCap,
    School,
    UserPlus,
    UserPen,
    UserCheck,
    UserX,
    Eraser,
} from 'lucide-react'
import useDocente from '../../hooks/useDocente'
import { ConfirmModal } from '../modals/ConfirmModal'
import { LoadingModal } from '../modals/LoadingModal'


const ajv = new Ajv({ allErrors: true })
addFormats(ajv)
ajvErrors(ajv)
const validate = ajv.compile(docenteSchema)


const FormularioDocente = () => {

    // Hooks y estados

    const dispatch = useDispatch()
    const { docenteSeleccionado } = useSelector(state => state)
    const { listarDocentes } = useDocente()
    const [confirmVisible, setConfirmVisible] = React.useState(false)
    const [pendingAction, setPendingAction] = React.useState(null)
    const [operation, setOperation] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false);
    const [isLoadingMessage, setIsLoadingMessage] = React.useState('Cargando...')

    // Función para manejar el evento de teclado y permitir solo números
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
    const defaultDocenteValues = {
        name: '',
        lastName: '',
        email: '',
        cedula: '',
        phone: '',
        career: '',
        otherFaculty: ''
    }

    const {
        register, handleSubmit, setError, reset, setValue, watch,
        formState: { errors }
    } = useForm({
        defaultValues: defaultDocenteValues
    })

    const fullNameForm = `${watch('name') || ''} ${watch('lastName') || ''}`.trim()
    const fullNameDocente = `${docenteSeleccionado?.name || ''} ${docenteSeleccionado?.lastName || ''}`.trim()


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
        if (docenteSeleccionado) {
            const { name, lastName, email, cedula, phone, career, otherFaculty } = docenteSeleccionado
            reset({ name, lastName, email, cedula, phone, career, otherFaculty })
        } else {
            reset(defaultDocenteValues)
        }
    }, [docenteSeleccionado, reset])

    const careerValue = watch('career')

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
            setIsLoadingMessage('Creando docente...')
            setIsLoading(true)
            await axios.post(`${import.meta.env.VITE_API_URL}/docente/register`, data, { withCredentials: true })
            await listarDocentes()
            toast.success('Docente registrado con éxito')
            resetForm()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al registrar docente', { autoClose: 5000 })
        } finally {
            setIsLoading(false)
        }
    }

    const onSubmitUpdate = async (data) => {
        if (!docenteSeleccionado) {
            toast.error('Debe seleccionar un docente para actualizar', { autoClose: 4000 })
            return
        }
        if (!validateForm(data)) {
            return
        }

        try {
            setIsLoadingMessage('Actualizando docente...')
            setIsLoading(true)
            await axios.put(`${import.meta.env.VITE_API_URL}/docente/update/${docenteSeleccionado._id}`, data, { withCredentials: true })
            await listarDocentes()
            toast.success('Docente actualizado con éxito')
            resetForm()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al actualizar Docente', { autoClose: 5000 })
        } finally {
            setIsLoading(false)
        }
    }

    const onSubmitEnable = async () => {
        if (!docenteSeleccionado) {
            toast.error('Debe seleccionar un docente para habilitar', { autoClose: 4000 })
            return
        }
        if (docenteSeleccionado.status) {
            toast.error('El docente ya está habilitado', { autoClose: 4000 })
            return
        }
        try {
            setIsLoadingMessage('Habilitando docente...')
            setIsLoading(true)
            await axios.put(`${import.meta.env.VITE_API_URL}/docente/enable/${docenteSeleccionado._id}`, {}, { withCredentials: true })
            await listarDocentes()
            toast.success('Docente habilitado con éxito')
            resetForm()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al habilitar docente', { autoClose: 5000 })
        } finally {
            setIsLoading(false)
        }
    }

    const onSubmitDisable = async () => {
        if (!docenteSeleccionado) {
            toast.error('Debe seleccionar un docente para deshabilitar', { autoClose: 4000 })
            return
        }
        if (!docenteSeleccionado.status) {
            toast.error('El docente ya está deshabilitado', { autoClose: 4000 })
            return
        }
        try {
            setIsLoadingMessage('Deshabilitando docente...')
            setIsLoading(true)
            await axios.put(`${import.meta.env.VITE_API_URL}/docente/disable/${docenteSeleccionado._id}`, {}, { withCredentials: true })
            await listarDocentes()
            toast.success('Docente deshabilitado con éxito')
            resetForm()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al deshabilitar docente', { autoClose: 5000 })
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        reset(defaultDocenteValues)
        dispatch(set({ docenteSeleccionado: null }))
    }

    // Texto del modal de confirmación

    const getModalText = () => {
        switch (operation) {
            case 'create':
                return {
                    title: 'Registrar Docente',
                    message: `¿Deseas registrar al nuevo docente ${fullNameForm}?`
                };
            case 'update':
                return {
                    title: 'Actualizar Docente',
                    message: `¿Deseas actualizar la información del docente ${fullNameDocente}?`
                };
            case 'enable':
                return {
                    title: 'Habilitar Docente',
                    message: `¿Deseas habilitar al docente ${fullNameDocente}?`
                };
            case 'disable':
                return {
                    title: 'Deshabilitar Docente',
                    message: `¿Deseas deshabilitar al docente ${fullNameDocente}?`
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
        if (!docenteSeleccionado) {
            toast.error('Debe seleccionar un docente para actualizar', { autoClose: 4000 })
            return
        }
        if (!validateForm(data)) {
            return
        }
        showConfirm('update', () => onSubmitUpdate(data))
    }

    const confirmEnable = () => {
        if (!docenteSeleccionado) {
            toast.error('Debe seleccionar un docente para habilitar', { autoClose: 4000 })
            return
        }
        if (docenteSeleccionado.status) {
            toast.error('El docente ya está habilitado', { autoClose: 4000 })
            return
        }
        showConfirm('enable', onSubmitEnable)
    }
    const confirmDisable = () => {
        if (!docenteSeleccionado) {
            toast.error('Debe seleccionar un docente para deshabilitar', { autoClose: 4000 })
            return
        }
        if (!docenteSeleccionado.status) {
            toast.error('El docente ya está deshabilitado', { autoClose: 4000 })
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
                                    <CCol md={3}>
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
                                    <CCol md={3}>
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
                                    <CCol md={3}>
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
                                    <CCol md={3}>
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
                                                onChange={(e) => {
                                                    setValue('career', e.target.value)
                                                    if (e.target.value === 'Otras facultades/Externos' || e.target.value === '') {
                                                        setValue('otherFaculty', '')
                                                        errors.otherFaculty && delete errors.otherFaculty
                                                    } else {
                                                        setValue('otherFaculty', 'ESFOT')
                                                    }
                                                }
                                                }
                                            >
                                                <option value="">{`${errors.career ? errors.career.message : 'Seleccione una carrera'}`}</option>
                                                <option value="Tecnología Superior en Agua y Saneamiento Ambiental">Tecnología Superior en Agua y Saneamiento Ambiental</option>
                                                <option value="Tecnología Superior en Desarrollo de Software">Tecnología Superior en Desarrollo de Software</option>
                                                <option value="Tecnología Superior en Electromecánica">Tecnología Superior en Electromecánica</option>
                                                <option value="Tecnología Superior en Redes y Telecomunicaciones">Tecnología Superior en Redes y Telecomunicaciones</option>
                                                <option value="Tecnología Superior en Procesamiento de Alimentos">Tecnología Superior en Procesamiento de Alimentos</option>
                                                <option value="Tecnología Superior en Procesamiento Industrial de la Madera">Tecnología Superior en Procesamiento Industrial de la Madera</option>
                                                <option value="Otras facultades/Externos">Otras facultades/Externos</option>
                                            </CFormSelect>
                                        </CInputGroup>
                                    </CCol>

                                    {/* Facultad */}
                                    <CCol md={3}>
                                        <CInputGroup className={`${errors.otherFaculty ? 'is-invalid' : ''}`}>
                                            <CInputGroupText className={`${errors.otherFaculty ? 'border-danger bg-danger' : 'text-white bg-esfot'}`}>
                                                <School className={`${errors.otherFaculty ? 'text-white' : ''}`} />
                                            </CInputGroupText>
                                            <CFormInput
                                                placeholder={errors.otherFaculty ? errors.otherFaculty.message : "Facultad (opcional)"}
                                                className={`${errors.otherFaculty ? 'border-danger text-danger' : ''}`}
                                                invalid={!!errors.otherFaculty}
                                                disabled={careerValue !== 'Otras facultades/Externos'}
                                                {...register('otherFaculty')}
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
                                                Crear Docente
                                            </CButton>
                                        </div>

                                        <div className="flex-fill text-center">
                                            <CButton type="button" className="btn-esfot-form w-100 fs-6 py-3" onClick={handleSubmit(confirmUpdate)}>
                                                <UserPen className="me-2" />
                                                Actualizar Docente
                                            </CButton>
                                        </div>

                                        <div className="flex-fill text-center">
                                            <CButton type="button" className="btn-esfot-form w-100 fs-6 py-3" onClick={confirmEnable} >
                                                <UserCheck className="me-2" />
                                                Habilitar Docente
                                            </CButton>
                                        </div>

                                        <div className="flex-fill text-center">
                                            <CButton type="button" className="btn-esfot-form w-100 fs-6 py-3" onClick={confirmDisable}>
                                                <UserX className="me-2" />
                                                Deshabilitar Docente
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

export default FormularioDocente
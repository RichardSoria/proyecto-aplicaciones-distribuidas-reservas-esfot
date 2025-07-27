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
import { laboratorioSchema } from '../../validations/laboratorioSchema'
import { CButton, CCard, CCardBody, CCol, CContainer, CForm, CFormInput, CInputGroup, CInputGroupText, CRow } from '@coreui/react'
import {
    ALargeSmall,
    Barcode,
    Ratio,
    FileType,
    FilePlus2,
    FilePen,
    FileCheck2,
    FileX2,
    Eraser, Monitor, Video, Presentation
} from 'lucide-react'
import useLaboratorio from '../../hooks/useLaboratorio'
import { ConfirmModal } from '../modals/ConfirmModal'
import { LoadingModal } from '../modals/LoadingModal'


const ajv = new Ajv({ allErrors: true })
addFormats(ajv)
ajvErrors(ajv)
const validate = ajv.compile(laboratorioSchema)


const FormularioLaboratorio = () => {

    // Hooks y estados

    const dispatch = useDispatch()
    const { laboratorioSeleccionado } = useSelector(state => state)
    const { listarLaboratorios } = useLaboratorio()
    const [confirmVisible, setConfirmVisible] = React.useState(false)
    const [pendingAction, setPendingAction] = React.useState(null)
    const [operation, setOperation] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false);
    const [isLoadingMessage, setIsLoadingMessage] = React.useState('Cargando...')

    // Manejadores de eventos para evitar caracteres no numéricos en campos numéricos
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
    const defaultLaboratorioValues = {
        name: '',
        codigo: '',
        description: '',
        capacity: '',
        equipmentPC: null,
        equipmentProyector: null,
        equipmentInteractiveScreen: null,
    }

    const {
        register, handleSubmit, setError, reset, watch,
        formState: { errors }
    } = useForm({
        defaultValues: defaultLaboratorioValues
    })

    const fullNameForm = `${watch('name') || ''} ${watch('codigo') || ''}`.trim()
    const fullNameLaboratorio = `${laboratorioSeleccionado?.name || ''} ${laboratorioSeleccionado?.codigo || ''}`.trim()


    const equipmentPC = watch('equipmentPC')
    const equipmentProyector = watch('equipmentProyector')
    const equipmentInteractiveScreen = watch('equipmentInteractiveScreen')

    // Validación de errores

    const validateForm = (data) => {
        
        let validacionExitosa = true

        // Validación: al menos un equipo seleccionado
        const algunoSeleccionado =
            data.equipmentPC || data.equipmentProyector || data.equipmentInteractiveScreen

        if (!algunoSeleccionado) {
            setError('equipmentPC', {
                type: 'manual',
                message: 'Debe seleccionar al menos un equipo',
            })
            validacionExitosa = false
        } else {
            // Forzar los valores booleanos explícitos
            data.equipmentPC = Boolean(data.equipmentPC)
            data.equipmentProyector = Boolean(data.equipmentProyector)
            data.equipmentInteractiveScreen = Boolean(data.equipmentInteractiveScreen)
        }
        
        const valid = validate(data)
        if (!valid) {
            validate.errors.forEach(err => {
                const field = err.instancePath.replace('/', '')

                // Evita duplicar el error de los checkboxes si ya lo manejamos arriba
                if (
                    !(field === 'equipmentPC' || field === 'equipmentProyector' || field === 'equipmentInteractiveScreen') ||
                    algunoSeleccionado
                ) {
                    setError(field, { type: 'manual', message: err.message })
                }
            })
            validacionExitosa = false
        }

        return validacionExitosa
    }


    // Función para limpiar el formulario

    React.useEffect(() => {
        dispatch(limpiarSeleccionados())
    }, [])

    // Cargar datos del administrador seleccionado al formulario

    React.useEffect(() => {
        if (laboratorioSeleccionado) {
            const { name, codigo, description, capacity, equipmentPC, equipmentProyector, equipmentInteractiveScreen } = laboratorioSeleccionado
            reset({ name, codigo, description, capacity: capacity != null ? String(capacity) : '', equipmentPC, equipmentProyector, equipmentInteractiveScreen })
        } else {
            reset(defaultLaboratorioValues)
        }
    }, [laboratorioSeleccionado, reset])

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
            setIsLoadingMessage('Creando laboratorio...')
            setIsLoading(true)
            await axios.post(`${import.meta.env.VITE_API_URL}/laboratorio/create`, data, { withCredentials: true })
            await listarLaboratorios()
            toast.success('Laboratorio registrado con éxito!')
            resetForm()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al registrar laboratorio', { autoClose: 5000 })
        } finally {
            setIsLoading(false)
        }
    }

    const onSubmitUpdate = async (data) => {
        if (!laboratorioSeleccionado) {
            toast.error('Debe seleccionar un laboratorio para actualizar', { autoClose: 4000 })
            return
        }
        if (!validateForm(data)) {
            return
        }

        try {
            setIsLoadingMessage('Actualizando laboratorio...')
            setIsLoading(true)
            await axios.put(`${import.meta.env.VITE_API_URL}/laboratorio/update/${laboratorioSeleccionado._id}`, data, { withCredentials: true })
            await listarLaboratorios()
            toast.success('Laboratorio actualizado con éxito!')
            resetForm()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al actualizar Laboratorio', { autoClose: 5000 })
        } finally {
            setIsLoading(false)
        }
    }

    const onSubmitEnable = async () => {
        if (!laboratorioSeleccionado) {
            toast.error('Debe seleccionar un laboratorio para habilitar', { autoClose: 4000 })
            return
        }
        if (laboratorioSeleccionado.status) {
            toast.error('El laboratorio ya está habilitado', { autoClose: 4000 })
            return
        }
        try {
            setIsLoadingMessage('Habilitando laboratorio...')
            setIsLoading(true)
            await axios.put(`${import.meta.env.VITE_API_URL}/laboratorio/enable/${laboratorioSeleccionado._id}`, {}, { withCredentials: true })
            await listarLaboratorios()
            toast.success('Laboratorio habilitado con éxito!')
            resetForm()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al habilitar laboratorio', { autoClose: 5000 })
        } finally {
            setIsLoading(false)
        }
    }

    const onSubmitDisable = async () => {
        if (!laboratorioSeleccionado) {
            toast.error('Debe seleccionar un laboratorio para deshabilitar', { autoClose: 4000 })
            return
        }
        if (!laboratorioSeleccionado.status) {
            toast.error('El laboratorio ya está deshabilitado', { autoClose: 4000 })
            return
        }
        try {
            setIsLoadingMessage('Deshabilitando laboratorio...')
            setIsLoading(true)
            await axios.put(`${import.meta.env.VITE_API_URL}/laboratorio/disable/${laboratorioSeleccionado._id}`, {}, { withCredentials: true })
            await listarLaboratorios()
            toast.success('Laboratorio deshabilitado con éxito!')
            resetForm()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al deshabilitar laboratorio', { autoClose: 5000 })
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        reset(defaultLaboratorioValues)
        dispatch(set({ laboratorioSeleccionado: null }))
    }

    // Texto del modal de confirmación

    const getModalText = () => {
        switch (operation) {
            case 'create':
                return {
                    title: 'Registrar Laboratorio',
                    message: `¿Deseas registrar al nuevo laboratorio ${fullNameForm}?`
                };
            case 'update':
                return {
                    title: 'Actualizar Laboratorio',
                    message: `¿Deseas actualizar la información del laboratorio ${fullNameLaboratorio}?`
                };
            case 'enable':
                return {
                    title: 'Habilitar Laboratorio',
                    message: `¿Deseas habilitar al laboratorio ${fullNameLaboratorio}?`
                };
            case 'disable':
                return {
                    title: 'Deshabilitar Laboratorio',
                    message: `¿Deseas deshabilitar al laboratorio ${fullNameLaboratorio}?`
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
        if (!laboratorioSeleccionado) {
            toast.error('Debe seleccionar un laboratorio para actualizar', { autoClose: 4000 })
            return
        }
        if (!validateForm(data)) {
            return
        }
        showConfirm('update', () => onSubmitUpdate(data))
    }

    const confirmEnable = () => {
        if (!laboratorioSeleccionado) {
            toast.error('Debe seleccionar un laboratorio para habilitar', { autoClose: 4000 })
            return
        }
        if (laboratorioSeleccionado.status) {
            toast.error('El laboratorio ya está habilitado', { autoClose: 4000 })
            return
        }
        showConfirm('enable', onSubmitEnable)
    }
    const confirmDisable = () => {
        if (!laboratorioSeleccionado) {
            toast.error('Debe seleccionar un laboratorio para deshabilitar', { autoClose: 4000 })
            return
        }
        if (!laboratorioSeleccionado.status) {
            toast.error('El laboratorio ya está deshabilitado', { autoClose: 4000 })
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
                                                <ALargeSmall className={`${errors.name ? 'text-white' : ''}`} />
                                            </CInputGroupText>
                                            <CFormInput
                                                placeholder={errors.name ? errors.name.message : "Nombre"}
                                                className={`${errors.name ? 'border-danger text-danger' : ''}`}
                                                invalid={!!errors.name}
                                                {...register('name')}
                                            />
                                        </CInputGroup>
                                    </CCol>

                                    {/* Código */}
                                    <CCol md={3}>
                                        <CInputGroup className={`${errors.codigo ? 'is-invalid' : ''}`}>
                                            <CInputGroupText className={`${errors.codigo ? 'border-danger bg-danger' : 'text-white bg-esfot'}`}>
                                                <Barcode className={`${errors.codigo ? 'text-white' : ''}`} />
                                            </CInputGroupText>
                                            <CFormInput
                                                placeholder={errors.codigo ? errors.codigo.message : "Código (E00/PB0/E000)"}
                                                className={`${errors.codigo ? 'border-danger text-danger' : ''}`}
                                                invalid={!!errors.codigo}
                                                {...register('codigo')}
                                            />
                                        </CInputGroup>
                                    </CCol>

                                    {/* Capacidad */}
                                    <CCol md={2}>
                                        <CInputGroup className={`${errors.capacity ? 'is-invalid' : ''}`}>
                                            <CInputGroupText className={`${errors.capacity ? 'border-danger bg-danger' : 'text-white bg-esfot'}`}>
                                                <Ratio className={`${errors.capacity ? 'text-white' : ''}`} />
                                            </CInputGroupText>
                                            <CFormInput
                                                type='number'
                                                placeholder={errors.capacity ? errors.capacity.message : "Capacidad"}
                                                className={`${errors.capacity ? 'border-danger text-danger' : ''}`}
                                                invalid={!!errors.capacity}
                                                onKeyDown={handleNumericKeyDown}
                                                {...register('capacity')}
                                            />
                                        </CInputGroup>
                                    </CCol>

                                    {/* Equipos */}
                                    <CCol md={4}>
                                        <div className="btn-group w-100" role="group" aria-label="Equipos">
                                            {/* PC */}
                                            <input
                                                type="checkbox"
                                                className="btn-check"
                                                id="equipmentPC"
                                                autoComplete="off"
                                                {...register('equipmentPC')}
                                                defaultChecked={equipmentPC}
                                            />
                                            <label
                                                className="btn custom-toggle"
                                                htmlFor="equipmentPC"
                                            >
                                                <Monitor className={`${errors.equipmentPC ? 'text-white' : ''} me-1`} />
                                                PC
                                            </label>

                                            {/* Proyector */}
                                            <input
                                                type="checkbox"
                                                className="btn-check"
                                                id="equipmentProyector"
                                                autoComplete="off"
                                                {...register('equipmentProyector')}
                                                defaultChecked={equipmentProyector}
                                            />
                                            <label
                                                className="btn custom-toggle"
                                                htmlFor="equipmentProyector"
                                            >
                                                <Video className={`${errors.equipmentProyector ? 'text-white' : ''} me-1`} />
                                                Proyector
                                            </label>

                                            {/* Pantalla Interactiva */}
                                            <input
                                                type="checkbox"
                                                className="btn-check"
                                                id="equipmentInteractiveScreen"
                                                autoComplete="off"
                                                {...register('equipmentInteractiveScreen')}
                                                defaultChecked={equipmentInteractiveScreen}
                                            />
                                            <label
                                                className="btn custom-toggle"
                                                htmlFor="equipmentInteractiveScreen"
                                            >
                                                <Presentation className={`${errors.equipmentInteractiveScreen ? 'text-white' : ''} me-1`} />
                                                Pantalla Interactiva
                                            </label>
                                        </div>
                                    </CCol>

                                    {/* Descripción */}
                                    <CCol md={12}>
                                        <CInputGroup className={`${errors.description ? 'is-invalid' : ''}`}>
                                            <CInputGroupText className={`${errors.description ? 'border-danger bg-danger' : 'text-white bg-esfot'}`}>
                                                <FileType className={`${errors.description ? 'text-white' : ''}`} />
                                            </CInputGroupText>
                                            <CFormInput
                                                placeholder={errors.description ? errors.description.message : "Descripción"}
                                                className={`${errors.description ? 'border-danger text-danger' : ''}`}
                                                invalid={!!errors.description}
                                                {...register('description')}
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
                                                <FilePlus2 className="me-2" />
                                                Crear Laboratorio
                                            </CButton>
                                        </div>

                                        <div className="flex-fill text-center">
                                            <CButton type="button" className="btn-esfot-form w-100 fs-6 py-3" onClick={handleSubmit(confirmUpdate)}>
                                                <FilePen className="me-2" />
                                                Actualizar Laboratorio
                                            </CButton>
                                        </div>

                                        <div className="flex-fill text-center">
                                            <CButton type="button" className="btn-esfot-form w-100 fs-6 py-3" onClick={confirmEnable} >
                                                <FileCheck2 className="me-2" />
                                                Habilitar Laboratorio
                                            </CButton>
                                        </div>

                                        <div className="flex-fill text-center">
                                            <CButton type="button" className="btn-esfot-form w-100 fs-6 py-3" onClick={confirmDisable}>
                                                <FileX2 className="me-2" />
                                                Deshabilitar Laboratorio
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

export default FormularioLaboratorio
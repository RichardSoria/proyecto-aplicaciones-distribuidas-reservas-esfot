/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { ConfirmModal } from '../modals/ConfirmModal';
import { LoadingModal } from '../modals/LoadingModal';
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton, CForm, CInputGroup, CInputGroupText, CFormSelect, CRow, CCol, CFormInput, CFormLabel } from '@coreui/react'
import { University, HouseWifi, NotebookPen, CalendarDays, Clock3, Clock9, FileText } from 'lucide-react'
import { createReservaSchema } from '../../validations/reservaSchema';
import { useForm, Controller } from 'react-hook-form'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import ajvErrors from 'ajv-errors'
import useAula from '../../hooks/useAula';
import useLaboratorio from '../../hooks/useLaboratorio';
import useReserva from '../../hooks/useReserva';
import { useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'react-toastify'
import Select from 'react-select'
import moment from 'moment-timezone';

const ajv = new Ajv({ allErrors: true })
addFormats(ajv)
ajvErrors(ajv)
const validate = ajv.compile(createReservaSchema)

export const CrearReservaModal = ({ visible, onClose }) => {

    const reservaDefaultValues = {
        placeType: '',
        placeID: '',
        purpose: '',
        reservationDate: '',
        startTime: '',
        endTime: '',
        description: '',
    }

    const {
        register,
        control,
        handleSubmit,
        setError,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: reservaDefaultValues
    })

    // Estado para el modal de confirmación
    const [confirmVisible, setConfirmVisible] = React.useState(false);
    const [pendingAction, setPendingAction] = React.useState(null)
    const [isLoading, setIsLoading] = React.useState(false);
    const [isLoadingMessage, setIsLoadingMessage] = React.useState('');
    const [generalMessage, setgeneralMessage] = React.useState('')

    // Hooks para obtener datos de aulas y laboratorios
    const { listarAulas } = useAula()
    const { listarLaboratorios } = useLaboratorio()
    const { listarReservas } = useReserva()
    const { listarReservasGeneral } = useReserva()
    const { aulas = [] } = useSelector((state) => state)
    const { laboratorios = [] } = useSelector((state) => state)

    const watchedFields = watch()


    // Limpia el mensaje general cuando cambian inputs
    React.useEffect(() => {
        if (watchedFields) {
            setgeneralMessage('')
        }
    }, [watchedFields])

    // Cargar aulas y laboratorios al abrir el modal
    React.useEffect(() => {
        if (visible && watchedFields.placeType === 'Aula') {
            listarAulas();
        }
        if (visible && watchedFields.placeType === 'Laboratorio') {
            listarLaboratorios();
        }
    }, [visible, watchedFields.placeType]);

    // Mostrar errores con toast cuando cambian
    React.useEffect(() => {
        // Mostrar errores específicos de campos
        Object.values(errors).forEach((err) => {
            toast.error(err.message, { autoClose: 4000 })
        })
    }, [errors])

    // Mostrar mensaje general con toast cuando cambia
    React.useEffect(() => {
        if (generalMessage) {
            toast.error(generalMessage, {
                autoClose: 5000,
                onClose: () => setgeneralMessage(''),
            })
        }
    }, [generalMessage])

    const validateForm = (data) => {
        let valid = true;

        // Validación con AJV
        const ajvValid = validate(data);
        if (!ajvValid) {
            validate.errors.forEach(err => {
                const field = err.instancePath.replace('/', '');
                setError(field, { type: 'manual', message: err.message });
            });
            valid = false;
        }

        // Validaciones personalizadas en validateForm(data)
        const hasStartTime = data.startTime && !errors.startTime;
        const hasEndTime = data.endTime && !errors.endTime;

        const now = new Date();
        const today = new Intl.DateTimeFormat('sv-SE').format(new Date());

        const nowTime = now.toTimeString().slice(0, 5);

        // Validar que no sea fin de semana
        if (data.reservationDate) {
            const reservationDate = moment.tz(data.reservationDate, 'YYYY-MM-DD', 'America/Guayaquil');
            const dayOfWeek = reservationDate.day(); // 0 = domingo, 6 = sábado
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                setError('reservationDate', {
                    type: 'manual',
                    message: 'No se pueden hacer reservas los fines de semana',
                });
                valid = false;
            }
        }

        // Validación la hora de inicio no puede ser anterior a la hora actual
        if (data.reservationDate && new Date(data.reservationDate) < today) {
            if (hasStartTime && data.startTime < nowTime) {
                setError('startTime', {
                    type: 'manual',
                    message: 'La hora de inicio no puede ser anterior a la hora actual',
                });
                valid = false;
            }
        }

        // Validación de rango horario permitido
        if (hasStartTime && (data.startTime < "07:00" || data.startTime > "20:00")) {
            setError('startTime', {
                type: 'manual',
                message: 'La hora de inicio debe estar entre las 07:00 y las 20:00',
            });
            valid = false;
        }

        if (hasEndTime && (data.endTime < "07:00" || data.endTime > "20:00")) {
            setError('endTime', {
                type: 'manual',
                message: 'La hora de finalización debe estar entre las 07:00 y las 20:00',
            });
            valid = false;
        }

        // Validar que la hora de finalización sea posterior a la de inicio
        if (hasStartTime && hasEndTime && data.startTime >= data.endTime) {
            setError('endTime', {
                type: 'manual',
                message: 'La hora de finalización debe ser posterior a la hora de inicio',
            });
            valid = false;
        }

        return valid;
    };

    const resetForm = () => {
        reset(reservaDefaultValues)
    }


    const showConfirm = (action) => {
        if (pendingAction) pendingAction()
        setPendingAction(() => action)
        setConfirmVisible(true)
    }

    const handleConfirm = () => {
        if (pendingAction) pendingAction()
        setConfirmVisible(false)
        setPendingAction(null)
    };

    const handleCancel = () => {
        setConfirmVisible(false)
        setPendingAction(null)
    }

    const onSubmitCreateReserva = async (data) => {
        if (!validateForm(data)) return;

        try {
            setIsLoadingMessage('Creando reserva...');
            setIsLoading(true);
            await axios.post(`${import.meta.env.VITE_API_URL}/reserva/create`, data, { withCredentials: true });
            toast.success('Reserva creada exitosamente');
            listarReservas();
            listarReservasGeneral();
            resetForm();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al crear la reserva');

        } finally {
            setIsLoading(false);
        }
    };

    // Función para confirmar la creación de la reserva
    const confirmCreateReserva = (data) => {
        if (!validateForm(data)) {
            return
        }
        showConfirm(() => onSubmitCreateReserva(data))
    }

    const today = new Date().toISOString().split('T')[0];

    const handleManualClose = () => {
        resetForm(reservaDefaultValues);
        onClose();
    }

    return (
        <>
            {/* Modal de confirmación */}
            <ConfirmModal
                visible={confirmVisible}
                onClose={handleCancel}
                onConfirm={handleConfirm}
                title={'Confirmar creación de reserva'}
                message={'¿Estás seguro de que deseas crear esta reserva? Esta acción no se puede deshacer.'}
            />

            {/* Modal de carga */}
            <LoadingModal
                visible={isLoading}
                message={isLoadingMessage}
            />

            <CModal backdrop="static" visible={visible} onClose={handleManualClose} alignment='center' style={{ display: (confirmVisible || isLoading) ? 'none' : 'block' }}>
                <CModalHeader>
                    <CModalTitle className='textos-esfot'> Crear Reserva </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        { /* Tipo de Espacio Académico */}
                        <CInputGroup className={`${errors.placeType ? 'is-invalid' : ''} mb-3`}>
                            <CInputGroupText
                                className={`${errors.placeType ? 'border-danger bg-danger' : 'text-white bg-esfot'}`}>
                                <University className={`${errors.placeType}` ? 'text-white' : ''} />
                            </CInputGroupText>
                            <CFormSelect
                                className={`${errors.placeType ? 'border-danger text-danger' : ''
                                    }`}
                                invalid={!!errors.placeType}
                                {...register('placeType')}>
                                <option value="">{`${errors.placeType ? errors.placeType.message : 'Seleccione el tipo de espacio académico'}`}</option>
                                <option value="Aula">Aula</option>
                                <option value="Laboratorio">Laboratorio</option>
                            </CFormSelect>
                        </CInputGroup>
                        { /* Espacio Académico */}
                        <CInputGroup className={`${errors.placeID ? 'is-invalid' : ''} mb-3`}>
                            <CInputGroupText
                                className={`${errors.placeID ? 'border-danger bg-danger' : 'text-white bg-esfot'}`}>
                                <HouseWifi className={`${errors.placeID ? 'text-white' : ''}`} />
                            </CInputGroupText>

                            <div className="flex-grow-1">
                                <Controller
                                    name="placeID"
                                    control={control}
                                    render={({ field }) => {
                                        const selectedOptions =
                                            watchedFields.placeType === 'Aula'
                                                ? aulas
                                                    .filter(a => a.status === true)
                                                    .map(a => ({ value: a._id, label: a.name }))
                                                : watchedFields.placeType === 'Laboratorio'
                                                    ? laboratorios
                                                        .filter(l => l.status === true)
                                                        .map(l => ({ value: l._id, label: l.name }))
                                                    : [];

                                        const selectedValue = selectedOptions.find(option => option.value === field.value) || null;

                                        return (
                                            <Select
                                                value={selectedValue}
                                                onChange={(option) => field.onChange(option?.value || '')}
                                                options={selectedOptions}
                                                isClearable
                                                classNamePrefix="react-select"
                                                menuPosition="fixed"
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuPortal: base => ({ ...base, zIndex: 9999 }),
                                                }}
                                                noOptionsMessage={() => 'No se han encontrado coincidencias'}
                                                className={`react-select-container ${errors.placeID ? 'is-invalid-select' : ''}`}
                                                placeholder={
                                                    watchedFields.placeType === 'Aula'
                                                        ? 'Seleccione un aula'
                                                        : watchedFields.placeType === 'Laboratorio'
                                                            ? 'Seleccione un laboratorio'
                                                            : 'Seleccione un espacio académico'
                                                }
                                            />
                                        );
                                    }}
                                />
                            </div>
                        </CInputGroup>
                        { /* Propósito */}
                        <CInputGroup className={`${errors.purpose ? 'is-invalid' : ''} mb-3`}>
                            <CInputGroupText
                                className={`${errors.purpose ? 'border-danger bg-danger' : 'text-white bg-esfot'}`}>
                                <NotebookPen className={`${errors.purpose ? 'text-white' : ''}`} />
                            </CInputGroupText>
                            <CFormSelect
                                className={`${errors.purpose ? 'border-danger text-danger' : ''}`}
                                invalid={!!errors.purpose}
                                {...register('purpose')}>
                                <option value="">{`${errors.purpose ? errors.purpose.message : 'Seleccione un propósito'}`}</option>
                                <option value="Clase">Clase</option>
                                <option value="Prueba/Examen">Prueba/Examen</option>
                                <option value="Proyecto">Proyecto</option>
                                <option value="Evento/Capacitación">Evento/Capacitación</option>
                                <option value="Otro">Otro</option>
                            </CFormSelect>
                        </CInputGroup>
                        { /* Fecha de Reserva */}
                        <div className="mb-3">
                            <CFormLabel htmlFor="reservationDate" className="fw-semibold">
                                Fecha de reserva
                            </CFormLabel>
                            <CInputGroup className={`${errors.reservationDate ? 'is-invalid' : ''}`}>
                                <CInputGroupText
                                    className={`${errors.reservationDate ? 'border-danger bg-danger' : 'text-white bg-esfot'}`}>
                                    <CalendarDays className={`${errors.reservationDate ? 'text-white' : ''}`} />
                                </CInputGroupText>
                                <CFormInput
                                    id="reservationDate"
                                    type="date"
                                    min={today}
                                    className={`${errors.reservationDate ? 'border-danger text-danger' : ''}`}
                                    invalid={!!errors.reservationDate}
                                    {...register('reservationDate')}
                                />
                            </CInputGroup>
                        </div>
                        <CRow className="g-2 mb-3">
                            <CCol md={6}>
                                <CFormLabel htmlFor="startTime" className="fw-semibold">
                                    Hora de inicio
                                </CFormLabel>
                                <CInputGroup className={`${errors.startTime ? 'is-invalid' : ''}`}>
                                    <CInputGroupText
                                        className={`${errors.startTime ? 'border-danger bg-danger' : 'text-white bg-esfot'}`}>
                                        <Clock3 className={`${errors.startTime ? 'text-white' : ''}`} />
                                    </CInputGroupText>
                                    <CFormInput
                                        id="startTime"
                                        type="time"
                                        className={`${errors.startTime ? 'border-danger text-danger' : ''}`}
                                        invalid={!!errors.startTime}
                                        {...register('startTime')}
                                    />
                                </CInputGroup>
                            </CCol>

                            <CCol md={6}>
                                <CFormLabel htmlFor="endTime" className="fw-semibold subittulos-esfot">
                                    Hora de finalización
                                </CFormLabel>
                                <CInputGroup className={`${errors.endTime ? 'is-invalid' : ''}`}>
                                    <CInputGroupText
                                        className={`${errors.endTime ? 'border-danger bg-danger' : 'text-white bg-esfot'}`}>
                                        <Clock9 className={`${errors.endTime ? 'text-white' : ''}`} />
                                    </CInputGroupText>
                                    <CFormInput
                                        id="endTime"
                                        type="time"
                                        className={`${errors.endTime ? 'border-danger text-danger' : ''}`}
                                        invalid={!!errors.endTime}
                                        {...register('endTime')}
                                    />
                                </CInputGroup>
                            </CCol>
                        </CRow>
                        { /* Descripción */}
                        <CInputGroup className={`${errors.description ? 'is-invalid' : ''} mb-3`}>
                            <CInputGroupText
                                className={`${errors.description ? 'border-danger bg-danger' : 'text-white bg-esfot'}`}>
                                <FileText className={`${errors.description ? 'text-white' : ''}`} />
                            </CInputGroupText>
                            <textarea
                                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                placeholder={`${errors.description ? errors.description.message : 'Ingrese la descripción de la reserva'}`}
                                rows="3"
                                {...register('description')}
                            ></textarea>
                        </CInputGroup>

                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton onClick={() => { onClose(); resetForm(); toast.dismiss() }}>Cancelar</CButton>
                    <CButton className='btn-esfot' onClick={handleSubmit(confirmCreateReserva)}>Crear Reserva</CButton>
                </CModalFooter>
            </CModal>
        </>
    )
}
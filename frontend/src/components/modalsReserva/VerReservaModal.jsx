/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import useReserva from '../../hooks/useReserva';
import { useSelector } from 'react-redux';
import { CModal } from '@coreui/react';
import { CModalHeader, CModalTitle, CModalBody, CRow, CCol, CInputGroup, CInputGroupText, CFormTextarea, CButton, CModalFooter } from '@coreui/react';
import { toast } from 'react-toastify';
import { FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { reasonReservaSchema } from '../../validations/reservaSchema';
import addFormats from 'ajv-formats';
import ajvErrors from 'ajv-errors';
import Ajv from 'ajv';
import { ConfirmModal } from '../modals/ConfirmModal'
import { LoadingModal } from '../modals/LoadingModal'
import axios from 'axios';


const ajv = new Ajv({ allErrors: true })
addFormats(ajv)
ajvErrors(ajv)
const validate = ajv.compile(reasonReservaSchema)


export const VerReservaModal = ({ id, visible, onClose }) => {

    const reasonValueDefault = '';

    const {
        register,
        handleSubmit,
        setError,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: { reason: reasonValueDefault }
    });


    // Estado para el modal de confirmación
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [pendingAction, setPendingAction] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMessage, setIsLoadingMessage] = useState('');
    const [operation, setOperation] = useState('')
    const [generalMessage, setgeneralMessage] = useState('')

    const { elementConsult } = useSelector((state) => state)
    const perfil = useSelector((state) => state.perfil)
    const { consultReserva } = useReserva();
    const { listarReservas } = useReserva();
    const { listarReservasGeneral } = useReserva();
    const watchedFields = watch();


    useEffect(() => {
        if (watchedFields) {
            setgeneralMessage('')
        }
    }, [watchedFields]);

    useEffect(() => {
        Object.values(errors).forEach((error) => {
            toast.error(error.message, { autoClose: 4000 });
        });
    }, [errors]);

    useEffect(() => {
        if (generalMessage) {
            toast.error(generalMessage, {
                autoClose: 5000,
                onClose: () => setgeneralMessage(''),
            })
        }
    }, [generalMessage])


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

    const resetForm = () => {
        reset({ reason: reasonValueDefault });
    };


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
    useEffect(() => {
        if (!visible || !id) return;

        const fetchData = async () => {
            const result = await consultReserva(id);
            if (!result) {
                onClose();
            }
        };
        fetchData();
    }, [id, visible]);

    if (!elementConsult) return null;

    // Funciones de envío
    const onSubmitApprove = async (data) => {
        if (!validateForm(data)) return;

        try {
            setIsLoadingMessage('Aprobando reserva...');
            setIsLoading(true);
            await axios.patch(`${import.meta.env.VITE_API_URL}/reserva/approve/${elementConsult._id}`, data, { withCredentials: true })
            toast.success('Reserva aprobada con éxito')
            listarReservas()
            resetForm();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al aprobar la reserva', { autoClose: 5000 })
        } finally {
            setIsLoading(false);
        }
    }

    const onSubmitReject = async (data) => {
        if (!validateForm(data)) return;
        try {
            setIsLoadingMessage('Rechazando reserva...');
            setIsLoading(true);
            await axios.patch(`${import.meta.env.VITE_API_URL}/reserva/reject/${elementConsult._id}`, data, { withCredentials: true })
            toast.success('Reserva rechazada con éxito')
            listarReservas()
            resetForm();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al rechazar la reserva', { autoClose: 5000 })
        } finally {
            setIsLoading(false);
        }
    }

    const onSubmitCancel = async (data) => {
        if (!validateForm(data)) return;
        try {
            setIsLoadingMessage('Cancelando reserva...');
            setIsLoading(true);
            await axios.patch(`${import.meta.env.VITE_API_URL}/reserva/cancel/${elementConsult._id}`, data, { withCredentials: true })
            toast.success('Reserva cancelada con éxito')
            listarReservas()
            listarReservasGeneral();
            resetForm();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al cancelar la reserva', { autoClose: 5000 })
        } finally {
            setIsLoading(false);
        }
    }

    const getModalText = () => {
        switch (operation) {
            case 'approve':
                return {
                    title: 'Aprobar Reserva',
                    message: '¿Está seguro de que desea aprobar esta reserva?'
                }
            case 'reject':
                return {
                    title: 'Rechazar Reserva',
                    message: '¿Está seguro de que desea rechazar esta reserva?'
                }
            case 'cancel':
                return {
                    title: 'Cancelar Reserva',
                    message: '¿Está seguro de que desea cancelar esta reserva?'
                }
            default:
                return { title: '', message: '' }
        }
    }

    const { title, message } = getModalText();

    const confirmAprove = (data) => {
        if (!validateForm(data)) return;

        showConfirm('approve', () => onSubmitApprove(data));
    }

    const confirmReject = (data) => {
        if (!validateForm(data)) return;
        showConfirm('reject', () => onSubmitReject(data));
    }

    const confirmCancel = (data) => {
        if (!validateForm(data)) return;
        showConfirm('cancel', () => onSubmitCancel(data));
    }

    const handleManualClose = () => {
        reset({ reason: '' });
        onClose();
    };

    return (
        <CModal backdrop="static" visible={visible} onClose={handleManualClose} alignment='center' style={{ display: (confirmVisible || isLoading) ? 'none' : 'block' }}>
            <CModalHeader>
                <CModalTitle className='textos-esfot'> Ver Reserva </CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CRow>
                    {/* Información de la reserva */}
                    <CCol md={6}>
                        <h5 className="subtitulos-esfot mb-3">Datos de la Reserva</h5>
                        <p><strong>Solicitante:</strong> {elementConsult?.solicitante}</p>
                        <p><strong>Rol:</strong> {elementConsult?.userRol === 'Admin' ? 'Administrador' : elementConsult?.userRol}</p>
                        <p><strong>Tipo de espacio:</strong> {elementConsult?.placeType}</p>
                        <p><strong>Nombre del espacio:</strong> {elementConsult?.lugarNombre}</p>
                        <p><strong>Propósito:</strong> {elementConsult?.purpose}</p>
                        <p><strong>Descripción:</strong> {elementConsult?.description}</p>
                        <p><strong>Fecha:</strong> {new Date(elementConsult?.reservationDate).toLocaleDateString('es-EC')}</p>
                        <p><strong>Horario:</strong> {elementConsult?.startTime} - {elementConsult?.endTime}</p>
                        <p>
                        </p>
                        <strong>Estado:</strong>{' '}
                        <span
                            style={{
                                backgroundColor:
                                    elementConsult?.status === 'Aprobada' ? '#198754' :
                                        elementConsult?.status === 'Pendiente' ? '#ffc008' :
                                            elementConsult?.status === 'Rechazada' ? '#7b2626' :
                                                elementConsult?.status === 'Cancelada' ? '#6c757d' : '#adb5bd',
                                color:
                                    elementConsult?.status === 'Pendiente' ? 'black' : 'white',
                                padding: '3px 12px',
                                borderRadius: '12px',
                                fontWeight: '500',
                                fontSize: '0.9rem',
                                display: 'inline-block',
                                textAlign: 'center',
                            }}
                        >
                            {elementConsult?.status}
                        </span>
                    </CCol>

                    <CCol md={6}>
                        <h5 className="subtitulos-esfot mb-3">Detalles Temporales de la Reserva</h5>
                        <p>
                            <strong>Fecha de registro:</strong><br />{new Date(elementConsult?.createdDate).toLocaleString('es-EC')}
                        </p>
                        <p>
                            <strong>Fecha de cancelación:<br /></strong>{' '}
                            {elementConsult?.cancellationDate
                                ? new Date(elementConsult.cancellationDate).toLocaleString('es-EC')
                                : 'Sin registro'}
                        </p>

                        {/* Información del responsable */}

                        <h5 className="subtitulos-esfot mb-3">Información de Autorización</h5>
                        <p><strong>Autorizado por:<br /></strong> {elementConsult?.autorizadoPor ?? 'Sin registro'}</p>
                        <p><strong>Fecha de autorización:<br /></strong> {elementConsult?.authorizationDate
                            ? new Date(elementConsult?.authorizationDate).toLocaleString('es-EC')
                            : 'Sin registro'}
                        </p>
                        <p>
                            <strong>Motivo:</strong> {elementConsult?.reason ?? 'Sin motivo registrado'}
                        </p>
                    </CCol>

                    {/* Motivo de aprobación o rechazo */}
                    {elementConsult?.status === "Pendiente" && (
                        <CInputGroup className={`${errors.reason ? 'is-invalid' : ''} mt-3`}>
                            <CInputGroupText className={`${errors.reason ? 'border-danger bg-danger' : 'text-white bg-esfot'}`}>
                                <FileText className={`${errors.reason ? 'text-white' : ''}`} />
                            </CInputGroupText>
                            <textarea
                                id="reason"
                                className={`form-control ${errors.reason ? 'is-invalid' : ''}`}
                                placeholder={errors.reason ? errors.reason.message : 'Ingrese el motivo de aprobación o rechazo de la reserva'}
                                rows={6}
                                style={{ resize: 'none' }}
                                {...register('reason')}
                            />
                        </CInputGroup>
                    )}
                </CRow>
            </CModalBody>

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

            {elementConsult?.status === "Pendiente" && (
                <CModalFooter className="d-flex justify-content-center flex-nowrap">
                    {perfil.rol === 'Admin' && (
                        <>
                            <CButton
                                type="button"
                                className="btn-esfot-form w-100 mb-2"
                                onClick={handleSubmit(confirmAprove)}
                            >
                                Aprobar Reserva
                            </CButton>

                            <CButton
                                type="button"
                                className="btn-esfot-form w-100 mb-2"
                                onClick={handleSubmit(confirmReject)}
                            >
                                Rechazar Reserva
                            </CButton>
                        </>
                    )}

                    {elementConsult?.userID === perfil._id && (
                        <CButton
                            type="button"
                            className="btn-esfot-form w-100 mb-2"
                            onClick={handleSubmit(confirmCancel)}
                        >
                            Cancelar Reserva
                        </CButton>
                    )}
                </CModalFooter>
            )}
        </CModal>
    );
}

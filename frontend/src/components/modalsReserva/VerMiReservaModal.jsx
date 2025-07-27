/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import useReserva from '../../hooks/useReserva';
import { useSelector } from 'react-redux';
import { CModal } from '@coreui/react';
import { CModalHeader, CModalTitle, CModalBody, CRow, CCol, CInputGroup, CInputGroupText, CFormTextarea, CButton, CModalFooter } from '@coreui/react';
import { LoadingModal } from '../modals/LoadingModal'


export const VerMiReservaModal = ({ id, visible, onClose }) => {

    // Estado para el modal de confirmación

    const { elementConsult } = useSelector((state) => state)
    const { consultReserva } = useReserva();


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

    return (
        <CModal backdrop="static" visible={visible} onClose={onClose} alignment='center'>
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

                </CRow>
            </CModalBody>
        </CModal>
    );
}

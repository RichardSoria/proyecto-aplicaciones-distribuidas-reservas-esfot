import React from 'react'
import CalendarioReservas from '../../../components/reserva/CalendarioReserva'
import { CCard, CCardBody, CRow, CCol, CButton } from '@coreui/react'
import { CalendarPlus, CalendarCog } from 'lucide-react';
import { CrearReservaModal } from '../../../components/modalsReserva/CrearReservaModal';
import { AsignarReservaModal } from '../../../components/modalsReserva/AsignarReservaModal';
const Reservas = () => {

    // Estado para el modal de confirmación
    const [confirmVisibleCreateModal, setConfirmVisibleCreateModal] = React.useState(false);
    const [confirmVisibleAssignModal, setConfirmVisibleAssignModal] = React.useState(false);


    // Función para manejar la cancelación
    const handleCancel = () => {
        setConfirmVisibleCreateModal(false);
        setConfirmVisibleAssignModal(false);
    };

    // Función para abrir el modal de creación de reserva
    const handleCreateReserva = () => {
        setConfirmVisibleCreateModal(true);
    };

    // Función para abrir el modal de asignación de reserva
    const handleAsignarReserva = () => {
        setConfirmVisibleAssignModal(true);
    };

    return (
        <CCard className="shadow-sm border-0">
            <CCardBody >
                {/* Calendario */}
                <div>
                    <CalendarioReservas />
                </div>

                {/* Modal de confirmación */}
                <CrearReservaModal
                    visible={confirmVisibleCreateModal}
                    onClose={handleCancel}
                />

                { /* Modal de asignación de reserva */}
                <AsignarReservaModal
                    visible={confirmVisibleAssignModal}
                    onClose={handleCancel}
                />

                <div>
                    {/* Botones de acción */}
                    <CRow className="ms-2 me-2 mt-2 justify-content-center">
                        <CCol md={3} className="text-center">
                            <CButton type="button" className="btn-esfot-form w-100 fs-6 py-3 mb-2" onClick={handleCreateReserva}>
                                <CalendarPlus className="me-2" />
                                Crear Reserva
                            </CButton>
                        </CCol>

                        <CCol md={3} className="text-center">
                            <CButton type="button" className="btn-esfot-form w-100 fs-6 py-3 mb-2" onClick={handleAsignarReserva}>
                                <CalendarCog className="me-2" />
                                Asignar Reserva
                            </CButton>
                        </CCol>
                    </CRow>
                </div>


            </CCardBody>
        </CCard>
    )
}

export default Reservas

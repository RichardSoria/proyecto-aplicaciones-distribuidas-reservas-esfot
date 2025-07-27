import React from 'react'
import CalendarioReservasGeneral from '../../../components/reserva/CalendarioReservaGeneral'
import { CCard, CCardBody, CRow, CCol, CButton } from '@coreui/react'
import { CalendarPlus } from 'lucide-react';
import { CrearReservaModal } from '../../../components/modalsReserva/CrearReservaModal';
const ReservasGeneral = () => {

    // Estado para el modal de confirmación
    const [confirmVisibleCreateModal, setConfirmVisibleCreateModal] = React.useState(false);


    // Función para manejar la cancelación
    const handleCancel = () => {
        setConfirmVisibleCreateModal(false);
    };

    // Función para abrir el modal de creación de reserva
    const handleCreateReserva = () => {
        setConfirmVisibleCreateModal(true);
    };

    return (
        <CCard>
            <CCardBody>

                {/* Calendario */}
                <div>
                    <CalendarioReservasGeneral />
                </div>

                {/* Modal de confirmación */}
                <CrearReservaModal
                    visible={confirmVisibleCreateModal}
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
                    </CRow>
                </div>


            </CCardBody>
        </CCard>
    )
}

export default ReservasGeneral

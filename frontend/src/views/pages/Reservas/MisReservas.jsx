import CalendarioMisReservas from '../../../components/reserva/CalendarioMisReservas'
import { CCard, CCardBody } from '@coreui/react'
const MisReservas = () => {

    return (
        <CCard>
            <CCardBody >
                {/* Calendario */}
                <div>
                    <CalendarioMisReservas />
                </div>
            </CCardBody>
        </CCard>
    )
}

export default MisReservas

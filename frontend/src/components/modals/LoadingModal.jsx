import { CModal, CModalBody, CSpinner } from '@coreui/react'

export const LoadingModal = ({ visible, message = "Cargando..." }) => {
    return (
        <CModal visible={visible} alignment="center" backdrop="static" keyboard={false} size="sm">
            <CModalBody className="d-flex flex-column justify-content-center align-items-center">
                <img
                    src="https://esfot.epn.edu.ec/images/logo_esfot_buho.png"
                    alt="Cargando..."
                    style={{ maxWidth: '100px', marginBottom: '20px' }}
                />
                <CSpinner style={{ color: '#0e4c71' }} />
                <p style={{ color: '#e72f2b' }} className="mt-3 fw-semibold fs-6 text-center">{message}</p>
            </CModalBody>
        </CModal>
    )
}

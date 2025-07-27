import { CSpinner } from '@coreui/react'

const LoadingSpinner = () => {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 px-3 bg-light text-center">
            <img
                src="https://esfot.epn.edu.ec/images/logo_esfot_buho.png"
                alt="Cargando..."
                className="img-fluid"
                style={{ maxWidth: '150px', marginBottom: '20px' }}
            />
            <CSpinner style={{ color: '#0e4c71' }} />
            <p className="mt-4 fw-semibold fs-6 fs-md-5" style={{ color: '#e72f2b' }}>
                Cargando Sistema de Reservas de Aulas y Laboratorios ESFOT...
            </p>
        </div>
    )
}

export default LoadingSpinner

import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import useAula from '../../hooks/useAula'
import {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CBadge,
} from '@coreui/react'

const CardsAulas = ({ filtroNombre }) => {
    const { listarAulas } = useAula()
    const { aulas = [] } = useSelector((state) => state)

    useEffect(() => {
        listarAulas()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const aulasFiltradas = (() => {
        const activas = aulas.filter(aula => aula.status === true)

        if (!filtroNombre.trim()) return activas

        const coincidencias = activas.filter((aula) =>
            aula.name.toLowerCase().includes(filtroNombre.toLowerCase())
        )

        return coincidencias.length > 0 ? coincidencias : activas
    })()

    return (
        <CContainer className="mt-4 mb-4">
            <CRow className="g-4">
                {aulasFiltradas.map((aula) => (
                    <CCol key={aula._id} xs={12} md={6} lg={4}>
                        <CCard className="shadow border-0 h-100">
                            <CCardBody>
                                <h5 className="fw-bold subtitulos-esfot">{aula.name}</h5>
                                <p className="text-muted mb-1">{aula.description}</p>
                                <p className="mb-1"><strong>Aforo:</strong> {aula.capacity} personas</p>
                            </CCardBody>
                        </CCard>
                    </CCol>
                ))}
            </CRow>
        </CContainer>
    )
}

export default CardsAulas

import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import useLaboratorio from '../../hooks/useLaboratorio'
import {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CBadge,
} from '@coreui/react'
import { Monitor, Projector, Laptop2 } from 'lucide-react'

const CardsLaboratorios = ({ filtroNombre }) => {
    const { listarLaboratorios } = useLaboratorio()
    const { laboratorios = [] } = useSelector((state) => state)

    useEffect(() => {
        listarLaboratorios()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const laboratoriosFiltrados = (() => {
        const habilitados = laboratorios.filter(lab => lab.status === true)

        if (!filtroNombre.trim()) return habilitados

        const coincidencias = habilitados.filter((lab) =>
            lab.name.toLowerCase().includes(filtroNombre.toLowerCase())
        )

        return coincidencias.length > 0 ? coincidencias : habilitados
    })()


    return (
        <CContainer className='mt-4 mb-4'>
                <CRow className="g-4">
                    {laboratoriosFiltrados.map((lab) => (
                        <CCol key={lab._id} xs={12} md={6} lg={4}>
                            <CCard className="shadow border-0 h-100">
                                <CCardBody>
                                    <h5 className="fw-bold subtitulos-esfot">{lab.name}</h5>
                                    <p className="text-muted mb-1">{lab.description}</p>
                                    <p className="mb-1"><strong>Código:</strong> {lab.codigo}</p>
                                    <p className="mb-1"><strong>Aforo:</strong> {lab.capacity} personas</p>

                                    <div className="mb-2">
                                        <strong>Equipos:</strong>
                                        <ul className="mb-0 ps-3">
                                            {lab.equipmentPC && (
                                                <li><Laptop2 size={16} className="me-1" /> Computadoras</li>
                                            )}
                                            {lab.equipmentProyector && (
                                                <li><Projector size={16} className="me-1" /> Proyector</li>
                                            )}
                                            {lab.equipmentInteractiveScreen && (
                                                <li><Monitor size={16} className="me-1" /> Pantalla interactiva</li>
                                            )}
                                        </ul>
                                    </div>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    ))}
                </CRow>
        </CContainer>
    )
}

export default CardsLaboratorios

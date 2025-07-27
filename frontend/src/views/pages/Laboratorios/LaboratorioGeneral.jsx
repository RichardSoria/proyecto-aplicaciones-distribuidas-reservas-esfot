import CardsLaboratorios from '../../../components/laboratorio/CardsLaboratorio'
import { CCard, CCardBody, CRow, CCol, CFormInput, CInputGroup, CInputGroupText } from '@coreui/react'
import { useState } from 'react'
import { Search } from 'lucide-react'

const LaboratoriosGeneral = () => {
    const [filtroNombre, setfiltroNombre] = useState('')
    return (
        <CCard className="shadow-sm border-0 mt-4 mb-4">
            <CCardBody>
                {/* Encabezado */}
                <div className="ms-3 me-3">
                    <h1 className="text-4xl textos-esfot">Laboratorios ESFOT</h1>
                    <hr />
                    <CRow className="align-items-center">
                        <CCol md={9}>
                            <p className="text-muted mb-0">
                                Este módulo permite la visualización de los laboratorios de la facultad.
                            </p>
                        </CCol>
                        <CCol md={3}>
                            <CInputGroup>
                                <CFormInput
                                    type="text"
                                    placeholder="Buscar por nombre"
                                    aria-label="Buscar por nombre"
                                    value={filtroNombre}
                                    onChange={(e) => setfiltroNombre(e.target.value)}
                                />
                                <CInputGroupText className='bg-esfot text-white'>
                                    <Search />
                                </CInputGroupText>
                            </CInputGroup>
                        </CCol>
                    </CRow>
                </div>

                {/* Cards */}
                <div>
                    <CardsLaboratorios filtroNombre={filtroNombre} />
                </div>
            </CCardBody>
        </CCard>
    )
}

export default LaboratoriosGeneral
import CardsAulas from '../../../components/aula/CardsAula'
import { CCard, CCardBody, CRow, CCol, CFormInput, CInputGroup, CInputGroupText } from '@coreui/react'
import { useState } from 'react'
import { Search } from 'lucide-react'

const AulasGeneral = () => {
    const [filtroNombre, setFiltroNombre] = useState('')

    return (
        <CCard className="shadow-sm border-0 mt-4 mb-4">
            <CCardBody>
                {/* Encabezado */}
                <div className="ms-3 me-3">
                    <h1 className="text-4xl textos-esfot">Aulas ESFOT</h1>
                    <hr />
                    <CRow className="align-items-center">
                        <CCol md={9}>
                            <p className="text-muted mb-0">
                                Este módulo permite la visualización de las aulas de la facultad.
                            </p>
                        </CCol>
                        <CCol md={3}>
                            <CInputGroup>
                                <CFormInput
                                    type="text"
                                    placeholder="Buscar por nombre"
                                    aria-label="Buscar por nombre"
                                    value={filtroNombre}
                                    onChange={(e) => setFiltroNombre(e.target.value)}
                                />
                                <CInputGroupText className="bg-esfot text-white">
                                    <Search />
                                </CInputGroupText>
                            </CInputGroup>
                        </CCol>
                    </CRow>
                </div>

                {/* Cards */}
                <div>
                    <CardsAulas filtroNombre={filtroNombre} />
                </div>
            </CCardBody>
        </CCard>
    )
}

export default AulasGeneral

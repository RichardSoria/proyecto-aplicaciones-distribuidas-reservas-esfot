import FormularioAula from '../../../components/aula/FormularioAula'
import TablaAula from '../../../components/aula/TablaAula'
import { CCard, CCardBody, CRow, CCol, CFormInput, CInputGroup, CInputGroupText } from '@coreui/react'
import { useState } from 'react'
import { Search } from 'lucide-react'

const Aulas = () => {
    const [filtroName, setFiltroName] = useState('')
    return (
        <CCard className="shadow-sm border-0">
            <CCardBody>
                {/* Encabezado */}
                <div className="ms-3 me-3">
                    <h1 className="text-4xl textos-esfot">Gestionar Aulas</h1>
                    <hr />
                    <CRow className="align-items-center">
                        <CCol md={9}>
                            <p className="text-muted mb-0">
                                Este módulo permite la gestión de los usuarios aulas del sistema.
                            </p>
                        </CCol>
                        <CCol md={3}>
                            <CInputGroup>
                                <CFormInput
                                    type="text"
                                    placeholder="Buscar por nombre"
                                    aria-label="Buscar por nombre"
                                    value={filtroName}
                                    onChange={(e) => setFiltroName(e.target.value)}
                                />
                                <CInputGroupText className='bg-esfot text-white'>
                                    <Search />
                                </CInputGroupText>
                            </CInputGroup>
                        </CCol>
                    </CRow>
                </div>

                {/* Tabla */}
                <div>
                    <TablaAula filtroName={filtroName} />
                </div>

                {/* Formulario */}
                <div>
                    <FormularioAula />
                </div>
            </CCardBody>
        </CCard>
    )
}

export default Aulas

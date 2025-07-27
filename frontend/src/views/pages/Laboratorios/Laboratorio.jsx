import FormularioLaboratorio from '../../../components/laboratorio/FormularioLaboratorio'
import TablaLaboratorio from '../../../components/laboratorio/TablaLaboratorio'
import { CCard, CCardBody, CRow, CCol, CFormInput, CInputGroup, CInputGroupText } from '@coreui/react'
import { useState } from 'react'
import { Search } from 'lucide-react'

const Laboratorios = () => {
    const [filtroCodigo, setFiltroCodigo] = useState('')
    return (
        <CCard className="shadow-sm border-0">
            <CCardBody>
                {/* Encabezado */}
                <div className="ms-3 me-3">
                    <h1 className="text-4xl textos-esfot">Gestionar Laboratorios</h1>
                    <hr />
                    <CRow className="align-items-center">
                        <CCol md={9}>
                            <p className="text-muted mb-0">
                                Este módulo permite la gestión de los usuarios laboratorios del sistema.
                            </p>
                        </CCol>
                        <CCol md={3}>
                            <CInputGroup>
                                <CFormInput
                                    type="text"
                                    placeholder="Buscar por código"
                                    aria-label="Buscar por código"
                                    value={filtroCodigo}
                                    onChange={(e) => setFiltroCodigo(e.target.value)}
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
                    <TablaLaboratorio filtroCodigo={filtroCodigo} />
                </div>

                {/* Formulario */}
                <div>
                    <FormularioLaboratorio />
                </div>
            </CCardBody>
        </CCard>
    )
}

export default Laboratorios

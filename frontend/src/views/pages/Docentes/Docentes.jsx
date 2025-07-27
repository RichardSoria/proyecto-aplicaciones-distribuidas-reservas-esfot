import FormularioDocente from '../../../components/docente/FormularioDocente'
import TablaDocente from '../../../components/docente/TablaDocente'
import { CCard, CCardBody, CRow, CCol, CFormInput, CInputGroup, CInputGroupText } from '@coreui/react'
import { useState } from 'react'
import { Search } from 'lucide-react'

const Docentes = () => {
    const [filtroCedula, setFiltroCedula] = useState('')
    return (
        <CCard className="shadow-sm border-0">
            <CCardBody>
                {/* Encabezado */}
                <div className="ms-3 me-3">
                    <h1 className="text-4xl textos-esfot">Gestionar Docentes</h1>
                    <hr />
                    <CRow className="align-items-center">
                        <CCol md={9}>
                            <p className="text-muted mb-0">
                                Este módulo permite la gestión de los usuarios docentes del sistema.
                            </p>
                        </CCol>
                        <CCol md={3}>
                            <CInputGroup>
                                <CFormInput
                                    type="number"
                                    placeholder="Buscar por cédula"
                                    aria-label="Buscar por cédula"
                                    value={filtroCedula}
                                    onChange={(e) => setFiltroCedula(e.target.value)}
                                />
                                <CInputGroupText className='bg-esfot text-white'>
                                    <Search/>
                                </CInputGroupText>
                            </CInputGroup>
                        </CCol>
                    </CRow>
                </div>

                {/* Tabla */}
                <div>
                    <TablaDocente filtroCedula={filtroCedula} />
                </div>

                {/* Formulario */}
                <div>
                    <FormularioDocente />
                </div>
            </CCardBody>
        </CCard>
    )
}

export default Docentes

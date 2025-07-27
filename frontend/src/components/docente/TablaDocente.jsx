import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";
import useDocente from '../../hooks/useDocente'
import { set } from '../../store'
import {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardBody,
} from '@coreui/react'
import { Info } from 'lucide-react';


const TablaDocente = ({ filtroCedula }) => {
    const dispatch = useDispatch()
    const { listarDocentes } = useDocente()
    const { docentes = [] } = useSelector((state) => state)

    const navigate = useNavigate()

    useEffect(() => {
        listarDocentes()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const docentesFiltrados = docentes.filter((docente) =>
        docente.cedula?.toLowerCase().includes(filtroCedula.toLowerCase())
    )

    return (
        <CContainer className='mt-3 mb-3' fluid>
            <CRow className="justify-content-center">
                <CCol>
                    <CCard className="border-0 shadow-sm">
                        <CCardBody className="p-0">
                            <div
                                style={{
                                    maxHeight: '265px',
                                    overflowY: 'auto',
                                    scrollbarWidth: 'none',
                                }}
                                className="table-container"
                            >
                                <table className="table table-hover table-striped mb-0">
                                    <thead className="bg-esfot table-dark text-center align-middle">
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Apellido</th>
                                            <th>Correo</th>
                                            <th>Cédula</th>
                                            <th>Teléfono</th>
                                            <th>Facultad</th>
                                            <th>Último Acceso</th>
                                            <th>Estado</th>
                                            <th>Detalles</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {docentesFiltrados.length === 0 ? (
                                            <tr>
                                                <td className='text-center' colSpan="9">
                                                    No se encontraron coincidencias
                                                </td>
                                            </tr>
                                        ) : (
                                            docentesFiltrados.map((docente) => (
                                                <tr
                                                    key={docente._id}
                                                    onClick={() => dispatch(set({ docenteSeleccionado: { ...docente } }))}
                                                    style={{ cursor: 'pointer' }}
                                                    className="text-center align-middle"
                                                >
                                                    <td>{docente.name}</td>
                                                    <td>{docente.lastName}</td>
                                                    <td>{docente.email}</td>
                                                    <td>{docente.cedula}</td>
                                                    <td>{docente.phone}</td>
                                                    <td>{docente.otherFaculty}</td>
                                                    <td>
                                                        {docente.lastLogin
                                                            ? new Date(docente.lastLogin).toLocaleString('es-EC', {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                hour12: false,
                                                            }).replace(',', '')
                                                            : 'Sin registro'}
                                                    </td>
                                                    <td>
                                                        {docente.status ? (
                                                            <span className="badge bg-success">Habilitado</span>
                                                        ) : (
                                                            <span className="badge bg-danger">Deshabilitado</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="iconos-esfot rounded-circle border-0 bg-transparent justify-content-center align-items-center"
                                                            title="Ver detalles"
                                                            onClick={(e) => {
                                                                navigate(`/admin/docentes/${docente._id}`); e.stopPropagation();
                                                                dispatch(set({ docenteSeleccionado: null }));
                                                            }}
                                                        >
                                                            <Info />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CContainer >
    )
}

export default TablaDocente

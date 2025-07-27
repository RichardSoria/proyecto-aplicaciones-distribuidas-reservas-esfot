import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";
import useAdministrador from '../../hooks/useAdministrador'
import { set } from '../../store'
import {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardBody,
} from '@coreui/react'
import { Info } from 'lucide-react';


const TablaAdministradores = ({ filtroCedula }) => {
    const dispatch = useDispatch()
    const { listarAdministradores } = useAdministrador()
    const { administradores = [] } = useSelector((state) => state)

    const navigate = useNavigate()

    useEffect(() => {
        listarAdministradores()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const administradoresFiltrados = administradores.filter((admin) =>
        admin.cedula?.toLowerCase().includes(filtroCedula.toLowerCase())
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
                                            <th>Último Acceso</th>
                                            <th>Estado</th>
                                            <th>Detalles</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {administradoresFiltrados.length === 0 ? (
                                            <tr>
                                                <td className='text-center' colSpan="8">
                                                    No se encontraron coincidencias
                                                </td>
                                            </tr>
                                        ) : (
                                            administradoresFiltrados.map((admin) => (
                                                <tr
                                                    key={admin._id}
                                                    onClick={() => dispatch(set({ administradorSeleccionado: { ...admin } }))}
                                                    style={{ cursor: 'pointer' }}
                                                    className="text-center align-middle"
                                                >
                                                    <td>{admin.name}</td>
                                                    <td>{admin.lastName}</td>
                                                    <td>{admin.email}</td>
                                                    <td>{admin.cedula}</td>
                                                    <td>{admin.phone}</td>
                                                    <td>
                                                        {admin.lastLogin
                                                            ? new Date(admin.lastLogin).toLocaleString('es-EC', {
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
                                                        {admin.status ? (
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
                                                                navigate(`/admin/administradores/${admin._id}`); e.stopPropagation();
                                                                dispatch(set({ administradorSeleccionado: null }));
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

export default TablaAdministradores

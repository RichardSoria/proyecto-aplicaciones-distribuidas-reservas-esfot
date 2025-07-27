import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";
import useLaboratorio from '../../hooks/useLaboratorio'
import { set } from '../../store'
import {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardBody,
} from '@coreui/react'
import { Info } from 'lucide-react';


const TablaLaboratorio = ({ filtroCodigo }) => {
    const dispatch = useDispatch()
    const { listarLaboratorios } = useLaboratorio()
    const { laboratorios = [] } = useSelector((state) => state)

    const navigate = useNavigate()

    useEffect(() => {
        listarLaboratorios()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const laboratoriosFiltrados = laboratorios.filter((laboratorio) =>
        laboratorio.codigo?.toLowerCase().includes(filtroCodigo.toLowerCase())
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
                                            <th>Código</th>
                                            <th>Capacidad</th>
                                            <th>Equipos PC</th>
                                            <th>Equipos Proyector</th>
                                            <th>Pantallas Interactivas</th>
                                            <th>N° de Reservas</th>
                                            <th>Estado</th>
                                            <th>Detalles</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {laboratoriosFiltrados.length === 0 ? (
                                            <tr>
                                                <td className='text-center' colSpan="9">
                                                    No se encontraron coincidencias
                                                </td>
                                            </tr>
                                        ) : (
                                            laboratoriosFiltrados.map((laboratorio) => (
                                                <tr
                                                    key={laboratorio._id}
                                                    onClick={() => dispatch(set({ laboratorioSeleccionado: { ...laboratorio } }))}
                                                    style={{ cursor: 'pointer' }}
                                                    className="text-center align-middle"
                                                >
                                                    <td>{laboratorio.name}</td>
                                                    <td>{laboratorio.codigo}</td>
                                                    <td>{laboratorio.capacity}</td>
                                                    <td>{laboratorio.equipmentPC ? 'Equipado' : 'No equipado'}</td>
                                                    <td>{laboratorio.equipmentProyector ? 'Equipado' : 'No equipado'}</td>
                                                    <td>{laboratorio.equipmentInteractiveScreen ? 'Equipado' : 'No equipado'}</td>
                                                    <td>{laboratorio.numberReservations}</td>
                                                    <td>
                                                        {laboratorio.status ? (
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
                                                                navigate(`/admin/laboratorios/${laboratorio._id}`); e.stopPropagation();
                                                                dispatch(set({ laboratorioSeleccionado: null }));
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

export default TablaLaboratorio

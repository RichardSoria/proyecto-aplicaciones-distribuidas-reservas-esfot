import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";
import useAula from '../../hooks/useAula'
import { set } from '../../store'
import {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardBody,
} from '@coreui/react'
import { Info } from 'lucide-react';


const TablaAula = ({ filtroName }) => {
    const dispatch = useDispatch()
    const { listarAulas } = useAula()
    const { aulas = [] } = useSelector((state) => state)

    const navigate = useNavigate()

    useEffect(() => {
        listarAulas()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const aulasFiltrados = aulas.filter((aula) =>
        aula.name?.toLowerCase().includes(filtroName.toLowerCase())
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
                                            <th>Capacidad</th>
                                            <th>Descripción</th>
                                            <th>N° de Reservas</th>
                                            <th>Estado</th>
                                            <th>Detalles</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {aulasFiltrados.length === 0 ? (
                                            <tr>
                                                <td className='text-center' colSpan="6">
                                                    No se encontraron coincidencias
                                                </td>
                                            </tr>
                                        ) : (
                                            aulasFiltrados.map((aula) => (
                                                <tr
                                                    key={aula._id}
                                                    onClick={() => dispatch(set({ aulaSeleccionado: { ...aula } }))}
                                                    style={{ cursor: 'pointer' }}
                                                    className="text-center align-middle"
                                                >
                                                    <td>{aula.name}</td>
                                                    <td>{aula.capacity}</td>
                                                    <td>{aula.description}</td>
                                                    <td>{aula.numberReservations}</td>
                                                    <td>
                                                        {aula.status ? (
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
                                                                navigate(`/admin/aulas/${aula._id}`); e.stopPropagation();
                                                                dispatch(set({ aulaSeleccionado: null }));
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

export default TablaAula

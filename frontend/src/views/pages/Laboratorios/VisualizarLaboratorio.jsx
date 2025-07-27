/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import useLaboratorio from '../../../hooks/useLaboratorio'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
    CCard,
    CCardBody,
    CRow,
    CCol,
    CBadge,
    CButton,
} from '@coreui/react'
import clsx from 'clsx'
import { set } from '../../../store'
import { ArrowBigLeft } from 'lucide-react';

const VisualizarLaboratorio = () => {
    const dispatch = useDispatch()
    const { consultLaboratorio } = useLaboratorio()
    const { elementConsult } = useSelector((state) => state)
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            const result = await consultLaboratorio(id)
            if (!result) {
                navigate('/admin/laboratorios')
            }
        }
        fetchData()
    }, [id])

    if (!elementConsult) return null

    const formatFecha = (fecha) => {
        return fecha
            ? new Date(fecha).toLocaleString('es-EC', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            }).replace(',', '')
            : 'Sin registro'
    }

    return (
        <CCard className="shadow-sm border-0">
            <CCardBody>
                {/* Título */}
                <div className="mb-3 ms-3 me-3">
                    <h1 className="text-4xl textos-esfot ">Visualizar Laboratorio</h1>
                    <hr />
                    <CRow className="align-items-center">
                        <CCol md={9} className="mt-2">
                            <p className="text-muted">
                                Este módulo permite visualizar a detalle los datos del Laboratorio seleccionado.
                            </p>
                        </CCol>
                        <CCol md={3} className={clsx('text-md-end', 'text-center')}>
                            <CButton
                                className="btn-esfot-form "
                                onClick={() => {
                                    navigate('/admin/laboratorios');
                                    dispatch(set({ elementConsult: null }));
                                }}
                            >
                                <ArrowBigLeft className="me-2" />
                                Volver a Laboratorios
                            </CButton>
                        </CCol>
                    </CRow>
                </div>

                <CRow className="ms-3 me-3">
                    {/* Datos personales */}
                    <CCol md={3}>
                        <h5 className="subtitulos-esfot mb-3">Datos del Laboratorio</h5>
                        <p><strong>Nombre:</strong> {elementConsult.name}</p>
                        <p><strong>Código:</strong> {elementConsult.codigo}</p>
                        <p><strong>Capacidad:</strong> {elementConsult.capacity} estudiantes</p>
                        <p><strong>Descripción:</strong> {elementConsult.description}</p>
                    </CCol>

                    <CCol md={3}>
                        <h5 className="subtitulos-esfot mb-3">Información del Laboratorio</h5>
                        <p>
                            <strong>Estado:</strong>{' '}
                            <CBadge color={elementConsult.status ? 'success' : 'danger'}>
                                {elementConsult.status ? 'Habilitado' : 'Deshabilitado'}
                            </CBadge>
                        </p>
                        <p>
                            <strong>Equipo PC:</strong>{' '}
                            {elementConsult.equipmentPC ? 'Equipado' : 'No equipado'}
                        </p>
                        <p>
                            <strong>Proyector:</strong>{' '}
                            {elementConsult.equipmentProyector ? 'Equipado' : 'No equipado'}
                        </p>
                        <p>
                            <strong>Pantalla Interactiva:</strong>{' '}
                            {elementConsult.equipmentInteractiveScreen ? 'Equipado' : 'No equipado'}
                        </p>
                        <p><strong>N° de reservaciones:</strong> {elementConsult.numberReservations}</p>
                    </CCol>

                    {/* Fechas */}
                    <CCol md={3}>
                        <h5 className="subtitulos-esfot mb-3">Fechas de Registro</h5>
                        <p><strong>Creación:</strong> {formatFecha(elementConsult.createdDate)}</p>
                        <p><strong>Actualización:</strong> {formatFecha(elementConsult.updatedDate)}</p>
                        <p><strong>Habilitación:</strong> {formatFecha(elementConsult.enableDate)}</p>
                        <p><strong>Deshabilitación:</strong> {formatFecha(elementConsult.disableDate)}</p>
                    </CCol>

                    {/* Responsables */}
                    <CCol md={3}>
                        <h5 className="subtitulos-esfot mb-3">Responsables</h5>
                        <p><strong>Creado por:</strong> {elementConsult.createBy ? `${elementConsult.createBy.name} ${elementConsult.createBy.lastName}` : 'Sin registro'}</p>
                        <p><strong>Actualizado por:</strong> {elementConsult.updateBy ? `${elementConsult.updateBy.name} ${elementConsult.updateBy.lastName}` : 'Sin registro'}</p>
                        <p><strong>Habilitado por:</strong> {elementConsult.enableBy ? `${elementConsult.enableBy.name} ${elementConsult.enableBy.lastName}` : 'Sin registro'}</p>
                        <p><strong>Deshabilitado por:</strong> {elementConsult.disableBy ? `${elementConsult.disableBy.name} ${elementConsult.disableBy.lastName}` : 'Sin registro'}</p>
                    </CCol>
                </CRow>
            </CCardBody>
        </CCard >
    )
}

export default VisualizarLaboratorio

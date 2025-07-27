/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import useAdministrador from '../../../hooks/useAdministrador'
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

const VisualizarAdministrador = () => {
    const dispatch = useDispatch()
    const { consultAdministrador } = useAdministrador()
    const { elementConsult } = useSelector((state) => state)
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            const result = await consultAdministrador(id)
            if (!result) {
                navigate('/admin/administradores')
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
                    <h1 className="text-4xl textos-esfot ">Visualizar Administrador</h1>
                    <hr />
                    <CRow className="align-items-center">
                        <CCol md={9} className="mt-2">
                            <p className="text-muted">
                                Este módulo permite visualizar a detalle los datos del Administrador seleccionado.
                            </p>
                        </CCol>
                        <CCol md={3} className={clsx('text-md-end', 'text-center')}>
                            <CButton
                                className="btn-esfot-form "
                                onClick={() => {
                                    navigate('/admin/administradores');
                                    dispatch(set({ elementConsult: null }));
                                }}
                            >
                                <ArrowBigLeft className="me-2" />
                                Volver a Administradores
                            </CButton>
                        </CCol>
                    </CRow>
                </div>

                <CRow className="ms-3 me-3">
                    {/* Datos personales */}
                    <CCol md={3}>
                        <h5 className="subtitulos-esfot mb-3">Datos Personales</h5>
                        <p><strong>Nombre:</strong> {elementConsult.name}</p>
                        <p><strong>Apellido:</strong> {elementConsult.lastName}</p>
                        <p><strong>Cédula:</strong> {elementConsult.cedula}</p>
                        <p><strong>Correo:</strong> {elementConsult.email}</p>
                        <p><strong>Teléfono:</strong> {elementConsult.phone}</p>
                    </CCol>

                    {/* Cuenta */}
                    <CCol md={3}>
                        <h5 className="subtitulos-esfot mb-3">Información de Cuenta</h5>
                        <p>
                            <strong>Estado:</strong>{' '}
                            <CBadge color={elementConsult.status ? 'success' : 'danger'}>
                                {elementConsult.status ? 'Habilitado' : 'Deshabilitado'}
                            </CBadge>
                        </p>
                        <p><strong>Rol:</strong> {elementConsult.rol ? 'Administrador' : ''}</p>
                        <p><strong>Último Acceso:</strong> {formatFecha(elementConsult.lastLogin)}</p>
                        <p><strong>Intentos fallidos:</strong> {elementConsult.loginAttempts ?? 0}</p>
                        <p>
                            <strong>Fecha de bloqueo:</strong>{' '}
                            {formatFecha(new Date(new Date(elementConsult.lockUntil).getTime() - 30 * 60 * 1000))}
                        </p>
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
                        <p><strong>Creado por:</strong> {elementConsult.createFor ? `${elementConsult.createFor.name} ${elementConsult.createFor.lastName}` : 'Sin registro'}</p>
                        <p><strong>Actualizado por:</strong> {elementConsult.updateFor ? `${elementConsult.updateFor.name} ${elementConsult.updateFor.lastName}` : 'Sin registro'}</p>
                        <p><strong>Habilitado por:</strong> {elementConsult.enableFor ? `${elementConsult.enableFor.name} ${elementConsult.enableFor.lastName}` : 'Sin registro'}</p>
                        <p><strong>Deshabilitado por:</strong> {elementConsult.disableFor ? `${elementConsult.disableFor.name} ${elementConsult.disableFor.lastName}` : 'Sin registro'}</p>
                    </CCol>
                </CRow>
            </CCardBody>
        </CCard >
    )
}

export default VisualizarAdministrador

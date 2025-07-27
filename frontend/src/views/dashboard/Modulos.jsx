/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CContainer,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { RiAdminLine } from 'react-icons/ri'
import { PiStudent, PiChalkboardTeacherLight } from 'react-icons/pi'
import { SiGoogleclassroom } from 'react-icons/si'
import { BsPcDisplay } from 'react-icons/bs'
import { CiCalendar } from 'react-icons/ci'
import { limpiarSeleccionados } from '../../store'

const baseColor = '#f8ad25'
const hoverColor = '#0e4c71'

const allModules = [
  {
    title: 'Administradores',
    Icon: RiAdminLine,
    routes: {
      Admin: '/admin/administradores'
    },
    roles: ['Admin']
  },
  {
    title: 'Docentes',
    Icon: PiChalkboardTeacherLight,
    routes: {
      Admin: '/admin/docentes'
    },
    roles: ['Admin']
  },
  {
    title: 'Estudiantes',
    Icon: PiStudent,
    routes: {
      Admin: '/admin/estudiantes'
    },
    roles: ['Admin']
  },
  {
    title: 'Aulas',
    Icon: SiGoogleclassroom,
    routes: {
      Admin: '/admin/aulas',
      Docente: '/aulas',
      Estudiante: '/aulas'
    },
    roles: ['Admin', 'Docente', 'Estudiante']
  },
  {
    title: 'Laboratorios',
    Icon: BsPcDisplay,
    routes: {
      Admin: '/admin/laboratorios',
      Docente: '/laboratorios',
      Estudiante: '/laboratorios'
    },
    roles: ['Admin', 'Docente', 'Estudiante']
  },
  {
    title: 'Reservas',
    Icon: CiCalendar,
    routes: {
      Admin: '/admin/reservas',
      Docente: '/reservas',
      Estudiante: '/reservas'
    },
    roles: ['Admin', 'Docente', 'Estudiante']
  }
];

const Modulos = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const userRole = useSelector((state) => state.user?.rol)

  React.useEffect(() => {
    dispatch(limpiarSeleccionados())
  }, [])

  // Filtrar módulos por rol
  const filteredModules = allModules.filter((module) => module.roles.includes(userRole))

  // Separar en filas de a 3
  const filas = []
  for (let i = 0; i < filteredModules.length; i += 3) {
    filas.push(filteredModules.slice(i, i + 3))
  }

  const isAdmin = userRole === 'Admin'

  const handleCardClick = (route) => {
    navigate(route)
  }

  return (
    <CContainer
      fluid
      className="px-4 py-4"
      style={{
        minHeight: '650px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: isAdmin ? 'flex-start' : 'center',
      }}
    >
      <div className='d-flex flex-column gap-4'>
        {filas.map((fila, filaIndex) => (
          <CRow className="gy-4" key={filaIndex}>
            {fila.map(({ title, Icon, routes }, colIndex) => {
              const globalIndex = filaIndex * 3 + colIndex
              const isHovered = hoveredIndex === globalIndex
              const route = routes[userRole] || '/'
              return (
                <CCol md="4" sm="12" key={globalIndex}>
                  <CCard
                    className="h-100 border-0 shadow-sm"
                    style={{
                      minHeight: '315px',
                      cursor: 'pointer',
                      backgroundColor: isHovered ? hoverColor : baseColor,
                      color: isHovered ? 'white' : 'black',
                    }}
                    onClick={() => handleCardClick(route)}
                    onMouseEnter={() => setHoveredIndex(globalIndex)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleCardClick(route)
                      }
                    }}
                  >
                    <CCardBody className="text-center d-flex flex-column justify-content-center align-items-center">
                      <Icon size={200} className="mb-3" />
                      <h5 style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{title}</h5>
                    </CCardBody>
                  </CCard>
                </CCol>
              )
            })}
          </CRow>
        ))}
      </div>
    </CContainer>
  )
}

export default Modulos

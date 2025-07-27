import { CNavItem, CNavTitle } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { RiAdminLine } from 'react-icons/ri'
import { PiStudent, PiChalkboardTeacherLight } from 'react-icons/pi'
import { SiGoogleclassroom } from 'react-icons/si'
import { BsPcDisplay } from 'react-icons/bs'
import { CiCalendar } from 'react-icons/ci'
import { GrCluster } from "react-icons/gr";

const _nav = [
  {
    component: CNavItem,
    name: 'Módulos',
    to: '/modulos',
    icon: <GrCluster className="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Usuarios',
    roles: ['Admin'],
  },
  {
    component: CNavItem,
    name: 'Administradores',
    routes: {
      Admin: '/admin/administradores',
    },
    icon: <RiAdminLine className="nav-icon" />,
    roles: ['Admin'],
  },
  {
    component: CNavItem,
    name: 'Docentes',
    routes: {
      Admin: '/admin/docentes',
    },
    icon: <PiChalkboardTeacherLight className="nav-icon" />,
    roles: ['Admin'],
  },
  {
    component: CNavItem,
    name: 'Estudiantes',
    routes: {
      Admin: '/admin/estudiantes',
    },
    icon: <PiStudent className="nav-icon" />,
    roles: ['Admin'],
  },
  {
    component: CNavTitle,
    name: 'Espacios Académicos',
    // Visible para todos los roles, por eso no tiene roles definido
  },
  {
    component: CNavItem,
    name: 'Aulas',
    routes: {
      Admin: '/admin/aulas',
      Docente: '/aulas',
      Estudiante: '/aulas',
    },
    icon: <SiGoogleclassroom className="nav-icon" />,
    roles: ['Admin', 'Docente', 'Estudiante'],
  },
  {
    component: CNavItem,
    name: 'Laboratorios',
    routes: {
      Admin: '/admin/laboratorios',
      Docente: '/laboratorios',
      Estudiante: '/laboratorios',
    },
    icon: <BsPcDisplay className="nav-icon" />,
    roles: ['Admin', 'Docente', 'Estudiante'],
  },
  {
    component: CNavTitle,
    name: 'Agendamientos',
  },
  {
    component: CNavItem,
    name: 'Reservas',
    routes: {
      Admin: '/admin/reservas',
      Docente: '/reservas',
      Estudiante: '/reservas',
    },
    icon: <CiCalendar className="nav-icon" />,
    roles: ['Admin', 'Docente', 'Estudiante'],
  },
]

export default _nav

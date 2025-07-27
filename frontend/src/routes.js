import React from 'react'
import { useSelector } from 'react-redux'

// Módulos
const Modulos = React.lazy(() => import('./views/dashboard/Modulos'))

// Usuarios
const Administradores = React.lazy(() => import('./views/pages/Administradores/Administradores.jsx'))
const VisualizarAdministrador = React.lazy(() => import('./views/pages/Administradores/VisualizarAdministrador.jsx'))

const Docentes = React.lazy(() => import('./views/pages/Docentes/Docentes.jsx'))
const VisualizarDocente = React.lazy(() => import('./views/pages/Docentes/VisualizarDocente.jsx'))

const Estudiantes = React.lazy(() => import('./views/pages/Estudiantes/Estudiante.jsx'))
const VisualizarEstudiante = React.lazy(() => import('./views/pages/Estudiantes/VisualizarEstudiante.jsx'))

// Perfiles
const PerfilAdministrador = React.lazy(() => import('./views/pages/perfiles/PerfilAdministrador.jsx'))
const PerfilDocente = React.lazy(() => import('./views/pages/perfiles/PerfilDocente.jsx'))
const PerfilEstudiante = React.lazy(() => import('./views/pages/perfiles/PerfilEstudiante.jsx'))

// Espacios Acádemicos
const Aulas = React.lazy(() => import('./views/pages/Aulas/Aula.jsx'))
const VisualizarAula = React.lazy(() => import('./views/pages/Aulas/VisualizarAula.jsx'))

const Laboratorios = React.lazy(() => import('./views/pages/Laboratorios/Laboratorio.jsx'))
const VisualizarLaboratorio = React.lazy(() => import('./views/pages/Laboratorios/VisualizarLaboratorio.jsx'))

// Reservas
const Reservas = React.lazy(() => import('./views/pages/Reservas/Reservas.jsx'))

// General
const LaboratorioGeneral = React.lazy(() => import('./views/pages/Laboratorios/LaboratorioGeneral.jsx'))
const AulaGeneral = React.lazy(() => import('./views/pages/Aulas/AulaGeneral.jsx'))
const ReservasGeneral = React.lazy(() => import('./views/pages/Reservas/ReservasGeneral.jsx'))
const MisReservas = React.lazy(() => import('./views/pages/Reservas/MisReservas.jsx'))

const allRoutes = [
  { path: '/modulos', name: 'Módulos', element: Modulos },
  { path: '/admin/administradores', name: 'Administradores', element: Administradores, roles: ['Admin'] },
  { path: '/admin/administradores/:id', name: 'Visualizar Administrador', element: VisualizarAdministrador, roles: ['Admin'] },
  { path: '/admin/docentes', name: 'Docentes', element: Docentes, roles: ['Admin'] },
  { path: '/admin/docentes/:id', name: 'Visualizar Docente', element: VisualizarDocente, roles: ['Admin'] },
  { path: '/admin/estudiantes', name: 'Estudiantes', element: Estudiantes, roles: ['Admin'] },
  { path: '/admin/estudiantes/:id', name: 'Visualizar Estudiante', element: VisualizarEstudiante, roles: ['Admin'] },
  { path: '/admin/aulas', name: 'Aulas', element: Aulas, roles: ['Admin'] },
  { path: '/admin/aulas/:id', name: 'Visualizar Aula', element: VisualizarAula, roles: ['Admin'] },
  { path: '/admin/laboratorios', name: 'Laboratorios', element: Laboratorios, roles: ['Admin'] },
  { path: '/admin/laboratorios/:id', name: 'Visualizar Laboratorio', element: VisualizarLaboratorio, roles: ['Admin'] },
  { path: '/admin/reservas', name: 'Reservas', element: Reservas, roles: ['Admin'] },
  { path: '/admin/perfil', name: 'Perfil Administrador', element: PerfilAdministrador, roles: ['Admin'] },
  { path: '/docente/perfil', name: 'Perfil Docente', element: PerfilDocente, roles: ['Docente'] },
  { path: '/estudiante/perfil', name: 'Perfil Estudiante', element: PerfilEstudiante, roles: ['Estudiante'] },
  { path: '/laboratorios', name: 'Laboratorios', element: LaboratorioGeneral, roles: ['Admin', 'Docente', 'Estudiante'] },
  { path: '/aulas', name: 'Aulas', element: AulaGeneral, roles: ['Admin', 'Docente', 'Estudiante'] },
  { path : '/reservas', name: 'Reservas', element: ReservasGeneral, roles: ['Admin', 'Docente', 'Estudiante'] },
  { path: '/mis-reservas', name: 'Mis Reservas', element: MisReservas, roles: ['Admin', 'Docente', 'Estudiante'] },
]

export function useRoutesByRole() {
  const role = useSelector((state) => state.user?.rol)
  return allRoutes.filter((r) => !r.roles || r.roles.includes(role))
}


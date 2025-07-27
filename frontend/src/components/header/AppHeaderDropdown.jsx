import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilLockLocked,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import avatar from '../../assets/images/avatar.svg'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const AppHeaderDropdown = () => {
  const role = useSelector((state) => state.user?.role || state.user?.rol)
  const navigate = useNavigate()

  let roleRoute = ''

  switch (role) {
    case 'Admin':
      roleRoute = '/admin/perfil'
      break
    case 'Docente':
      roleRoute = '/docente/perfil'
      break
    case 'Estudiante':
      roleRoute = '/estudiante/perfil'
      break
    default:
      roleRoute = '/'
      break
  }

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/logout`, {}, { withCredentials: true })
      toast.success('¡Sesión cerrada exitosamente!')
      navigate('/iniciar-sesion')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar} size='md' />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-esfot fw-bold text-white mb-2">Cuenta</CDropdownHeader>
        <CDropdownItem className='c-dropdown-item' onClick={() => navigate(roleRoute)}>
          <CIcon icon={cilUser} className="me-2" />
          Perfil
        </CDropdownItem>
        <CDropdownItem className='c-dropdown-item' onClick={() => navigate('/mis-reservas')}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Mis Reservas
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem className='c-dropdown-item' onClick={handleLogout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Cerrar Sesión
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown

import axios from "axios";
import { useDispatch, useSelector } from 'react-redux'
import { set } from '../store'

const usePerfil = () => {
    const dispatch = useDispatch()

    const consultarPerfil = async (role) => {
        try {
            switch (role) {
                case 'Admin':
                    const { data: adminData } = await axios.get(`${import.meta.env.VITE_API_URL}/admin/profile`, { withCredentials: true })
                    dispatch(set({ perfil: adminData }))
                    break;
                case 'Docente':
                    const { data: docenteData } = await axios.get(`${import.meta.env.VITE_API_URL}/docente/profile`, { withCredentials: true })
                    dispatch(set({ perfil: docenteData }))
                    break;
                case 'Estudiante':
                    const { data: estudianteData } = await axios.get(`${import.meta.env.VITE_API_URL}/estudiante/profile`, { withCredentials: true })
                    dispatch(set({ perfil: estudianteData }))
                    break;
                default:
                    throw new Error('Rol no reconocido');
            }
        } catch (error) {
            console.error('Error al consultar perfil:', error)
            dispatch(set({ perfil: null }))
        }
    };

    return {
        consultarPerfil
    }
}

export default usePerfil;
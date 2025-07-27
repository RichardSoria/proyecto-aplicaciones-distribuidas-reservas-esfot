import axios from 'axios'
import { useDispatch } from 'react-redux'
import { set } from '../store'

const useEstudiante = () => {
    const dispatch = useDispatch()

    const listarEstudiantes = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/estudiante/estudiantes`, { withCredentials: true })
            dispatch(set({ estudiantes: data }))
        } catch (err) {
            console.error('Error al obtener estudiantes', err)
        }
    }

    const consultEstudiante = async (id) => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/estudiante/estudiantes/${id}`, { withCredentials: true })
            dispatch(set({ elementConsult: data }))
            return data
        } catch (err) {
            console.error('Error al consultar estudiantes', err)
            dispatch(set({ elementConsult: null }))
            return null
        }
    };

    return {
        listarEstudiantes,
        consultEstudiante
    }
}

export default useEstudiante

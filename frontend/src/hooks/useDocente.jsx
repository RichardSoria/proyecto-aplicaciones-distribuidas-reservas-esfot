import axios from 'axios'
import { useDispatch } from 'react-redux'
import { set } from '../store'

const useDocente = () => {
    const dispatch = useDispatch()

    const listarDocentes = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/docente/docentes`, { withCredentials: true })
            dispatch(set({ docentes: data }))
        } catch (err) {
            console.error('Error al obtener docentes', err)
        }
    }

    const consultDocente = async (id) => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/docente/docentes/${id}`, { withCredentials: true })
            dispatch(set({ elementConsult: data }))
            return data
        } catch (err) {
            console.error('Error al consultar docentes', err)
            dispatch(set({ elementConsult: null }))
            return null
        }
    };

    return {
        listarDocentes,
        consultDocente
    }
}

export default useDocente

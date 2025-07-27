import axios from 'axios'
import { useDispatch } from 'react-redux'
import { set } from '../store'

const useLaboratorio = () => {
    const dispatch = useDispatch()

    const listarLaboratorios = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/laboratorio/laboratorios`, { withCredentials: true })
            dispatch(set({ laboratorios: data }))
        } catch (err) {
            console.error('Error al obtener laboratorios', err)
        }
    }

    const consultLaboratorio = async (id) => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/laboratorio/laboratorios/${id}`, { withCredentials: true })
            dispatch(set({ elementConsult: data }))
            return data
        } catch (err) {
            console.error('Error al consultar laboratorios', err)
            dispatch(set({ elementConsult: null }))
            return null
        }
    };

    return {
        listarLaboratorios,
        consultLaboratorio
    }
}

export default useLaboratorio

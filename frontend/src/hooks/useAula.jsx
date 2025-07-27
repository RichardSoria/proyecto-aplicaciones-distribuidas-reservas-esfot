import axios from 'axios'
import { useDispatch } from 'react-redux'
import { set } from '../store'

const useAula = () => {
    const dispatch = useDispatch()

    const listarAulas = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/aula/aulas`, { withCredentials: true })
            dispatch(set({ aulas: data }))
        } catch (err) {
            console.error('Error al obtener aulas', err)
        }
    }

    const consultAula = async (id) => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/aula/aulas/${id}`, { withCredentials: true })
            dispatch(set({ elementConsult: data }))
            return data
        } catch (err) {
            console.error('Error al consultar aulas', err)
            dispatch(set({ elementConsult: null }))
            return null
        }
    };

    return {
        listarAulas,
        consultAula
    }
}

export default useAula

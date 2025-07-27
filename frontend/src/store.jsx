import { legacy_createStore as createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  administradorSeleccionado: null,
  docenteSeleccionado: null,
  estudianteSeleccionado: null,
  aulaSeleccionada: null,
  laboratorioSeleccionado: null,
  elementConsult: null,
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    case 'limpiarSeleccionados':
      return {
        ...state,
        administradorSeleccionado: null,
        docenteSeleccionado: null,
        estudianteSeleccionado: null,
        elementConsult: null,
      }
    default:
      return state
  }
}

export const set = (payload) => ({ type: 'set', ...payload })
export const limpiarSeleccionados = () => ({ type: 'limpiarSeleccionados' })


const store = createStore(changeState)
export default store

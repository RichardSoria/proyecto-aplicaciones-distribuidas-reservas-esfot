import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4 bg-white">
      <div>
        <a href="https://esfot.epn.edu.ec" target="_blank" rel="noopener noreferrer">
          ESFOT
        </a>
        <span className="ms-1">&copy; 2025 Sistema de Reservas de Aulas y Laboratorios.</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)

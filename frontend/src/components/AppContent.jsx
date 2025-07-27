import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer } from '@coreui/react'

import { useRoutesByRole } from '../routes'

const AppContent = () => {
  const routes = useRoutesByRole()
  return (
    <CContainer className="px-4" lg>
      <Routes>
        {routes.map((route, idx) => {
          return (
            route.element && (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                name={route.name}
                element={<route.element />}
              />
            )
          )
        })}
        <Route path="*" element={<Navigate to="/modulos" replace />} />
      </Routes>
    </CContainer>
  )
}

export default React.memo(AppContent)

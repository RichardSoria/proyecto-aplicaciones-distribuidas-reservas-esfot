import React from 'react'
import { useLocation } from 'react-router-dom'
import { useRoutesByRole } from '../routes'
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import { useSelector } from 'react-redux'


// Función para hacer matching de rutas con parámetros
const matchRoute = (pathname, routes) => {
  for (const route of routes) {
    // Convertir ruta con :param a regex, por ejemplo '/admin/administradores/:id' -> /^\/admin\/administradores\/[^/]+$/
    const pathRegex = new RegExp(
      '^' +
      route.path
        .replace(/:[^\s/]+/g, '([^/]+)') // Reemplaza :param por grupo capturador
        .replace(/\//g, '\\/') +
      '$'
    )
    if (pathRegex.test(pathname)) {
      return route
    }
  }
  return null
}

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname
  const { elementConsult } = useSelector((state) => state)
  const routes = useRoutesByRole()

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []

    location.split('/').reduce((prev, curr, index, array) => {
      if (!curr) return prev
      const currentPathname = `${prev}/${curr}`

      const matchedRoute = matchRoute(currentPathname, routes)

      const isLast = index + 1 === array.length

      if (matchedRoute) {
        let name = matchedRoute.name
        if (
          matchedRoute.path.includes(':') &&
          isLast &&
          elementConsult &&
          elementConsult.name
        ) {
          name = `${elementConsult.name} ${elementConsult.lastName || elementConsult.codigo || ''}`;
        }
        breadcrumbs.push({
          pathname: currentPathname,
          name,
          active: isLast,
        })
      }
      return currentPathname
    }, '')

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <CBreadcrumb className="my-0">
      <CBreadcrumbItem href="/modulos">Inicio</CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => (
        <CBreadcrumbItem
          key={index}
          {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
        >
          {breadcrumb.name}
        </CBreadcrumbItem>
      ))}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)

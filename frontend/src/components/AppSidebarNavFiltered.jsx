import React from 'react'
import { useSelector } from 'react-redux'
import navigation from '../_nav'
import { AppSidebarNav } from './AppSidebarNav'

const filterNavByRole = (items, role) => {
    return items
        .filter(item => !item.roles || item.roles.includes(role))
        .map(item => {
            const to = item.routes ? item.routes[role] : item.to
            return {
                ...item,
                to,
            }
        })
        .filter(Boolean)
}

const AppSidebarNavFiltered = () => {
    const userRole = useSelector(state => state.user?.rol)

    const filteredNav = filterNavByRole(navigation, userRole)

    return <AppSidebarNav items={filteredNav} />
}

export default AppSidebarNavFiltered

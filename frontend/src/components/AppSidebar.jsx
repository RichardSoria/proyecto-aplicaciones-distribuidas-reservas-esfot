import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import AppSidebarNavFiltered from './AppSidebarNavFiltered'

import logo from 'src/assets/images/logo_esfot_buho.png';
import logo_buho from 'src/assets/images/logo_buho.png';


const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <img
            src={logo_buho}
            alt="Logo ESFOT mini"
            width={45}
            className="sidebar-brand-narrow bg-white rounded p-2"
          />
          <img
            src={logo}
            alt="Logo ESFOT completo"
            width={218}
            className={`sidebar-brand-full bg-white rounded p-2`}
          />
        </CSidebarBrand>
      </CSidebarHeader>
      <AppSidebarNavFiltered />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          className="nav-toggler"
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)

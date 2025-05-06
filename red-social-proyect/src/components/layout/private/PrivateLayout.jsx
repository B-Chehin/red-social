import React from 'react'
import { Header } from './Header'
import { Outlet } from 'react-router-dom'
import { Sidbar } from './Sidbar'

export const PrivateLayout = () => {
  return (
    <> 
      {/**LAYOUT PUBLIC*/}

      {/**Cabecera y navegacion */}    
      <Header />

      {/**Contenido principal */}
      <section className="layout__container">
        <Outlet/>
      </section>

      {/**Barra lateral */}
      <Sidbar/>
    </>
  )
}

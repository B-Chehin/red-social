import React from 'react'
import { Header } from './Header'
import { Outlet } from 'react-router-dom'

export const PublicLayout = () => {
  return (
    <> 
      {/**LAYOUT PUBLIC*/}
      <Header />

      {/**Contenido principal */}
      <section className="layout__container">
        <Outlet/>
      </section>
    </>
  )
}

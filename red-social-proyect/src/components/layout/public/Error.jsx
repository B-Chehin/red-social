import React from 'react'
import { Header } from './Header'
import { Link } from 'react-router-dom'

export const Error = () => {
  return (
    <>
    <Header />

    <div className='error'>
        <h1 className='error__title'>404</h1>
        <h2 className='error__subtitle'>Lo siento, la página que buscas no existe</h2>
        <p className='error__paragraph'>Por favor, verifica la URL y vuelve a intentarlo.</p>
        <Link to="/" className='error__link'>Volver al inicio</Link>
    </div>
    </>
  )
}

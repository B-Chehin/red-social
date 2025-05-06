import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PublicLayout } from '../components/layout/public/PublicLayout'
import { Login } from '../components/user/Login'
import { Registr } from '../components/user/Registr'
import { Feed } from '../components/publication/Feed'
import { PrivateLayout } from '../components/layout/private/PrivateLayout'

export const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        {/**Rutas publicas */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registr />} />
        </Route>

        {/**Rutas privadas */}
        <Route path="/social" element={<PrivateLayout />}>
          <Route index element={<Feed />} />
          <Route path='feed' element={<Feed />} />

        </Route>


        
        
      </Routes>
    </BrowserRouter>
  )
}

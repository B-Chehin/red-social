import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PublicLayout } from '../components/layout/public/PublicLayout'
import { Login } from '../components/user/Login'
import { Registr } from '../components/user/Registr'

export const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registr />} />
        </Route>

        
        
      </Routes>
    </BrowserRouter>
  )
}

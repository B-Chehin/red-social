import React, { useEffect } from 'react'
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const Logout = () => {
  
  const { setAuth, setCounters } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Vaciar el localstorage
    localStorage.clear();

    // Setear estados globales a vacio
    setAuth({});
    setCounters({});

    // Navigate (Redirect al login)
    navigate('/login');
    
    
  }
  useEffect(() => {
    handleLogout();
  }, [])
  
    return (
    <div>Cerrando sesion</div>
  )
}

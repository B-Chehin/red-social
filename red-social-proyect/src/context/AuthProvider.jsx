import React, { useState, useEffect, createContext } from 'react';
import Global from '../config/Global';


const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [auth, setAuth] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authUser();
    }
  }, []);
  
  const authUser = async () => {
    // Sacar datos del usuario identificado del local storage
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!user || !token) {
      return false;
    }

    // Transformar los datos a un objeto de javascript
    const userObj = JSON.parse(user);
    const userId = userObj.id;

    const request = await fetch(`${Global.url}user/profile/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
    });

    const data = await request.json();

    if (data.status !== "success") {
      return false;
    }
    // Peticion ajax al backend que compruebe el token
    // que me devuelva todos los datos del susuarios

    // Setear el estado de auth
    setAuth(data.user);
  }


  return (
    <AuthContext.Provider value={{ auth, setAuth}}>
      {children}
    </AuthContext.Provider>
  )
}

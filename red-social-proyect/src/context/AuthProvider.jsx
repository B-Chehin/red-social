import React, { useState, useEffect, createContext } from 'react';
import { Global } from '../helpers/Global';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [auth, setAuth] = useState({});
  const [counters, setCounters] = useState({});
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    authUser();
  }, []);
  
  const authUser = async () => {
    // Sacar datos del usuario identificado del local storage
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!user || !token) {
      setLoading(false)
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
    
    const requestCounters = await fetch(`${Global.url}user/counters/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
    });
    console.log(requestCounters);
    console.log(userId);
    

    const dataCounters = await requestCounters.json();

    // Setear el estado de auth y counters
    setAuth(data.user);
    setCounters(dataCounters);
    setLoading(false);
  }


  return (
    <AuthContext.Provider value={{ auth, setAuth, counters, setCounters, loading}}>
      {children}
    </AuthContext.Provider>
  )
}

import React from "react";
import { Header } from "./Header";
import { Outlet } from "react-router-dom";
import { Sidbar } from "./Sidbar";
import { useAuth } from "../context/AuthProvider";
import { Navigate } from "react-router-dom";


export const PrivateLayout = () => {
  const { auth, loading } = useAuth();

  if (loading) {
    return (<div className="loading">
      <h1 className="loading__title">Cargando...</h1>
    </div>);
  } else {
    return (
      <>
        {/**LAYOUT PUBLIC*/}

        {/**Cabecera y navegacion */}
        <Header />

        {/**Contenido principal */}
        <section className="layout__container">
          {auth._id ? <Outlet /> : <Navigate to="/login" />}
        </section>

        {/**Barra lateral */}
        <Sidbar />
      </>
    );
  }
};

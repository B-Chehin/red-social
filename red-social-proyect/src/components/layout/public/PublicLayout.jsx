import React from "react";
import { Header } from "./Header";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export const PublicLayout = () => {
  const { auth } = useAuth();

  return (
    <>
      {/**LAYOUT PUBLIC*/}
      <Header />

      {/**Contenido principal */}
      <section className="layout__container">
        {auth._id ? <Outlet /> : <Navigate to="/social" />}
      </section>
    </>
  );
};

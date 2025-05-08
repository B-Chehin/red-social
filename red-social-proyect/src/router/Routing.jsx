import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PublicLayout } from "../components/layout/public/PublicLayout";
import { Login } from "../components/user/Login";
import { Register } from "../components/user/Register";
import { Feed } from "../components/publication/Feed";
import { PrivateLayout } from "../components/layout/private/PrivateLayout";
import { Error } from "../components/layout/public/Error";
import { AuthProvider } from "../context/AuthProvider";

export const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/**Rutas publicas */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
        </Route>

        {/**Rutas privadas */}
        <AuthProvider>
          <Route path="/social" element={<PrivateLayout />}>
            <Route index element={<Feed />} />
            <Route path="feed" element={<Feed />} />
          </Route>
        </AuthProvider>
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
};

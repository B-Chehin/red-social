import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PublicLayout } from "../components/layout/public/PublicLayout";
import { Login } from "../components/user/Login";
import { Register } from "../components/user/Register";
import { Feed } from "../components/publication/Feed";
import { PrivateLayout } from "../components/layout/private/PrivateLayout";
import { Error } from "../components/layout/public/Error";
import { AuthProvider } from "../context/AuthProvider";
import { Logout } from "../components/user/Logout";
import { People } from "../components/user/People";
import { Config } from "../components/user/Config";
import { Followers } from "../components/follow/Followers";
import { Following } from "../components/follow/Following";

export const Routing = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/**Rutas publicas */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
          </Route>

          {/**Rutas privadas */}

          <Route path="/social" element={<PrivateLayout />}>
            <Route index element={<Feed />} />
            <Route path="feed" element={<Feed />} />
            <Route path="logout" element={<Logout />} />
            <Route path="gente" element={<People />} />
            <Route path="ajustes" element={<Config />} />
            <Route path="siguiendo/:userid" element={<Following />} />
            <Route path="seguidores/:userid" element={<Followers />} />
          </Route>
          <Route path="*" element={<Error />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

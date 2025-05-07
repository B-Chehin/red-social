import React from "react";
import { useForm } from "../../hooks/useForm";
import { Global } from "../../helpers/Global";
import { useState } from "react";

export const Register = () => {
  const { form, changed } = useForm({});
  const [saved, setSaved] = useState("not_sended");

  const saveUser = async (e) => {
    e.preventDefault();

    let newUser = form;

    const request = await fetch(`${Global.url}user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    const data = await request.json();

    if (data.status !== "success") {
      setSaved("error");
    }else{
      setSaved("saved");
    }

  };

  return (
    <>
      <header className="navbar__header content__header--public">
        <h1 className="content__title">Registro</h1>
      </header>

      <div className="content__posts">

      {saved === "saved" ? <strong className="alert alert-success">Usuario Registrado correctamente</strong> : ""}
      {saved === "error" ? <strong className="alert alert-danger">Error al Registrar el usuario</strong> : ""}
        <form className="register-form" onSubmit={saveUser}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              onChange={changed}
            />
          </div>
          <div className="form-group">
            <label htmlFor="surname">Apellidos</label>
            <input
              type="text"
              name="surname"
              placeholder="Apellido"
              onChange={changed}
            />
          </div>
          <div className="form-group">
            <label htmlFor="nick">Nickname</label>
            <input
              type="text"
              name="nick"
              placeholder="Nickname"
              onChange={changed}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo Electronico</label>
            <input
              type="email"
              name="email"
              placeholder="Correo Electronico"
              onChange={changed}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              onChange={changed}
            />
          </div>
          <input type="submit" value="Registrate" className="btn btn-success" />
        </form>
      </div>
    </>
  );
};

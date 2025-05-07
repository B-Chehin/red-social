import React from 'react'
import { useForm } from '../../hooks/useForm'
import { Global } from '../../helpers/Global';
import { useState } from 'react';

export const Login = () => {

  const [login, setLogin] = useState("not_sended");
  const { form, changed} = useForm({});

  const loginUser = async (e) => {
    e.preventDefault();

    let userToLogin = form;

    const request = await fetch(`${Global.url}user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userToLogin),
    });

    const data = await request.json();

    if (data.status !== "success") {
      setLogin("error");
    }else{
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setLogin("login");
    }

  };

  return (
    <>
    <header className="navbar__header content__header--public">
        <h1 className="content__title">Login</h1>
      </header>
      {login === "login" ? <strong className="alert alert-success">Usuario Identificado correctamente</strong> : ""}
      {login === "error" ? <strong className="alert alert-danger">Error al Identificar el usuario</strong> : ""}
      <div className="content__posts">
        <form className= "form-login" onSubmit={loginUser}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" placeholder="Email" onChange={changed}/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" placeholder="Password" onChange={changed}/>
          </div>
          <input className='btn btn-success' type="submit" value="Identificate" />
        </form>
      </div>
    </> 
  )
}

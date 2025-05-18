import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Global } from "../../helpers/Global";
import avatar from "../../assets/img/user.png";
import { SerializeForm } from "../../helpers/SerializeForm";

export const Config = () => {
    const [saved, setSaved] = useState("not_saved");
    const {auth, setAuth} = useAuth();
    


    const updateUser = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        
        let newDataUser = SerializeForm(e.target); // Recoger datos del form
        delete newDataUser.file0; // Elimino la imagen por que no hace falta

        // Actualizar usuario en mongo
        const response = await fetch(`${Global.url}user/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(newDataUser)
        });

        const data = await response.json();
        
        if(data.status === "success" && data.userUpdated){
            delete data.userUpdated.password;

            setSaved("saved");
            setAuth(data.userUpdated);
        }else{
            setSaved("error");
        }

        // Subida de imagenes
        if(e.target.file0.files[0]){
            // Recoger imagen a subir
            const formData = new FormData();
            formData.append("file0", e.target.file0.files[0]);

            const responseImage = await fetch(`${Global.url}user/upload`, {
                method: "POST",
                headers: {
                    "Authorization": token
                },
                body: formData
            });

            const dataImagen = await responseImage.json();
            console.log(dataImagen)
            if(dataImagen.status === "success" && dataImagen.user){
                delete dataImagen.user.password;
                setAuth(dataImagen.user);
                setSaved("saved");
            }else{
                setSaved("error");
            }
        }

    }
  return (
    <>
      <header className="navbar__header content__header--public">
        <h1 className="content__title">Ajustes</h1>
      </header>

      <div className="content__posts">
        {saved === "saved" ? (
          <strong className="alert alert-success">
            Usuario actualizado correctamente
          </strong>
        ) : (
          ""
        )}
        {saved === "error" ? (
          <strong className="alert alert-danger">
            Error al actualizar el usuario
          </strong>
        ) : (
          ""
        )}
        <form className="config-form" onSubmit={updateUser}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              name="name"
              defaultValue={auth.name}
            />
          </div>
          <div className="form-group">
            <label htmlFor="surname">Apellidos</label>
            <input
              type="text"
              name="surname"
              defaultValue={auth.surname}
            />
          </div>
          <div className="form-group">
            <label htmlFor="nick">Nickname</label>
            <input
              type="text"
              name="nick"
              defaultValue={auth.nick}
            />
          </div>
          <div className="form-group">
            <label htmlFor="bio">Biografia</label>
            <textarea
              name="bio"
              defaultValue={auth.bio}
                />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo Electronico</label>
            <input
              type="email"
              name="email"
              defaultValue={auth.email}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              name="password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="file0">Avatar</label>
            <div className="avatar">
              {auth.image != "default.png" && <img src={Global.url + "user/avatar/" + auth.image} className="list-end__img" alt="Foto de perfil"/>}
              {auth.image == "default.png" && <img src={avatar} className="list-end__img" alt="Foto de perfil"/>}
            </div>
            <br></br>
            <input type="file" name="file0" id="file"/>
          </div>
          <br></br>
          <input type="submit" value="Actualizar" className="btn btn-success" />
        </form>
      </div>
      <br/>
    </>
  );
};

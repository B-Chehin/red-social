import React, { useEffect, useState } from "react";
import avatar from "../../assets/img/user.png";
import { GetUser } from "../../helpers/GetUser";
import { Link, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { GetCounters } from "../servicies/user/GetCounters";
import { Global } from "../../helpers/Global";

export const Profile = () => {
  const { auth } = useAuth();
  const [counters, setCounters] = useState({});
  const params = useParams();

  const [profile, setProfile] = useState({});

  const getUserProfile = async () => {
    const data = await GetUser(params.userid);
    setProfile(data);
  };

  const getCounters = async () => {
    const token = localStorage.getItem("token");
    const data = await GetCounters(params.userid, token);
    setCounters(data);
  };

  useEffect(() => {
    getUserProfile();
    getCounters();
  }, []);

  useEffect(() => {
    getUserProfile();
    getCounters();
  }, [params]);

  return (
    <>
      <header className="aside__profile-info">
        <div className="profile-info__general-info">
          <div className="general-info__container-avatar">
            {profile.image != "default.png" && (
              <img
                src={Global.url + "user/avatar/" + profile.image}
                className="container-avatar__img"
                alt="Foto de perfil"
              />
            )}
            {profile.image == "default.png" && (
              <img
                src={avatar}
                className="container-avatar__img"
                alt="Foto de perfil"
              />
            )}
          </div>

          <div className="general-info__container-names">
            <div className="container-names__name">
              <h1>
                {profile.name} {profile.surname}
              </h1>
              <button className="content__button content__button--right">
                Seguir
              </button>
            </div>
            <h2 className="container-names__nickname">{profile.nickname}</h2>
            <p>{profile.bio}</p>
          </div>
        </div>

        <div className="profile-info__stats">
          <div className="stats__following">
            <Link to={`/social/siguiendo/${profile._id}`} className="following__link">
              <span className="following__title">Siguiendo</span>
              <span className="following__number">{counters.following >= 1 ? (counters.following) : "0"}</span>
            </Link>
          </div>
          <div className="stats__following">
            <Link to={`/social/seguidores/${profile._id}`} className="following__link">
              <span className="following__title">Seguidores</span>
              <span className="following__number">{counters.followed >= 1 ? (counters.followed) : "0"}</span>
            </Link>
          </div>

          <div className="stats__following">
            <Link to={`/social/perfil/${profile._id}`} className="following__link">
              <span className="following__title">Publicaciones</span>
              <span className="following__number">{counters.publications >= 1 ? (counters.publications) : "0"}</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="content__posts">
        <article className="posts__post">
          <div className="post__container">
            <div className="post__image-user">
              <a href="#" className="post__image-link">
                <img
                  src={avatar}
                  className="post__user-image"
                  alt="Foto de perfil"
                />
              </a>
            </div>

            <div className="post__body">
              <div className="post__user-info">
                <a href="#" className="user-info__name">
                  {profile.name}
                </a>
                <span className="user-info__divider"> | </span>
                <a href="#" className="user-info__create-date">
                  Hace 1 hora
                </a>
              </div>

              <h4 className="post__content">Hola, buenos dias.</h4>
            </div>
          </div>

          <div className="post__buttons">
            <a href="#" className="post__button">
              <i className="fa-solid fa-trash-can"></i>
            </a>
          </div>
        </article>
      </div>
      <div className="content__container-btn">
        <button className="content__btn-more-post">
          Ver mas publicaciones
        </button>
      </div>
    </>
  );
};

import React, { useEffect, useState } from "react";
import avatar from "../../assets/img/user.png";
import { GetUser } from "../../helpers/GetUser";
import { Link, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { GetCounters } from "../servicies/user/GetCounters";
import { Global } from "../../helpers/Global";
import { PostFollow } from "../servicies/follow/PostFollow";
import { PostUnfollow } from "../servicies/follow/PostUnfollow";
import { GetAllPublications } from "../servicies/publication/GetAllPublications";
import { PublicationList } from "../servicies/publication/PublicationList";

export const Profile = () => {
  const { auth } = useAuth();
  const params = useParams();
  const [counters, setCounters] = useState({});
  const [publications, setPublications] = useState([]);
  const [profile, setProfile] = useState({});
  const [isFollowing, setIsFollowing] = useState(false);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);

  const getUserProfile = async () => {
    const data = await GetUser(params.userid, setProfile);
    if (data.following) {
      setIsFollowing(true);
    }
  };

  const getCounters = async () => {
    const token = localStorage.getItem("token");
    const data = await GetCounters(params.userid, token);
    setCounters(data);
  };

  useEffect(() => {
    getUserProfile();
    getCounters();
    getPublications(1, true);
  }, []);

  useEffect(() => {
    getUserProfile();
    getCounters();
    setMore(true);
    getPublications(1, true);
  }, [params]);

  const follow = async (id) => {
    const data = await PostFollow(id);

    if (data.status == "success") {
      setIsFollowing(true);
    }
  };

  const unfollow = async (id) => {
    const data = await PostUnfollow(id);
    if (data.status == "success") {
      setIsFollowing(false);
    }
  };

  const getPublications = async (nextpage = 1, newProfile = false) => {
    const data = await GetAllPublications(params.userid, nextpage);
    if(data.status === "error"){
      setMore(false);
      return;
    }
    if(!newProfile && publications.length >= 1){
      setPublications([...publications, ...data.publications]);
    }else if(newProfile){
      setPublications(data.publications);
      setMore(true);
      setPage(1);
    }
    if(!newProfile && publications.length >= data.total - data.publications.length){
      setMore(false);
    }    

    if(data.pages <= 1){
      setMore(false);
    }


  };

  

  

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
              {auth._id !== profile._id &&
                (isFollowing ? (
                  <button
                    className="content__button content__button--right post__button"
                    onClick={() => unfollow(profile._id)}
                  >
                    Dejar de seguir
                  </button>
                ) : (
                  <button
                    className="content__button content__button--right"
                    onClick={() => follow(profile._id)}
                  >
                    Seguir
                  </button>
                ))}
            </div>
            <h2 className="container-names__nickname">{profile.nickname}</h2>
            <p>{profile.bio}</p>
          </div>
        </div>

        <div className="profile-info__stats">
          <div className="stats__following">
            <Link
              to={`/social/siguiendo/${profile._id}`}
              className="following__link"
            >
              <span className="following__title">Siguiendo</span>
              <span className="following__number">
                {counters.following >= 1 ? counters.following : "0"}
              </span>
            </Link>
          </div>
          <div className="stats__following">
            <Link
              to={`/social/seguidores/${profile._id}`}
              className="following__link"
            >
              <span className="following__title">Seguidores</span>
              <span className="following__number">
                {counters.followed >= 1 ? counters.followed : "0"}
              </span>
            </Link>
          </div>

          <div className="stats__following">
            <Link
              to={`/social/perfil/${profile._id}`}
              className="following__link"
            >
              <span className="following__title">Publicaciones</span>
              <span className="following__number">
                {counters.publications >= 1 ? counters.publications : "0"}
              </span>
            </Link>
          </div>
        </div>
      </header>

      <PublicationList 
      publications={publications}
      getPublications={getPublications}
      more={more} 
      setMore={setMore}
      page={page}
      setPage={setPage}
      />

      
      
      <br/>
    </>
  );
};

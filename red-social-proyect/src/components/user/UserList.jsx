import React from "react";
import { Global } from "../../helpers/Global";
import { PostFollow } from "../servicies/follow/PostFollow";
import { PostUnfollow } from "../servicies/follow/PostUnfollow";
import useAuth from "../../hooks/useAuth";
import avatar from "../../assets/img/user.png";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";

export const UserList = ({
  users,
  getUsers,
  following,
  setFollowing,
  loading,
  more,
}) => {
  const { auth } = useAuth();

  const follow = async (id) => {
    const data = await PostFollow(id);

    if (data.status == "success") {
      setFollowing([...following, id]);
    }
  };

  const unfollow = async (id) => {
    const data = await PostUnfollow(id);

    if (data.status == "success") {
      setFollowing(following.filter((followedId) => followedId !== id));
    }
  };

  const nextPage = () => {
    getUsers(); 
  };
  return (
    <>
      <div className="content__posts">
        {users.length > 0 ? (
          users.map((user) => (
            <article className="posts__post" key={user && user._id}>
              <div className="post__container">
                <div className="post__image-user">
                  <Link to={`/social/perfil/${user._id}`} className="post__image-link">
                    {user &&
                    user.image != "default.png" && (
                      <img
                        src={Global.url + "user/avatar/" + user.image}
                        className="post__user-image"
                        alt="Foto de perfil"
                      />
                    )}
                    {user &&
                    user.image == "default.png" && (
                      <img
                        src={avatar}
                        className="post__user-image"
                        alt="Foto de perfil"
                      />
                    )}
                  </Link>
                </div>

                <div className="post__body">
                  <div className="post__user-info">
                    <Link to={`/social/perfil/${user._id}`} className="user-info__name">
                      {user && user.name} {user && user.surname}
                    </Link>
                    <span className="user-info__divider"> | </span>
                    <Link to={`/social/perfil/${user._id}`} className="user-info__create-date">
                      <ReactTimeAgo date={user.created_at} locale="es" />
                    </Link>
                  </div>

                  <h4 className="post__content">{user && user.bio}</h4>
                </div>
              </div>

              {user && user._id === auth._id ? (
                ""
              ) : (
                <div className="post__buttons">
                  { following &&
                  following.includes(user._id) ? (
                    <a
                      href="#"
                      className="post__button"
                      onClick={() => unfollow(user._id)}
                    >
                      Dejar de seguir
                    </a>
                  ) : (
                    <a
                      href="#"
                      className="post__button post__button--green"
                      onClick={() => follow(user._id)}
                    >
                      Seguir
                    </a>
                  )}
                </div>
              )}
            </article>
          ))
        ) : (
          <p>No hay usuarios</p>
        )}
      </div>

      {loading && <p>Cargando...</p>}

      {more && (
        <div className="content__container-btn">
          <button className="content__btn-more-post" onClick={nextPage}>
            Ver mas personas
          </button>
        </div>
      )}
    </>
  );
};

import React from "react";
import { Global } from "../../../helpers/Global";
import avatar from "../../../assets/img/user.png";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import ReactTimeAgo from "react-time-ago";

export const PublicationList = ({
  publications,
  getPublications,
  more,
  setMore,
  page,
  setPage,
}) => {
  const { auth } = useAuth();

  const deletePublication = async (id) => {
    const requets = await fetch(`${Global.url}publication/remove/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });
    const data = await requets.json();
    if (data.status === "success") {
      getPublications(1, true);
      setPage(1);
      setMore(true);
    }
  };

  const nextPage = () => {
    let next = page + 1;
    setPage(next);
    getPublications(next);
  };

  return (
    <>
      <div className="content__posts">
        {publications.map((publication) => (
          <article className="posts__post" key={publication._id}>
            <div className="post__container">
              <div className="post__image-user">
                <Link
                  to={`/social/perfil/${publication.user._id}`}
                  className="post__image-link"
                >
                  {publication.user &&
                      publication.user.image != "default.png" && (
                        <img
                          src={
                            Global.url + "user/avatar/" + publication.user.image
                          }
                          className="post__user-image"
                          alt="Foto de perfil"
                        />
                      )}
                    {publication.user &&
                      publication.user.image == "default.png" && (
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
                  <Link to={`/social/perfil/${publication.user._id}`} className="user-info__name">
                    {publication.user.name} {publication.user.surname}
                  </Link>
                  <span className="user-info__divider"> | </span>
                  <Link to={`/social/perfil/${publication.user._id}`} className="user-info__create-date">
                    <ReactTimeAgo date={publication.created_at} locale="es" />
                  </Link>
                </div>

                <h4 className="post__content">{publication.text}</h4>

                {publication.file && (
                  <img
                    src={Global.url + "publication/media/" + publication.file}
                    className="post__image"
                    alt="Publicacion"
                  />
                )}
              </div>
            </div>
            {publication.user._id === auth._id ? (
              <div className="post__buttons">
                <button
                  onClick={() => deletePublication(publication._id)}
                  className="post__button"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            ) : (
              ""
            )}
          </article>
        ))}
      </div>
      {more ? (
        <div className="content__container-btn">
          <button className="content__btn-more-post" onClick={nextPage}>
            Ver mas publicaciones
          </button>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

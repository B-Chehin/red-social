import React from 'react'
import { Global } from "../../helpers/Global";
import { PostFollow } from "../servicies/follow/PostFollow";
import { PostUnfollow } from "../servicies/follow/PostUnfollow";
import { useAuth } from "../../hooks/useAuth";
import avatar from "../../assets/img/user.png";

export const UserList = ({users, setUsers, following, setFollowing}) => {

    
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
  return (
    <div className="content__posts">
        {users.length > 0 ? (
          users.map((user) => (
            <article className="posts__post" key={user._id}>
              <div className="post__container">
                <div className="post__image-user">
                  <a href="#" className="post__image-link">
                    {user.image != "default.png" && (
                      <img
                        src={Global.url + "user/avatar/" + user.image}
                        className="post__user-image"
                        alt="Foto de perfil"
                      />
                    )}
                    {user.image == "default.png" && (
                      <img
                        src={avatar}
                        className="post__user-image"
                        alt="Foto de perfil"
                      />
                    )}
                  </a>
                </div>

                <div className="post__body">
                  <div className="post__user-info">
                    <a href="#" className="user-info__name">
                      {user.name} {user.surname}
                    </a>
                    <span className="user-info__divider"> | </span>
                    <a href="#" className="user-info__create-date">
                      {user.create_at}
                    </a>
                  </div>

                  <h4 className="post__content">{user.bio}</h4>
                </div>
              </div>

              {user._id === auth._id ? (
                ""
              ) : (
                <div className="post__buttons">
                  {following.includes(user._id) ? (
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
  )
}

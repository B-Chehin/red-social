import React, { useEffect } from "react";
import { useState } from "react";
import { GetUserList } from "../servicies/user/GetUserList";

export const People = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    getUsers(1);
  }, []);

  const getUsers = async (nextPage = 1) => {
    // Efecto de carga
    setLoading(true);

    // Peticion para sacar usuarios
    const data = await GetUserList(nextPage);

    // Estado para listarlos

    if (data.users && data.status == "success") {
      let newUsers = data.users;

      if (users.length > 0) {
        newUsers = [...users, ...data.users];
      }
      setUsers(newUsers);
      setFollowing(data.user_following);
      setLoading(false);

      // Paginacion
      if (users.length >= data.total) {
        setMore(false);
      }
    }
  };

  const nextPage = () => {
    let next = page + 1;
    setPage(next);
    getUsers(next);
    console.log(following);
  };


  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Gente</h1>
      </header>

      <UserList 
      users={users} 
      setUsers={setUsers} 
      following={following}
      setFollowing={setFollowing}/>

      {loading && <p>Cargando...</p>}

      {more && (
        <div className="content__container-btn">
          <button className="content__btn-more-post" onClick={nextPage}>
            Ver mas personas
          </button>
        </div>
      )}
      <br />
    </>
  );
};

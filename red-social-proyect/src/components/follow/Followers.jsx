import React, { useEffect } from "react";
import { useState } from "react";
import {UserList} from "../user/UserList";
import {GetFollowers} from "../servicies/follow/GetFollowers";


export const Followers = () => {
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
    const data = await GetFollowers(nextPage);

    // Estado para listarlos

    if (data.follows && data.status == "success") {
      let newUsers = data.follows;

      if (users.length > 0) {
        newUsers = [...users, ...data.follows];
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

  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Gente</h1>
      </header>

      <UserList
        users={users}
        getUsers={getUsers}
        following={following}
        setFollowing={setFollowing}
        page={page}
        setPage={setPage}
        loading={loading}
        more={more}
      />

      <br />
    </>
  );
};
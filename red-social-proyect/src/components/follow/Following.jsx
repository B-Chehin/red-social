import React, { useEffect } from "react";
import { useState } from "react";
import {GetFollowing} from "../servicies/follow/GetFollowing";
import { useParams } from "react-router-dom";
import {UserList} from "../user/UserList";

export const Following = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  const params = useParams();


  useEffect(() => {
    getUsers(1);
  }, []);

  const getUsers = async (nextPage = 1) => {
    // Efecto de carga
    setLoading(true);

    // Sacar userid de la url

    const userid = params.userid;

    // Peticion para sacar usuarios
    const data = await GetFollowing(userid,nextPage);

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
      if (users.length >= (data.total - data.follows.length)) {
        setMore(false);
      }
    }
  };

  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Usuarios que sigue {params.userid}</h1>
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
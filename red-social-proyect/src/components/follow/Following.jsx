import React, { useEffect, useState } from "react";
import { GetFollowing } from "../servicies/follow/GetFollowing";
import { useParams } from "react-router-dom";
import { UserList } from "../user/UserList";
import { GetUser } from "../../helpers/GetUser";

export const Following = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});

  const params = useParams();

  useEffect(() => {
    getUsers(1); // Primera página
  }, []);
  
  const getUsers = async (pageToLoad) => {
    console.log("getUsers -> pageToLoad:", pageToLoad); // <-- Este
    if (!more) return;
  
    setLoading(true);
    const userid = params.userid;
    const data = await GetFollowing(userid, pageToLoad);
  
    const cleanUsers = data.follows.map(f => f.followed);
  
    if (cleanUsers.length && data.status === "success") {
      const newUsers = [...users, ...cleanUsers];
      setUsers(newUsers);
      setFollowing(data.following);
      setPage(pageToLoad); // ✅ Ahora sí, actualizamos el estado correctamente
  
      if (newUsers.length >= data.total) {
        setMore(false);
      }
    }
  
    setLoading(false);
  };
  
  const handleNextPage = () => {
    const next = page + 1;
    console.log("HandleNextPage -> next:", next); // <-- Este
    getUsers(next); // 🚫 No seteamos `page` acá
  };

  const getUserProfile = async () => {
    const data = await GetUser(params.userid);
    setProfile(data);
  };

  useEffect(() => {
    getUserProfile();
  }, []);
  
  

  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Usuarios que sigue {profile.name} {profile.surname}</h1>
      </header>

      <UserList
        users={users}
        getUsers={handleNextPage}
        following={following}
        setFollowing={setFollowing}
        loading={loading}
        more={more}
      />

      <br />
    </>
  );
};

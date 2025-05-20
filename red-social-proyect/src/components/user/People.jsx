import React, { useEffect } from "react";
import { useState } from "react";
import GetUserList from "../servicies/user/GetUserList";
import { UserList } from "./UserList";

export const People = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers(1);
  }, []);

  const getUsers = async (nextPage = page) => {
    if (!more) return;

    setLoading(true);

    const data = await GetUserList(nextPage);

    if (data.users && data.status === "success") {
      const newUsers = [...users, ...data.users];
      setUsers(newUsers);
      setFollowing(data.user_following);

      if (newUsers.length >= data.total) {
        setMore(false);
      } else {
        setPage(nextPage + 1);
      }
    }

    setLoading(false);
  };

  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Gente</h1>
      </header>

      <UserList
        users={users}
        getUsers={getUsers} // no pasamos páginas desde UserList
        following={following}
        setFollowing={setFollowing}
        loading={loading}
        more={more}
      />

      <br />
    </>
  );
};

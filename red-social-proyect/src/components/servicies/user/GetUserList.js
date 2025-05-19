import React from 'react'
import { Global } from '../../../helpers/Global'

const GetUserList = async (nextPage = 1) => {
    const token = localStorage.getItem("token");
    const request = await fetch(`${Global.url}user/list/${nextPage}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await request.json();

      return data;
}

export default GetUserList
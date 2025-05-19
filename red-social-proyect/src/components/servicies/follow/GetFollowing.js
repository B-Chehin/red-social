import React from 'react'
import { Global } from "../../../helpers/Global";

export const GetFollowing = async (id, nextPage = 1) => {
    const token = localStorage.getItem("token");
    
    const request = await fetch(`${Global.url}follow/following/${id}/page=${nextPage}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        const data = await request.json();

        return data;
}
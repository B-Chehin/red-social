import React from 'react'
import { Global } from "../../helpers/Global";

export const PostFollow = async (id) => {
    const token = localStorage.getItem("token");
    
    const request = await fetch(`${Global.url}follow/save`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ followed: id }),
        });
        const data = await request.json();

        return data;
}
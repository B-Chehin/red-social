import React from 'react'
import { Global} from "../../../helpers/Global";

export const PostUnfollow = async (id) => {
    const token = localStorage.getItem("token");
    
    const request = await fetch(`${Global.url}follow/unfollow/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await request.json();

      return data;
}
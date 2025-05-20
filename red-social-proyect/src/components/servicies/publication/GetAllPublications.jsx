import { Global } from "../../../helpers/Global";

export const GetAllPublications = async (id, nextpage = 1) => {
    const token = localStorage.getItem("token");
    
    const request = await fetch(`${Global.url}publication/user/${id}/${nextpage}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await request.json();

      return data;
}
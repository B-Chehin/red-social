import { Global } from './Global';
export const GetUser = async (userid, setState) => {
    const token = localStorage.getItem("token");

    const request = await fetch(`${Global.url}user/profile/${userid}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
        },
    });
    const data = await request.json();
    
    if(data.status === "success"){
        setState(data.user);
    }

    return data;
}

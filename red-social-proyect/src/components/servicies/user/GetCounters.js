import React from 'react'
import { Global } from '../../../helpers/Global'


export const GetCounters = async (userid, token) => {
  
    const requestCounters = await fetch(`${Global.url}user/counters/${userid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token,
          },
        });
    const data = await requestCounters.json();
    return data;
}

export default GetCounters
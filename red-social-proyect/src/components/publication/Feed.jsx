import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { PublicationList } from "../servicies/publication/PublicationList";
import { GetFeed } from "../servicies/publication/GetFeed";

export const Feed = () => {

  const { auth } = useAuth();
  const [publications, setPublications] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);

  useEffect(() => {
      getPublications(1, false);
    }, []);

     const getPublications = async (nextpage = 1, showNews = false) => {

        if(showNews){
          setPublications([]);
          setPage(1);
          nextpage = 1;
          setMore(true);
        }
        const data = await GetFeed(nextpage);
        if(data.status === "error"){
          setMore(false);
          return;
        }
        if(!showNews && publications.length >= 1){
          setPublications([...publications, ...data.publications]);
        }else{
          setPublications(data.publications);
          setMore(true);
          setPage(1);
        }
        if(!showNews && publications.length >= data.total - data.publications.length){
          setMore(false);
        }    
    
        if(data.pages <= 1){
          setMore(false);
        }
    
    
      };


  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Timeline</h1>
        <button className="content__button" onClick={() => getPublications(1, true)}>Mostrar nuevas</button>
      </header>

       <PublicationList 
            publications={publications}
            getPublications={getPublications}
            more={more} 
            setMore={setMore}
            page={page}
            setPage={setPage}
            />
      
            
            
            <br/>
    </>
  );
};

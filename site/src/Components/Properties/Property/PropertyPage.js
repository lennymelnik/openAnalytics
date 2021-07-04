import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';

const PropertyPage = ({serverAddress, token}) => {
    //const { propertyId } = useParams();
    const [property, setProperty] = useState({})

    function getQueryVariable(variable)
{
        var query = window.location.search.substring(1);
        console.log(query)//"app=article&act=news_content&aid=160990"
        var vars = query.split("&");
        console.log(vars) //[ 'app=article', 'act=news_content', 'aid=160990' ]
        for (var i=0;i<vars.length;i++) {
                    var pair = vars[i].split("=");
                    console.log(pair)//[ 'app', 'article' ][ 'act', 'news_content' ][ 'aid', '160990' ] 
        if(pair[0] == variable){return pair[1];}
         }
         return(false);
}


    async function getData() {
        return fetch(serverAddress+'/get-all', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token' : token
          }
        })
          .then(data => data.json())
       }
       useEffect(() => {
        async function runGet() {
            var body = {search : {id : getQueryVariable('id')}}
            console.log("BODY", body)
            const dataFromServer = await getData();
            console.log(dataFromServer)
            if(dataFromServer.status){
                setProperty(dataFromServer.data[0]);
                console.log("This is the right information")
        
            }
        }
       runGet()
        
      }, []);
    return (
        <div>
            <h1>{property.title}</h1>
            {property.totalVisits}
        </div>
    )
}




export default PropertyPage

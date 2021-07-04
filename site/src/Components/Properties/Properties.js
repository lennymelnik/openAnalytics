import React, { useState, useEffect } from 'react';


const Properties = ({token, serverAddress, setToken}) => {
    const [properties, setProperties] = useState([])

    async function getData() {
        return fetch(serverAddress+'/get-all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'token' : token
          }
        })
          .then(data => data.json())
       }
       useEffect(() => {
        async function runGet() {
            const dataFromServer = await getData();
            console.log(dataFromServer)
            if(dataFromServer.status){
                setProperties(dataFromServer.data);
               
                
                console.log("This is the right information")
        
            }else{
                setToken({token : undefined})
                console.error("This is the wrong information",)
            }
        }
       runGet()
        
      }, []);
    return (
        <div>
            {properties.map((property) => (<p>{property.title}</p>))}
        </div>
    )
}

export default Properties

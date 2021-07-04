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
        <div className="container">
            <h1 className="display-text">Properties</h1>
            
            <button type="button" class="btn btn-primary">Create Property (will pop up a modal)</button>

            <div class="row row-cols-1 row-cols-md-3 g-4">

            {properties.map((property, index) => (<Property property={property} index = {index}/>))}
        </div>
      

        </div>
    )
}


const Property = ({property, index}) => {
    return(
        <div class="col">
        <div class="card" >
  <div class="card-body">
    <h5 class="card-title">{property.title}</h5>
    <h6 class="card-subtitle mb-2 text-muted">Total visits : {property.totalVisits} </h6>
    <p class="card-text">{property.desc}</p>
    <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target={"#collapse" + index} aria-expanded="false" aria-controls={"collapse"+index}>View Events</button>
<br />
    <div class="collapse multi-collapse" id={"collapse"+index}>
    <ul class="list-group">
        {Object.keys(property.events).map((event) =>(  <li class="list-group-item">{property.events[event].action} : {property.events[event].times}</li>))}
 
</ul>
    </div>
    <a href="#" class="card-link">Card link</a>
    <a href="#" class="card-link">Another link</a>
  </div>
</div>
</div>
    )
}


export default Properties

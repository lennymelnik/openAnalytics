import React, { useState, useEffect } from 'react';
import AddProperty from './AddProperty';

const Properties = ({token, serverAddress, setToken}) => {
    const [properties, setProperties] = useState([])
    const [updateProperties, setUpdate] = useState(0)
  
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
        
      }, [updateProperties]);
    return (
        <div className="container">
            <h1 className="display-text">Properties</h1>
          
            <div class="row row-cols-1 row-cols-md-3 g-4">

            {properties.map((property, index) => (<Property property={property} index = {index} token = {token} serverAddress = {serverAddress} updateProperties = {updateProperties} setUpdate = {setUpdate}/>))}
            <AddProperty serverAddress={serverAddress} token={token} updateProperties={updateProperties} setUpdate={setUpdate}/>

        </div>
      

        </div>
    )
}


const Property = ({property, index, serverAddress, updateProperties, setUpdate, token}) => {
    return(
        <div class="col">
        <div class="card" >
  <div class="card-body">
    <h5 class="card-title" onClick={()=>{window.open('/property?id='+property.id)}}>{property.title} </h5>
    <h6 class="card-subtitle mb-2 text-muted">Total visits : {property.totalVisits} </h6>
    <p class="card-text">{property.desc}</p>
    <p>Id: {property.id}</p>
<br />
    <div class="collapse multi-collapse" id={"collapse"+index}>
    <ul class="list-group">
        {Object.keys(property.events).map((event) =>(  <li class="list-group-item">{property.events[event].action} {property.events[event].id} : {property.events[event].times}</li>))}
 
    </ul>
    </div>

    <a href="#" class="btn btn-success card-link" data-bs-toggle="collapse" data-bs-target={"#collapse" + index} aria-expanded="false" aria-controls={"collapse"+index}>View Events</a>
    <DeleteProperty token = {token} serverAddress = {serverAddress} property = {property} updateProperties = {updateProperties} setUpdate = {setUpdate}/>
  </div>
</div>
</div>
    )
}
const DeleteProperty = ({token, serverAddress, property, updateProperties, setUpdate}) => {

    async function deleteProperty(body) {
        return fetch(serverAddress+'/removeProperty', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token' : token,
            'id': property.id
          },
          body: JSON.stringify(body),
        
        })
          .then(data => data.json())
       }
    
      const handleSubmit = async e => {
         
            e.preventDefault();
            console.log("sending")
            const fromServer = await deleteProperty();
            if(fromServer.status){
                setUpdate(updateProperties+1)
               
            }
        
      
      
      }
    return (
        <div>
       
       <a class="btn btn-danger card-link" data-bs-toggle="modal" data-bs-target="#addProperty">Delete Property</a>



<div class="modal fade" id="addProperty" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Delete Property</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
       <p>Are you sure</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" onClick={handleSubmit} data-bs-dismiss="modal">Delete Property</button>
      </div>
    </div>
  </div>
</div> 
        </div>
    )
}




export default Properties

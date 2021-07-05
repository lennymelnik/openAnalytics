import React, { useState, useEffect } from 'react';

const AddProperty = ({serverAddress, token, updateProperties, setUpdate}) => {
    const [title, setTitle] = useState();
    const [url, setUrl] = useState();
    const [desc, setDesc] = useState();
    async function addProperty(body) {
        return fetch(serverAddress+'/create-property', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token' : token
          },
          body: JSON.stringify(body),
        
        })
          .then(data => data.json())
       }
    
      const handleSubmit = async e => {
        e.preventDefault();
        console.log("sending")
        const fromServer = await addProperty({
          title, url, desc
        });
        if(fromServer.status){
            setUpdate(updateProperties+1)
        }
      
      }
    return (
        <div>
       
     
              <div class="col" data-bs-toggle="modal" data-bs-target="#addProperty">
        <div class="card" >
  <div class="card-body container" style={{textAlign : 'center'}}>
  <i class="fa fa-plus" aria-hidden="true" style={{fontSize : "80px", color : "lightblue"}}></i>
 </div>
  </div>

</div>


<div class="modal fade" id="addProperty" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
            <div class="row">
        <div class="col">
            <label for="nameInput" class="form-label">Name</label>

            <input id="nameInput" type="text" class="form-control" placeholder="John Doe" aria-label="Name" onChange={(e)=>{setTitle(e.target.value)}}/>
        </div>
        <div class="col">
            <label for="urlInput" class="form-label">Url</label>

            <input id="urlInput" type="text" class="form-control" placeholder="https://myproperty.com" aria-label="url"onChange={(e)=>{setUrl(e.target.value)}}/>
        </div>
        </div>
        <div class="mb-3">
  <label for="exampleFormControlTextarea1" class="form-label">Description</label>
  <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="Platform for measuring how many pickles rick can turn into" onChange={(e)=>{setDesc(e.target.value)}}></textarea>
</div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" onClick={handleSubmit}>Add Property</button>
      </div>
    </div>
  </div>
</div> 
        </div>
    )
}

export default AddProperty

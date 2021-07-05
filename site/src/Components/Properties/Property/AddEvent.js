import React, { useState, useEffect } from 'react';
import PropertyPage from './PropertyPage';

const AddEvent = ({serverAddress, token, updateProperty, setUpdate, property}) => {
    const [type, setType] = useState();
    const [action, setAction] = useState();
    const [desc, setDesc] = useState();
    async function addEvent(body) {
        return fetch(serverAddress+'/createEvent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token' : token,
            'id' : property.id
          },
          body: JSON.stringify(body),
        
        })
          .then(data => data.json())
       }
    
      const handleSubmit = async e => {
          if(type != '' && action !='' && desc !=''){
            e.preventDefault();
            console.log("sending")
            const fromServer = await addEvent({
              type, action, desc
            });
            if(fromServer.status){
                setUpdate(updateProperty+1)
                document.getElementById('typeInput').value = ''//document.getElementById('nameInput').placeholder
                document.getElementById('actionInput').value = ''//document.getElementById('urlInput').placeholder
                document.getElementById('descInput').value = ''//document.getElementById('descInput').placeholder
                setType('')
                setAction('')
                setDesc('')
            }
          }else{
              alert("All values must be filled in")
          }
      
      
      }
    return (
        <div>
       
     
              <div class="col" data-bs-toggle="modal" data-bs-target="#addEvent">
        <div class="card" >
  <div class="card-body container" style={{textAlign : 'center'}}>
  <i class="fa fa-plus" aria-hidden="true" style={{fontSize : "80px", color : "lightblue"}}></i>
 </div>
  </div>

</div>


<div class="modal fade" id="addEvent" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Add Event</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
            <div class="row">
        <div class="col">
            <label for="typeInput" class="form-label">Type</label>

            <input id="typeInput" type="text" class="form-control" placeholder="user" aria-label="Name" onChange={(e)=>{setType(e.target.value)}}/>
        </div>
        <div class="col">
            <label for="actionInput" class="form-label">Action</label>

            <input id="actionInput" type="text" class="form-control" placeholder="Rick turns into pickle" aria-label="url"onChange={(e)=>{setAction(e.target.value)}}/>
        </div>
        </div>
        <div class="mb-3">
  <label for="descInput" class="form-label">Description</label>
  <textarea class="form-control" id="descInput" rows="3" placeholder="This is used for measuring how many times rick turns into a pickle" onChange={(e)=>{setDesc(e.target.value)}}></textarea>
</div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" onClick={handleSubmit} data-bs-dismiss="modal">Add Event</button>
      </div>
    </div>
  </div>
</div> 
        </div>
    )
}

export default AddEvent

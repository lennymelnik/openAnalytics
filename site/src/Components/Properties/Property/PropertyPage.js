import { stringify } from 'query-string';
import React, { useState, useEffect } from 'react';
import AddEvent from './AddEvent'
import { useParams } from 'react-router-dom';

const PropertyPage = ({serverAddress, token}) => {
    //const { propertyId } = useParams();
    const [property, setProperty] = useState({})
    const [updateProperty, setUpdate] = useState(0)

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


    async function getData(body) {
        return fetch(serverAddress+'/get-all', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token' : token
          },
          body : JSON.stringify(body)
        })
          .then(data => data.json())
       }
       useEffect(() => {
        async function runGet() {
            var body = {search : {id : getQueryVariable('id')}}
            console.log("BODY", body)
            const dataFromServer = await getData(body);
            console.log(dataFromServer)
            if(dataFromServer.status){
                setProperty(dataFromServer.data[0]);
                console.log("This is the right information")
        
            }
        }
       runGet()
        
      }, [updateProperty]);
      if(property.title){
        return (
            <div className = "container">
                <br />
               <div class="shadow-sm p-3 mb-5 bg-body rounded">


                <h1>{property.title}</h1>
                <h4>{property.url}</h4>
                {property.totalVisits}
                </div>
    <h3>Events</h3>
    <AddEvent serverAddress = {serverAddress} token = {token} updateProperty = {updateProperty} setUpdate = {setUpdate} property = {property}/>
    <ol class="list-group list-group-numbered">
        {Object.keys(property.events).map((event) => (<Event event ={event } property = {property}/>))}
        </ol>
            </div>
        )
      }
      return(

        <h1>Loading</h1>
      )
   
}
const Event = ({event, property}) => {
    return(
  <li class="list-group-item d-flex justify-content-between align-items-start">
    <div class="ms-2 me-auto">
      <div class="fw-bold">{property.events[event].action}</div>
      {property.events[event].id}
    </div>
    <span class="badge bg-primary rounded-pill">{property.events[event].times}</span>
  </li>
    )
}

export default PropertyPage

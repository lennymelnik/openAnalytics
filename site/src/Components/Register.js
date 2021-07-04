import React, { useState } from 'react';


const Register = ({serverAddress, ReactGA}) => {
  async function registerUser(credentials) {
    return fetch(serverAddress+'/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
   }
  const [loading, setLoading] = useState(false)
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [warnings, setWarnings] = useState([]);

  const handleSubmit = async e => {
    e.preventDefault();
    const responce = await registerUser({
      username,
      password
    });
    if(responce.status){
        setTimeout(function(){ window.location.assign('/login') }, 3000);
        setWarnings([{message: "Success, please login",type:"alert alert-success alert-flush"}])
        ReactGA.event({
          category: 'User',
          action: 'Created an Account'
        });
        setLoading(true)
        

        //

    }else{
        setWarnings([{message: responce.message,type:"alert alert-danger alert-flush"}])
    }
  }
  if(loading == true){

    return(
        <div className="main-content">
              {warnings.map((warning)=>( <div className={warning.type} role="alert">
    <strong>Heads up!</strong> {warning.message}
</div>))}
           
  <div className="jumbotron" style={{background : "none"}}>

        <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
      </div>
      </div>
    )
   
  }else{
    return (
        <div className="main-content">
            {warnings.map((warning)=>( <div className={warning.type} role="alert">
    <strong>Heads up!</strong> {warning.message}
</div>))}
           
  <div className="container h-100vh d-flex align-items-center">
    <div className="col">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5 col-xl-4">
          <div>
            <div className="mb-5 text-center">
              <h6 className="h3">Register</h6>
              <p className="text-muted mb-0">Enter your info to continue.</p>
            </div>
            <span className="clearfix"></span>
            <form role="form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-control-label">Email address</label>
                <div className="input-group input-group-merge">
                  <div className="input-group-prepend">
                    <span className="input-group-text"><i className="fas fa-user"></i></span>
                  </div>
                  <input name="email" type="email" className="form-control" id="input-email" placeholder="name@example.edu" onChange={e => setUserName(e.target.value)}/>
                </div>
              </div>
              <div className="form-group mb-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <label className="form-control-label">Password</label>
                  </div>
                  <div className="mb-2">
                    <a href="#!" className="small text-muted text-underline--dashed border-primary">Lost password?</a>
                  </div>
                </div>
                <div className="input-group input-group-merge">
                  <div className="input-group-prepend">
                    <span className="input-group-text"><i className="fas fa-key"></i></span>
                  </div>
                  <input name="password" type="password" className="form-control" id="input-password" placeholder="Password" onChange={e => setPassword(e.target.value)}/>
                 
                </div>
              </div>
              <div className="mt-4">
                <button type="submit" className="btn btn-block btn-secondary">Register</button></div>
            </form>
            <div className="mt-4 text-center"><small>Already Have An Account?</small>
              <a href="/login" className="small font-weight-bold">Login</a></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    )
  }
    
}

export default Register
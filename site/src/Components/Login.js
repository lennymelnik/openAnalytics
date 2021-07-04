import PropTypes from 'prop-types';
import React, { useState } from 'react';


const Login = ({setToken, serverAddress}) => {
  async function loginUser(credentials) {
    return fetch(serverAddress+'/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
   }
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [warnings, setWarnings] = useState([]);

  const handleSubmit = async e => {
    e.preventDefault();
    console.log("sending")
    const token = await loginUser({
      email,
      password
    });
    console.log(token)
    if(token.status){
        setToken(token);
       
        
        console.log("This is the right information")

    }else{

        setWarnings([{message: "Incorrect Username or Password",type:"alert alert-danger alert-flush"}])
        console.error("This is the wrong information", warnings)
    }
  }
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
              <h6 className="h3">Login</h6>
              <p className="text-muted mb-0">Sign in to your account to continue.</p>
            </div>
            <span className="clearfix"></span>
            <form role="form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-control-label">Email address</label>
                <div className="input-group input-group-merge">
                  <div className="input-group-prepend">
                    <span className="input-group-text"><i className="fas fa-user"></i></span>
                  </div>
                  <input name="email" type="email" className="form-control" id="input-email" placeholder="name@example.edu" onChange={e => setEmail(e.target.value)}/>
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
                <button type="submit" className="btn btn-block btn-secondary">Sign in</button></div>
            </form>
            <div className="mt-4 text-center"><small>Not registered?</small>
              <a href="/register" className="small font-weight-bold">Create account</a></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    )
}
Login.propTypes = {
    setToken: PropTypes.func.isRequired
  }
export default Login

const express = require('express');
const cors = require('cors')
const app = express();
const uniqid = require('uniqid')
var bcrypt = require('bcrypt');
var MongoLogin = require('./db')
var http = require('http');
var https = require('https');
app.use(cors());
app.use(express.json());

var fs = require('fs');

//Load up certificates for SSL Encryption (To enable HTTPS)
var privateKey = fs.readFileSync('/etc/letsencrypt/live/analytics.leonardmelnik.com/privkey.pem', 'utf8');
var certificate = fs.readFileSync('/etc/letsencrypt/live/analytics.leonardmelnik.com/fullchain.pem', 'utf8');
var credentials = {
    key: privateKey,
    cert: certificate
};

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://'+MongoLogin.credentials.username+':'+MongoLogin.credentials.password+'@localhost:27017//?authSource=admin';
//var url = 'mongodb://leonardmelnik.com:27017/mydb';

//mongodb://216.250.126.175:27017,216.250.126.175:27018/mydb?replicaSet=rs0

const saltRounds = 10;
var salt = '$2b$10$X4k3v7j5ZcG39WgogSl16au'



MongoClient.connect(url, function(err, db) {

    if (err) throw err;
    var dbo = db.db("openAnalytics");

    console.log("Connected to database")
    app.use(async (req, res, next) =>{
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        console.log(ip, req.path)
        next()
    })
    //dbo.collection("accounts").find({email : req.session.user.email}).toArray()

    app.use('/get-all', async (req, res) => {
        if(req.headers.token){
            console.log("data-peek")
            var results = await dbo.collection("accounts").find({token : req.headers.token}).toArray()
            if(results[0]){
                //Token has been confirmed
               
                
                var properties = await dbo.collection("properties").find({admins: results[0].id}).toArray()
                //console.log()
                res.send({status: true,
                data: properties
              });
            }else{
                res.send({status: false, message: "Token not authorized", token : req.headers.token});
            }
    
            
        }else{
            res.send({status: false, message: "No token provided"});
        }
      
      
    });
app.use('/a', async (req, res) => {
    if(req.headers.token){
        var results = await dbo.collection("accounts").find({token : req.headers.token}).toArray()
        if(results[0]){
            //Token has been confirmed
            //console.log(req.body.search)
            if(!req.body.search){
                req.body.search = {}
            }
            if(!req.body.projection){
                req.body.projection = {}
            }
            req.body.search.schoolId = results[0].schoolId
            var evaluations = await dbo.collection("evaluations").find(req.body.search,{projection : req.body.projection}).toArray()
            //console.log(evaluations.length)
            res.send({status: true,
            data: evaluations
          });
        }else{
            res.send({status: false, message: "Token not authorized"});
        }

        
    }else{
        res.send({status: false, message: "No token provided"});
    }
  
});
app.use('/class', async (req, res) => {
    if(req.headers.token){
        var results = await dbo.collection("accounts").find({token : req.headers.token}).toArray()
        if(results[0]){
            //Token has been confirmed
            if(!req.body.search){
                req.body.search = {}
            }   
            var evaluations = await dbo.collection("classes").find(req.body.search).toArray()

            res.send({status: true,
            data: evaluations[0]
          });
        }else{
            res.send({status: false, message: "Token not authorized"});
        }

        
    }else{
        res.send({status: false, message: "No token provided"});
    }
  
});
app.post('/addView', async (req, res) => {
    if(req.headers.id){
        var results = await dbo.collection("properties").find({id : req.headers.id}).toArray()
        if(results[0]){
            //Token has been confirmed
            var path = "paths."+req.body.path
            console.log(path)

            var propertyObj = {$inc: {totalVisits : 1, [path] : 1}}
            var evaluations = await dbo.collection("properties").updateOne({id : req.headers.id},propertyObj)

            res.send({status: true});
        }else{
            res.send({status: false, message: "Token not authorized"});
        }
    }else{
        res.send({status: false, message: "No token provided"});
    }
  
});
app.post('/createEvent', async (req, res) => {
    if(req.headers.token){
        var user = await dbo.collection("accounts").find({token: req.headers.token}).toArray()
        var property = await dbo.collection("properties").find({id: req.headers.id}).toArray()
        console.log(user[0], property[0])
        if(property[0] && user[0] && property[0].admins.includes(user[0].id)){
            //Token has been confirmed
        

            var eventObj = {
                type : req.body.type,
                desc: req.body.desc,
                action : req.body.action,
                times : 0,
                id : uniqid()
            }
            var propertyObj = {$set: {['events.'+eventObj.id] : eventObj}}



            var evaluations = await dbo.collection("properties").updateOne({id : req.headers.id},propertyObj)

            res.send({status: true});
        }else{
            res.send({status: false, message: "Token not authorized"});
        }
    }else{
        res.send({status: false, message: "No token provided"});
    }
  
});
app.post('/addEvent', async (req, res) => {
    if(req.headers.id){
        var event = "events."+req.headers.id

        var results = await dbo.collection("properties").find({[event] : {"$exists": true}}).toArray()
    
        if(results[0]){
            //Token has been confirmed
            var event = "events."+req.headers.id+".times"

            var propertyObj = {$inc: {[event] : 1}}
            console.log(propertyObj)
            var evaluations = await dbo.collection("properties").updateOne({id : results[0].id},propertyObj)

            res.send({status: true});
        }else{
            res.send({status: false, message: "Token not authorized"});
        }
    }else{
        res.send({status: false, message: "No token provided"});
    }
  
});
app.post('/create-property', async (req, res) => {
    if(req.headers.token){
        var results = await dbo.collection("accounts").find({token : req.headers.token}).toArray()
        if(results[0]){
            //Token has been confirmed
            if(!req.body.search){
                req.body.search = {}
            }   
            var propertyObj = {
                title : req.body.title,
                desc: req.body.desc,
                url : req.body.url,
                id : uniqid(),
                paths : {},
                events : {},
                totalVisits : 0,
                admins : [results[0].id]
            }

            var evaluations = await dbo.collection("properties").insertOne(propertyObj)

            res.send({status: true,
            data: "Property has been created"
          });
        }else{
            res.send({status: false, message: "Token not authorized"});
        }

        
    }else{
        res.send({status: false, message: "No token provided"});
    }
  
});

app.get('/searchData', async (req, res) => {
    console.log("getting search data")
    if(req.headers.token){
        var results = await dbo.collection("accounts").find({token : req.headers.token}).toArray()
        if(results[0]){
            //Token has been confirmed
            //console.log(results)
            var searchData = await dbo.collection("searchData").find({schoolId : results[0].schoolId}).toArray()
            //For the future, if we want to get all the unique values, then use
            //var distinct = await dbo.collection("evaluations").distinct("dept")
            //console.log("this is the search data", searchData)
            res.send({status: true,
            data: searchData[0]
          });
        }else{
          res.send({status: false, message: "Token not authorized"});
        }

        
    }else{
       res.send({status: false, message: "No token provided"});
    }
  
});

app.use('/login', async (req, res) => {
    if(req.body.email && req.body.password){
        var password = req.body.password
        if(req.body.email.indexOf(' ') > -1 || req.body.email.indexOf(' ')>req.body.email.length||password.indexOf(' ') > -1 || password.indexOf(' ')>password.length){
            res.send({status: false, message: "You cannot have spaces in your email or password"});
    
        }else{
            var email = req.body.email.toLowerCase()
            var passwordHashed = await bcrypt.hash(req.body.password, salt)
            var results = await dbo.collection("accounts").find({email : email, password : passwordHashed}).toArray()
         
            if(results[0]){
                var token = await bcrypt.hash(uniqid(), salt)
                dbo.collection("accounts").updateOne({email : email, password : passwordHashed},{$set : {token : token}})
                console.log("new token;", token)
                //var searchData = await dbo.collection("searchData").find({})
                console.log("sent")
                res.send(
                    {status: true,
                    token: token
                  });
            }else{
                res.send({status: false, message: "Incorrect Username or Password"});
            }
        }
       
    }else{
        res.send({status: false, message: "Password or username not provided"});
    }
   
  
});
app.use('/register', async (req, res) => {
    var name = req.body.name
    var email = req.body.email.toLowerCase()
    var password = req.body.password
    if(email.indexOf(' ') > -1 || email.indexOf(' ')>email.length ||password.indexOf(' ') > -1 || password.indexOf(' ')>password.length){
        res.send({status: false, message: "You cannot have spaces in your email or password"});

    }else{
        var passwordHashed = await bcrypt.hash(req.body.password, salt)
        var results = await dbo.collection("accounts").find({email : email, password : passwordHashed}).toArray()
        if(!results[0]){
            var userObj = {
                name: name,
                email : email,
                password : passwordHashed,
                id : uniqid(),
                verified : false,
          
            }
            dbo.collection("accounts").insertOne(userObj)
            res.send({status: true,
                msg: 'Account has been created, please log in'
              });
        }else{
            res.send({status: false, message: "Account already exists with email"});
        }
    }
  
  
});
app.get('/admin', async (req, res) => {
    if(req.headers.token){ 
        var results = await dbo.collection("accounts").find({token : req.headers.token}).toArray()
        if(results[0] && results[0].admin){
            //Token has been confirmed
            //console.log(results)
            //For the future, if we want to get all the unique values, then use
            //var distinct = await dbo.collection("evaluations").distinct("dept")
            //console.log("this is the search data", searchData)
            var allAccounts = await dbo.collection("accounts").find({}).toArray()
            var allSearch = await dbo.collection("searchData").find({}).toArray()

            res.send({status: true,
            data: {accounts : allAccounts, search : allSearch}
          });
        }else{
          res.send({status: false, message: "Token not authorized"});
        }

        
    }else{
       res.send({status: false, message: "No token provided"});
    }
  
});
app.post('/updateUsers', async (req, res) => {
    if(req.headers.token){ 
        var results = await dbo.collection("accounts").find({token : req.headers.token}).toArray()
        if(results[0] && results[0].admin){
            //Token has been confirmed
            //console.log(results)
            //For the future, if we want to get all the unique values, then use
            //var distinct = await dbo.collection("evaluations").distinct("dept")
            //console.log("this is the search data", searchData)
            var updateTheUsers = await dbo.collection("accounts").updateMany({userId :{ "$in": req.body.users}},{$set : req.body.update})
            
            var allAccounts = await dbo.collection("accounts").find({}).toArray()
            var allSearch = await dbo.collection("searchData").find({}).toArray()

            res.send({status: true,
            data: {accounts : allAccounts, search : allSearch}
          });
        }else{
          res.send({status: false, message: "Token not authorized"});
        }

        
    }else{
       res.send({status: false, message: "No token provided"});
    }
  
});

   //app.listen(8080)
  //app.listen(8080)
  var httpsServer = https.createServer(credentials, app);
  httpsServer.listen(8080)

}) 
var express = require('express');
var router = express.Router();
var db = require("../database/DataBaseManagement");
var jwt = require('jsonwebtoken');
//var bcrypt = require('bcryptjs');
var config = require("../config/config");


var ConnectedUsers = {"Computer A.I" : {Pseudo: "Computer A.I"}};

router.get("/authenticate", (req, res) =>{
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Basic ')) {
        console.log(req.headers)
      return res.status(401).send({ message: 'Missing Authorization Header' });
    }
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [Pseudo, Password] = credentials.split(':');
    db.ConnectUser(Pseudo, Password)
        .then(rep => {
            rep.token  = jwt.sign({id: rep.Pseudo}, config.JWT_SECRET, {expiresIn: "24h"});
            ConnectedUsers[rep.Pseudo] = {Pseudo : rep.Pseudo};
            res.send(rep);
        })
        .catch(err => {
            console.log(err)
            res.status(401).send({error:err, message : "login or password is incorrect"})
        });
  });


router.get("/disconnect/:Pseudo", (req, res) =>{
    const pseudo = req.params.Pseudo;
    if(pseudo in ConnectedUsers){
        delete  ConnectedUsers[pseudo];
        res.send({IsDisconnected: true});
    }else{
        res.send({IsDisconnected: false, Reason: pseudo+" is not connected"});
    }
});

router.post("/create", (req, res) =>{
    const base64Credentials =  req.body.user.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [Pseudo, Password] = credentials.split(':');
    db.CreateUser(Pseudo, Password)
        .then(rep => {
            const token  = jwt.sign({id: Pseudo}, config.JWT_SECRET, {expiresIn: "24h"});
            ConnectedUsers[Pseudo] = {Pseudo : Pseudo};
            res.send({token: token, Pseudo: Pseudo});
        }).catch(err => {
          console.log(err)
          res.status(401).send({error: err, message: "login or password is incorrect"})
      });
});


router.get("/connectedUsers", (req, res) =>{
    if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ') ){
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }else{
        let token = req.headers.authorization.replace('Bearer ', '');
        jwt.verify(token, config.JWT_SECRET, (err, decode) =>{
            if(err){
                return res.status(401).json(err);
            }else{
                res.send(ConnectedUsers);
            }
        })
    }
});


router.get('/', function(req, res) {
  res.send({api: "dara-backend", router: ["/create", "/authenticate",]});
});

module.exports = router;

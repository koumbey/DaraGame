var express = require('express');
var router = express.Router();
var Pusher = require('pusher');
var db = require("../database/DataBaseManagement");
var jwt = require('jsonwebtoken');
//var bcrypt = require('bcryptjs');
var config = require("../config/config");


const pusher = new Pusher(config.PUSHER_CONFIG);
var ConnectedUsers = {"Computer A.I" : {Pseudo: "Computer A.I"}};

router.get("/authenticate", (req, res) =>{
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
      return res.status(401).json({ message: 'Missing Authorization Header' });
    }
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [Pseudo, Password] = credentials.split(':');
    db.ConnectUser(Pseudo, Password)
        .then(rep => {
            rep.token  = jwt.sign({id: rep.Pseudo}, config.JWT_SECRET, {expiresIn: "24h"});
            ConnectedUsers[rep.Pseudo] = {Pseudo : rep.Pseudo};
            res.send(rep)
        })
        .catch(err => res.status(401).json(err));
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
  let Pseudo = req.body.Pseudo;
  let Password = req.body.Password;
  let connection = db.CreateUser(Pseudo, Password);
  res.send(connection);
});

router.post('/message', (req, res) => {
    if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ') ){
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }else{
        let token = req.headers.authorization.replace('Bearer ', '');
        jwt.verify(token, config.JWT_SECRET, (err, decode) =>{
            if(err){
                return res.status(401).json({ message: 'Bad bearer token' });
            }else{
                const payload = req.body.message;
                const topic = req.body.Pseudo;
                pusher.trigger('chat', topic, payload);
                res.send(payload)
            }
        })
    }
});

router.get("/connect/:Pseudo", (req, res) =>{
    if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ') ){
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }else{
        let token = req.headers.authorization.replace('Bearer ', '');
        jwt.verify(token, config.JWT_SECRET, (err, decode) =>{
            if(err){
                return res.status(401).json(err);
            }else{
                const payload = {type: "connection", message: "Salam ina neman dan wasa. Ka amince wu yi wasa?"};
                const topic = req.params.Pseudo;
                pusher.trigger('chat', topic, payload);
                res.send(payload)
            }
        })
    }
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
  res.send({api: "dara-backend", router: ["/create", "/authenticate", "/message"]});
});

module.exports = router;

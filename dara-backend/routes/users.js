var express = require('express');
var router = express.Router();
var Pusher = require('pusher');
const db = require("../database/DataBaseManagement");

const pusher = new Pusher({
  appId: 'DarraWebSocket',
  key: '',
  secret: 'YOUR_PUSHER_SECRET',
  cluster: 'YOUR_CLUSTER',
  encrypted: true
});

router.get("/authenticate", (req, res) =>{
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
      return res.status(401).json({ message: 'Missing Authorization Header' });
    }
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [Pseudo, Password] = credentials.split(':');
    db.ConnectUser(Pseudo, Password)
        .then(rep => res.send(rep))
        .catch(err => res.status(401).json(err));
  });




router.post("/create", (req, res) =>{
  let Pseudo = req.body.Pseudo;
  let Password = req.body.Password;
  let connection = db.CreateUser(Pseudo, Password);
  res.send(connection);
});

router.post('/message', (req, res) => {
  const payload = req.body.message;
  const topic = req.body.topic;
  pusher.trigger('chat', topic, payload);
  res.send(payload)
});


router.get('/', function(req, res) {
  res.send({api: "dara-backend", router: ["/create", "/authenticate", "/message"]});
});

module.exports = router;

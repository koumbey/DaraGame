const Pusher = require('pusher');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();


app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const pusher = new Pusher({
    appId: 'YOUR_PUSHER_APP_ID',
    key: 'YOUR_PUSHER_APP_KEY',
    secret: 'YOUR_PUSHER_SECRET',
    cluster: 'YOUR_CLUSTER',
    encrypted: true
});

app.set('PORT', process.env.PORT || 5000);


app.post('/message', (req, res) => {
    const payload = req.body;
    pusher.trigger('chat', 'message', payload);
    res.send(payload)
});


app.listen(app.get('PORT'), () =>
    console.log('Listening at ' + app.get('PORT')))
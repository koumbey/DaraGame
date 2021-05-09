import  axios from 'axios';
const DaraApi = axios.create({baseURL: "http://localhost:5000/"});

const subscriptions = {};
const socket  = new WebSocket("ws://localhost:5000/");


const DaraSocket = {
   subscribe : function (topic, callback) {
       if (typeof callback === "function"){
           if (topic in subscriptions){
               subscriptions[topic].push(callback)
           }else{
               subscriptions[topic] = [callback]
           }
       }

   },
    send :  function (data) {
        socket.send(data)
    }
};

socket.onmessage = function (ev) {
    if (ev && ev.data){
        let data = JSON.parse(ev.data);
        if (data.topic in subscriptions){
            subscriptions[data.topic].forEach(callback =>{
                callback(data)
            })
        }
    }
};

export {
    DaraApi,
    DaraSocket
}
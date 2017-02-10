var express = require('express')
var app = express()
var port = process.env.PORT || 8000
RedisSMQ = require("rsmq")
rsmq = new RedisSMQ( {host: "127.0.0.1", port: 6379, ns: "rsmq"} )


app.use(express.static(__dirname + '/'))



app.get('/', function(req, res) {
  res.sendFile(__dirname + '/home.html')
});



rsmq.listQueues( function (err, queues) {
  if( err ){
    console.error( err )
    return
  }
  console.log("Active queues: " + queues.join( "," ) )
});



// rsmq.sendMessage({qname:"myqueue", message:"Hello World"}, function (err, resp) {
//   if (resp) {
//     console.log("Message sent. ID:", resp);
//   }
// });


setInterval( function() {
  rsmq.receiveMessage({qname:"myqueue"}, function (err, resp) {
    if (resp.id) {
      console.log("Message received.", resp)  
    }
    else {
      console.log("No messages for me...")
    }
  });
}, 1000)

// rsmq.createQueue({qname:"myqueue"}, function (err, resp) {
//   if (resp===1) {
//     console.log("queue created")
//   }
// });

app.listen(port, () => console.log('listening on port ' + port))

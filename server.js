
// loading all dependencies
var express = require("express");
var http = require("http");
var path = require("path");
var socketIO = require("socket.io");
//setting the port
var port = 8080;
//initializing framework
const players = {};
// instancing
var app = express(); //default constructor
var server = http.Server(app); //to launch Express
var io = socketIO(server); //passing "server" so that it runs on IO server
app.set("port", port);
//used "public" folder to use external CSS and JS
app.use("/publc", express.static("C:\\Users\\conno\\Downloads\\multiplayergame\\publc"));
//port listening
server.listen(port, function() {
console.log("listening…");
});
//handling requests and responses by setting the Express framework
app.get("/", function (req, res) {
// res.sendFile(path.join(__dirname, "index.html"));
res.sendFile("C:\\Users\\conno\\Downloads\\multiplayergame\\publc\\html\\index.html");
});
count=0;
io.on('connection', function(socket) {
    console.log('a user connected');
    
    socket.emit("chat message", socket.id)

    // need to emit players!!!!!!!!!!!!!!!!!!!!!!!!
    socket.emit("starting", players);

    players[socket.id] = {
      player_id: socket.id,
      wood: " ",
      postA: " ",
      postB: " ",
      postC: " ",
      blitz: " ",
      };

    socket.on("cardChange", function(w, a, b, c, bl){
      players[socket.id].wood=w;
      players[socket.id].postA=a;
      players[socket.id].postB=b;
      players[socket.id].postC=c;
      players[socket.id].blitz=bl;
      socket.broadcast.emit("opoChange", Object.values(players[socket.id]).slice(1));
    } )

    socket.on("getOpo", function() {
      let temp = players;
      // console.log(temp);
      delete temp[socket.id];
      temp = temp[Object.keys(temp)[0]];
      
      socket.emit("hereOpo", temp);
    })

    socket.on("madeBlitz", function(c, n, x, y){
      socket.broadcast.emit("newBlitz", c, n, x, y)
    })
    
    socket.on('disconnect', function(){
      delete players[socket.id];
      console.log('user disconnected: ' + socket.id);
    });
  });


// io.on("connection", function (socket) { //returns socket which is a piece of data that talks with server and client
// console.log("Someone has connected");





// // players[socket.id] = {
// // player_id: socket.id,
// // x: 500,
// // y: 500
// // };
// socket.emit("actualPlayers", players); //sends info back to that socket and not to all the other sockets
// socket.broadcast.emit("new_player", players[socket.id]);
// // when player moves send data to others
// socket.on("player_moved", function(movement_data) {
// players[socket.id].x = movement_data.x;
// players[socket.id].y = movement_data.y;
// players[socket.id].angle = movement_data.angle;
// // send the data of movement to all players
// socket.broadcast.emit("enemy_moved", players[socket.id]);
// });
// //synchronizing shooting
// socket.on("new_bullet", function(bullet_data) {
// socket.emit("new_bullet", bullet_data);
// socket.broadcast.emit("new_bullet", bullet_data);
// });
// socket.on("disconnect", function () {
// console.log("someone has disconnected");
// delete players[socket.id];
// socket.broadcast.emit("player_disconnect", socket.id);
// });
// });
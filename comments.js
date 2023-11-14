// Create web server with the Express framework
const express = require('express');
const app = express();

// Create MongoDB client
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

// Create a web server
const http = require('http');
const server = http.Server(app);

// Create Socket.IO server and listen to the web server
const socketIO = require('socket.io');
const io = socketIO(server);

// Set the directory for the web server
app.use(express.static('public'));

// Start the web server
server.listen(3000, function () {
    console.log('Listening on port 3000');
});

// When a client connects, listen to messages sent by the client
io.on('connection', function (socket) {
    socket.on('message', function (message) {
        // When a message is received, broadcast it to all other clients
        socket.broadcast.emit('message', message);
    });
});

// When a client connects, listen to comments from the client
io.on('connection', function (socket) {
    socket.on('comment', function (comment) {
        // When a comment is received, save it to the database and broadcast it to all other clients
        MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            dbo.collection("comments").insertOne(comment, function (err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
        });
        socket.broadcast.emit('comment', comment);
    });
});

// When a client connects, listen to comments from the client
io.on('connection', function (socket) {
    socket.on('like', function (like) {
        // When a like is received, update it to the database and broadcast it to all other clients
        MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            dbo.collection("comments").updateOne({ _id: like._id }, { $set: { likes: like.likes } }, function (err, res) {
                if (err) throw err;
                console.log("1 document updated");
                db.close();
            });
        });
        socket.broadcast.emit('like', like);
    });
});
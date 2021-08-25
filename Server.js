let express = require("express");

let app = express();

let http = require("http").Server(app);

let io = require("socket.io")(http);

//load the module and create the reference
let obj = require("mongodb").MongoClient;
let url = "mongodb://localhost:27017"; // the port number 27017 is the default port of mongodb

let currentUser = "";

app.get("/", (req, res)=>{
    res.sendFile(__dirname+"/LoginPage.html");
});

io.on("connection", (socket)=>{
    console.log("Client connected");
    // to get the message from client
    socket.on("obj", (msg)=>{
        console.log(msg);
    });

    socket.on("data", (msg)=>{
        console.log(msg);
        obj.connect(url,(err, client)=>{
            if(!err){
                let db = client.db("Chatbox");     //connected to database
                //         name of collection
                db.collection("UsersChat").insertOne(msg,(err, result)=>{
                    if(!err){
                        console.log(result);
                    }else{
                        console.log(err);
                    }
                })
            }else{
                console.log(err);
            }
        });
    });

    socket.on("name", (uname)=>{
        console.log(uname);
        socket.emit("redirect","http://localhost:9090/index.html");
        obj.connect(url,(err, client)=>{
            if(!err){
                let db = client.db("Chatbox");     //connected to database
                //         name of collection
                db.collection("Users").insertOne(uname,(err, result)=>{
                    if(!err){
                        console.log(result);
                    }else{
                        console.log(err);
                    }
                    currentUser = uname;
                });
            }else{
                console.log(err);
            }
        });
    });

    socket.on("getUserName", ()=>{
        socket.emit("currentUserName",currentUser);
    })
});

app.get("/index.html", (req,res)=>{
    res.sendFile(__dirname+"/index.html");
});

http.listen(9090, ()=>console.log("running on port 9090"));




/*
    already finished the bare minimum of the project.

    now thing to improve:
    -   make groups for each chat.
    -   add a method to retrieve chats
    -   add delete
    -   improve schema of the database.


*/
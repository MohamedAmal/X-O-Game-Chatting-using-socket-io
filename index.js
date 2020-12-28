const express = require("express");
const app = express();
var fs = require("fs");
app.use(express.json())

var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
const socket = require("socket.io");

// App setup
const PORT = 5000;

const server = app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});

// Static files
app.use(express.static("public"));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});


var jsonParser = bodyParser.json()

app.post('/signin', jsonParser, function (req, res) {
    const user = {
        email: req.body.email,
        password: req.body.password
    };
    fs.readFile(__dirname + "/" + "users.json", 'utf8', async function (err, data) {
        data = JSON.parse(data)
        var isValid = 'false'
        await Object.keys(data).forEach((e) => {
            if (data[e].email == user.email && data[e].password == user.password) {
                isValid = 'true'
            }
        })
        console.log(isValid)
        return res.end(isValid)
    })
})


app.post('/signup', jsonParser, function (req, res) {
    fs.readFile(__dirname + "/" + "users.json", 'utf8', async function (err, data) {
        data = JSON.parse(data)
        var arr = Object.keys(data)
        var count = data[arr[arr.length - 1]]["id"] + 1
        var user = {
            email: req.body.email,
            password: req.body.password,
            id: count
        };
        data[`user${count}`] = user;
        res.end(JSON.stringify(data));
        let dat = await fs.writeFileSync(fileName, JSON.stringify(data));
        console.log(dat)
    })
})

// Socket setup
const io = socket(server);

const activeUsers = new Set();

io.on("connection", function (socket) {
    console.log("Made socket connection");

    socket.on("new user", function (data) {
        socket.userId = data;
        activeUsers.add(data);
        io.emit("new user", [...activeUsers]);
    });

    socket.on("disconnect", () => {
        activeUsers.delete(socket.userId);
        io.emit("user disconnected", socket.userId);
    });

    socket.on("chat message", function (data) {
        io.emit("chat message", data);
    });

    socket.on("typing", function (data) {
        socket.broadcast.emit("typing", data);
    });
});


var clients = 0;
var registeredPlayers = 0;
var authorizedPlayers = []
var firstPlayer = null
function randomArrIndex(array) {
    // to get random indexes based on the array length
    return Math.floor(Math.random() * array.length)
}

firstPlayer = [0, 1][randomArrIndex([0, 1])]
var finalFirstPlayer = firstPlayer

io.on('connection', function (socket) {
    clients++;
    io.emit('broadcast', { description: clients + ' clients connected!' });

    socket.on("played cell", function (data) {
        io.emit("played cell", data);
    });

    socket.on("player-registeration", function (data) {
        if (registeredPlayers < 2) { 
            registeredPlayers++
            authorizedPlayers.push(data) 
            io.emit("registered", { players: registeredPlayers, authorizedPlayers: authorizedPlayers, user: data })

        }
        if (registeredPlayers == 2) { io.emit("registeration done", { players: registeredPlayers, authorizedPlayers: authorizedPlayers, user: data }) }
    }); 


    socket.on("removePlayer", function (userName) {
        authorizedPlayers.forEach((e) => {
            if (e == userName) {
                authorizedPlayers.splice(authorizedPlayers.indexOf(e), 1)
                registeredPlayers--
            }
        })
        io.emit('removed', { players: registeredPlayers, authorizedPlayers: authorizedPlayers, user: userName })
    })

    socket.on("pausePlayer", function (data) {
        io.emit('pausePlayer', data)
    })



    socket.on("firstPlayer", function (data) {
            io.emit('firstPlayer', { firstPlayer: finalFirstPlayer, clicked: data.clicked })
    })

    socket.on("Winning", function (message) {
        io.emit('Winning', message)
    })

    socket.on('disconnect', function () {
        clients--;
        io.emit('broadcast', { description: clients + ' clients connected!' });

    });
});  






// io.on('connection', function (socket) {
//     clients++;
//     io.sockets.emit('broadcast', { description: clients + ' clients connected!' });
//     socket.on('disconnect', function () {
//         clients--;
//         io.sockets.emit('broadcast', { description: clients + ' clients connected!' });
//     });
// });

//  socket.on('broadcast',function(data) {
//     document.body.innerHTML = '';
//     document.write(data.description);
//  });

//  io.on('connection', function(socket) {
//     clients++;
//     socket.emit('newclientconnect',{ description: 'Hey, welcome!'});
//     socket.broadcast.emit('newclientconnect',{ description: clients + ' clients connected!'})
//     socket.on('disconnect', function () {
//        clients--;
//        socket.broadcast.emit('newclientconnect',{ description: clients + ' clients connected!'})
//     });
//  });

//  socket.on('newclientconnect',function(data) {
//     document.body.innerHTML = '';
//     document.write(data.description);
//  });
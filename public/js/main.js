const socket = io();

const messageBox = document.querySelector("#panel-body");
const inputField = document.querySelector(".chat_input");
const messageForm = document.querySelector(".input-group");
const test1 = document.querySelector("#server-test1");
const test2 = document.querySelector("#server-test2");
// const fallback = document.querySelector(".fallback");
// const inboxPeople = document.querySelector(".inbox__people");


$('.container1').css('pointer-events', 'none');
var currentPlayers = []
var firstPlayer = null
var secondPlayer = null
var player1 = []
var player2 = []
var player1Selection = o
var player2Selection = x
var toss = null
var tossing = true

var array = [
    ['c1', 'c2', 'c3'],
    ['c4', 'c5', 'c6'],
    ['c7', 'c8', 'c9'],
    ['c1', 'c4', 'c7'],
    ['c2', 'c5', 'c8'],
    ['c3', 'c6', 'c9'],
    ['c1', 'c5', 'c9'],
    ['c3', 'c5', 'c7'],
]
function winning(list) {
    // checks if there is a winning player (single mode)
    var test = 0
    var temp = false
    array.forEach((subArr) => {
        subArr.forEach((e) => {
            if (list.includes(e)) {
                test++
            }
            if (test == 3) {
                temp = true
            }
        })
        test = 0
    })
    return temp
}

let userName = "";

const newUserConnected = (user) => {
    userName = user || `User${Math.floor(Math.random() * 1000000)}`;
    socket.emit("new user", userName);
};



const addNewMessage = ({ user, message }) => {
    const time = new Date();
    const formattedTime = time.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });


    const receivedMsg = `<div class="row msg_container base_receive">
    <div class="col-md-2 col-xs-2 avatar">
        <img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg"
            class=" img-responsive ">
    </div>
    <div class="col-md-10 col-xs-10">

        <div class="messages msg_receive">
            <p>${message}</p>
            <time >${formattedTime}</time>
        </div>
    </div>
  </div>`;

    const myMsg = `<div class="row msg_container base_sent">
    <div class="col-md-10 col-xs-10">
        <div class="messages msg_sent">
            <p>${message}</p>
            <time>${formattedTime}</time>
        </div>
    </div>
    <div class="col-md-2 col-xs-2 avatar">
        <img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg"
            class=" img-responsive ">
    </div>
    </div>`
    console.log(messageBox)
    messageBox.innerHTML += user === userName ? myMsg : receivedMsg;
};

// new user is created so we generate nickname and emit event
newUserConnected();

function send() {
    messageForm.addEventListener("submit", (e) => {
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaa")
        e.preventDefault();
        if (!inputField.value) {
            return;
        }

        socket.emit("chat message", {
            message: inputField.value,
            nick: userName,
        });

        inputField.value = "";
    });
}

// inputField.addEventListener("keyup", () => {
//     socket.emit("typing", {
//         isTyping: inputField.value.length > 0,
//         nick: userName,
//     });
// });

socket.on("user disconnected", function (userName) {
    // document.querySelector(`.${userName}-userlist`).remove();
    currentPlayers.forEach((e) => {
        if (e == userName) {
            currentPlayers.splice(currentPlayers.indexOf(e), 1)
            socket.emit('removePlayer', e)
        }
    })

});

socket.on("chat message", function (data) {
    console.log('this is Warninggggggggggggggggggggggggg')
    console.log(data)
    addNewMessage({ user: data.nick, message: data.message });
});

socket.on("typing", function (data) {
    const { isTyping, nick } = data;

    if (!isTyping) {
        fallback.innerHTML = "";
        return;
    }

    fallback.innerHTML = `<p>${nick} is typing...</p>`;
});


socket.on('broadcast', function (data) {
    test1.innerHTML = data.description;
});

socket.on("played cell", function (data) {
    console.log(data)
    document.getElementById(data.cell).innerHTML = data.playerSelection

});



multiPlayer.onclick = (e) => {
    socket.emit("player-registeration", userName);
}

socket.on("registered", function (data) {
    currentPlayers = data.authorizedPlayers
    if (userName == data.user) {
        $('#two').hide()
        $('#startNow').show()
        if (currentPlayers < 2) {
            $('.state').html('Wait for another player to join')
        }
    }
    test2.innerHTML = `${data.players} Players are connected`
});
// currentPlayers.includes(userName)

socket.on("registeration done", function (data) {
    test2.innerHTML = `registeration done`
    currentPlayers = data.authorizedPlayers
    if (userName == data.user) {
        $('.state').html('')
        $('#startNow').show()
    }
    if (!currentPlayers.includes(userName)) {
        $('#two').hide()
        $('.state').html('You are a spectator')
    }
});

socket.on("removed", function (data) {
    test2.innerHTML = `${data.players} Players are connected`
    currentPlayers.forEach((e) => {
        if (e != userName) {
            $('#two').show()
        }
    })
});


socket.on("firstPlayer", function (data) {
    toss = data.firstPlayer
    if (toss == 0) {
        firstPlayer = currentPlayers[0]
        secondPlayer = currentPlayers[1]
        if (userName == currentPlayers[0]) {
            test2.innerHTML = `Player 1 ${toss} ${firstPlayer} ${secondPlayer} ${userName}`
        }
        if (userName == currentPlayers[1]) {
            test2.innerHTML = `Player 2 ${toss} ${firstPlayer} ${secondPlayer} ${userName}`
        }
    } else if (toss == 1) {
        firstPlayer = currentPlayers[1]
        secondPlayer = currentPlayers[0]
        if (userName == currentPlayers[0]) {
            test2.innerHTML = `Player 2 ${toss} ${firstPlayer} ${secondPlayer} ${userName}`
        }
        if (userName == currentPlayers[1]) {
            test2.innerHTML = `Player 1 ${toss} ${firstPlayer} ${secondPlayer} ${userName}`
        }
    }
    if (userName == data.clicked) {
        $('#startNow').hide()
        $(".state").show()
        $('.logs').css('padding-top', '50px')
        // if (currentPlayers.includes(userName)) {
        // }
       
    }
    //  $('.state').html(`Player ${toss + 1} tturn`)
    if (userName == firstPlayer) {
        console.log('it works!')
        $('.container1').css('pointer-events', 'auto');
    }
    play()
});


var startNow = document.getElementById('startNow')
startNow.onclick = (e) => {
    if (tossing) {
        socket.emit('firstPlayer', { clicked: userName })
        tossing = false
    }
}


function play() {
    cell.forEach((a) => {
        a.onclick = (e) => {
            if (userName == firstPlayer) {
                player1.push(e.target.classList[1])
                e.target.innerHTML = player1Selection
                // 
                socket.emit("played cell", {
                    cell: e.target.classList[1],
                    playerSelection: player1Selection,
                    player: 'player 1'
                });
                // 
                e.target.style.pointerEvents = 'none'
                if (winning(player1) == true) {
                    socket.emit("Winning", 'Player 1 won')

                }
                else {
                    socket.emit('pausePlayer', { pause: firstPlayer, activate: secondPlayer, message: 'Player 2 Turn' })
                    play()
                }
            } else if (userName == secondPlayer) {
                player2.push(e.target.classList[1])
                e.target.innerHTML = player2Selection
                // 
                socket.emit("played cell", {
                    cell: e.target.classList[1],
                    playerSelection: player2Selection,
                    player: 'player 2'
                });
                // 
                e.target.style.pointerEvents = 'none'
                if (winning(player2) == true) {
                    socket.emit("Winning", 'Player 2 won')
                }
                else {
                    socket.emit('pausePlayer', { pause: secondPlayer, activate: firstPlayer, message: 'Player 1 Turn' })
                    play()
                }

            }

        }

    })
}


socket.on("pausePlayer", function (data) {
    if (userName == data.pause) {
        $('.container1').css('pointer-events', 'none')
        $('.state').html(data.message)
    }
    if (userName == data.activate) {
        $('.container1').css('pointer-events', 'auto')
        $('.state').html(data.message)
    }
});

socket.on("Winning", function (winningMessage) {
    $('.container1').css('pointer-events', 'none')
    $('.cell').css('pointer-events', 'none');
    $(".state").hide();
    $(".result").css('padding', 0);
    $('.result').html(winningMessage)
    $('.play-again').show()
})



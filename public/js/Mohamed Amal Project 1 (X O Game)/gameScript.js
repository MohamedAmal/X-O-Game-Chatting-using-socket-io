$('.play-again').hide()
var result = document.getElementsByClassName('result')
var turn = document.getElementsByClassName('state')
var onePlayer = document.getElementById('one')
var twoPlayers = document.getElementById('two')
var playAgain = document.getElementById('play-again')
var cell = document.querySelectorAll('.cell')
var o = `<i class="far fa-circle"></i>`
var x = `<i class="fas fa-times"></i>`
var playerSelection = o
var pcSelection = x

// All possible cells necessary for winning
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

var vacantCells = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9']
var gradeOne = ['c1', 'c3', 'c5', 'c7', 'c9'] // cells of high importance
var occupied = []
var playerList = []
var pcList = []
var player1 = []
var player2 = []
var player1Selection = o
var player2Selection = x
var mode = null
var currentPlayer = null
var state = null

$(".state").hide()

//sets single player mode
onePlayer.onclick = (e) => {
    $('.buttons').hide()
    $('.logs').css('padding-top', '50px ')
    mode = 1
    state = [0, 1][randomArrIndex([0, 1])]
    console.log(state, mode)
    changeState(mode, state)
    if (state == 1) {
        setTimeout(() => { pcTurn() }, 1000)
    }
}
//sets muliplayer mode
twoPlayers.onclick = (e) => {
    $('.buttons').hide()
    $('.logs').css('padding-top', '50px ')
    mode = 2
    currentPlayer = [1, 2][randomArrIndex([1, 2])]
    $(".state").show()
    $('.state').html('Player ' + currentPlayer + ' Turn')
    players()
}

function changeState(mode, state) {
    // updates data for real time notifications
    $(".state").show()
    if (mode == 1 && state == 0) {
        $('.state').html('Your Turn')
    }
    else if (mode == 1 && state == 1) {
        $('.state').html('PC Turn')
    }
    else if (mode == 1 && state == null) {
        // $(".state").hide();
        // $(".result").css('padding', 0);
    }
}

changeState(mode, state)


function players() {
    // to shift turns in multiplayer mode
    cell.forEach((a) => {
        a.onclick = (e) => {
            if (currentPlayer == 1 && mode == 2) {
                player1.push(e.target.classList[1])
                e.target.innerHTML = player1Selection
                e.target.style.pointerEvents = 'none'
                if (winning(player1) == true) {
                    $('.cell').css('pointer-events', 'none');
                    $(".state").hide();
                    $(".result").css('padding', 0);
                    $('.result').html('Player 1 won')
                    $('.play-again').show()
                }
                else {
                    currentPlayer = 2
                    $('.state').html('Player 2 Turn')
                    players()
                }
            } else if (currentPlayer == 2 && mode == 2) {
                player2.push(e.target.classList[1])
                e.target.innerHTML = player2Selection
                e.target.style.pointerEvents = 'none'
                console.log('player2')
                if (winning(player2) == true) {
                    $('.cell').css('pointer-events', 'none');
                    $(".state").hide();
                    $(".result").css('padding', 0);
                    $('.result').html('Player 2 won')
                    $('.play-again').show()
                }
                else {
                    currentPlayer = 1
                    $('.state').html('Player 1 Turn')
                    players()
                }
            }

        }

    })
}


playAgain.onclick = (e) => {
    //  Resetting game ...
    $('.buttons').show()
    $('.logs').css('padding-top', '20px ')
    $('.result').html('')
    $('.play-again').hide()
    $('.cell').css('pointer-events', 'auto');
    $('.cell').html('')
    vacantCells = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9']
    gradeOne = ['c1', 'c3', 'c5', 'c7', 'c9']
    occupied = []
    playerList = []
    pcList = []
    player1 = []
    player2 = []
    player1Selection = o
    player2Selection = x
    mode = null
    currentPlayer = null
    state = null
}


function getRandomInt(min, max) {
    // gets random number from min to max-1
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function randomArrIndex(array) {
    // to get random indexes based on the array length
    return Math.floor(Math.random() * array.length)
}

function updateOperation(element) {
    // updates after every move mainly for (pcList)
    pcList.push(element)
    occupied.push(element) //add selected to occupied []
    vacantCells.splice(vacantCells.indexOf(element), 1)
    $('.' + element).css('pointer-events', 'none');
    if (gradeOne.includes(element)) {
        gradeOne.splice(gradeOne.indexOf(element), 1)
    }
}

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


cell.forEach((a) => {
    // on cell click play, if the player won then it is a win , if not let pc play (single mode)
    a.onclick = (e) => {
        if (mode == 1 && state == 0) {
            state = 1
            changeState(mode, state)
            if (e.target.style.pointerEvents = 'auto') {
                e.target.style.pointerEvents = 'none'
                e.target.innerHTML = playerSelection
                playerList.push(e.target.classList[1].toString())
                occupied.push(e.target.classList[1].toString())
                vacantCells.splice(vacantCells.indexOf(e.target.classList[1]), 1)

                if (gradeOne.includes(e.target.classList[1])) {
                    gradeOne.splice(gradeOne.indexOf(e.target.classList[1]), 1)
                }
                if(vacantCells.length == 0){
                    // $(".result").html('Game Over')
                    // $(".result").css('padding', 0);
                    // $('.state').hide()
                    state = null
                    changeState(mode, state)
                    $('.result').html('Game Over')
                    $(".result").css('padding', 0);
                    $('.state').hide()
                    $('.play-again').show()
                    
                }
                if (winning(playerList) == true) {
                    state = null
                    changeState(mode, state)
                    $('.cell').css('pointer-events', 'none');
                    $('.result').html('You won')
                    $('.play-again').show()
                    $('.state').hide()
                } else {
                    setTimeout(() => {
                        pcTurn()
                    }, 1000)
                }
            }
        }
    }
})


if (mode == 1 && state == 1) { 
    // pc turn
    setTimeout(() => {
        pcTurn()
    }, 1000)
}

function getPossibleTargets(list) {
    // get all possbile targets that helps pc in evading (single mode)
    var test = 0
    var tempList = []
    var third = []
    var finalThird = undefined
    array.forEach((subArr) => {
        subArr.forEach((e) => {    // try to find if two or more elements in pc list are found in one subarray or more
            if (list.includes(e)) {
                test++
                tempList.push(e)
            }
            if (test == 2) {    //get this sub array then get its third number
                subArr.forEach((e) => {
                    if (e != tempList[0] && e != tempList[1]) {
                        third.push(e)
                    }
                })
            }
        })
        test = 0
        tempList = []
    })
    if (third.length > 0) {
        third.forEach((e) => {
            if (gradeOne.includes(e) && vacantCells.includes(e)) {
                finalThird = e
            }
        })
        if (finalThird == undefined) {
            third.forEach((e) => {
                if (vacantCells.includes(e)) {
                    finalThird = e
                }
            })
        }
    } else { finalThird == undefined }

    return finalThird
}





function firstPlay() {
    // get random element from gradeOne array 
    var playTemp = ''
    playTemp = gradeOne[randomArrIndex(gradeOne)]
    $("." + playTemp).html(x);

    updateOperation(playTemp)
}


function win() {
    //checks if there is a chance to win and then chooses the winning cell
    var test = 0
    var tempArr = []
    var third = []
    var finalThird = []
    array.forEach((subArr) => {
        subArr.forEach((e) => {
            if (pcList.includes(e)) {
                test++
                tempArr.push(e)
            }
            if (test == 2) {
                subArr.forEach((e) => {
                    if (e != tempArr[0] && e != tempArr[1] && vacantCells.includes(e)) {
                        third.push(e)    //  bring third element
                        console.log('The winning third is ' + third)
                    }
                })
            }
        })
        test = 0
        tempArr = []
    })
    console.log('Trying to win ' + third)
    if (third.length > 0) {
        third.forEach((e) => {
            if (vacantCells.includes(e)) {
                finalThird.push(e)
            }
        })
        console.log('win', finalThird)
        return finalThird[randomArrIndex(finalThird)]
    }
    else { return undefined }

}

function evade(list) {  
    // bring the third element of every possible pair in playerList and then let pc play their third element
    var evadeTemp = getPossibleTargets(list)
    updateOperation(evadeTemp)
    return evadeTemp
}

function play() {
    // get all possible moves and clear paths based on the previously played cells
    // by bringing all subarrays from array that contain only one played cell and two vacant cells
    // or if the previuos is not valid we will depend on random choice from gradeOne list
    // and if it is empty we will depend on any random choice to complete the game
    var test = 0
    var notOccupied = 0
    var tempPLayArr
    var eligibleArrays = []
    var tempChoice = []
    var finalChoice = undefined
    array.forEach((subArr) => {
        // get all possible sub arrays of previously played cells
        subArr.forEach((e) => {
            if (pcList.includes(e)) {
                test++   // check subarrays that constitutes each previously played cell in pc list
            }
        })
        if (test > 0) {
            subArr.forEach((e) => {
                if (vacantCells.includes(e)) {
                    notOccupied++   // scanning for clear paths
                }
            })
            if (notOccupied == 2) {
                eligibleArrays.push(subArr)
            }
        }
        test = 0
        notOccupied = 0
    })
    if (eligibleArrays.length > 0) {
        tempPLayArr = eligibleArrays[randomArrIndex(eligibleArrays)]
        tempPLayArr.forEach((e) => {
            if (vacantCells.includes(e)) {
                tempChoice.push(e)
            }
        })
        finalChoice = tempChoice[randomArrIndex(tempChoice)]
        console.log('random eligible ' + finalChoice)
        return finalChoice
    } else if (gradeOne.length > 0) {
        finalChoice = gradeOne[randomArrIndex(gradeOne)]
        console.log('random gradeOne ' + finalChoice)
        return finalChoice
    }
    else if (vacantCells.length > 0) {
        finalChoice = vacantCells[randomArrIndex(vacantCells)]
        console.log('random vacant ' + finalChoice)
        return finalChoice
    } else {
        state = null
        changeState(mode, state)
        $('.result').html('Game Over')
        $(".result").css('padding', 0);
        $('.state').hide()
        $('.play-again').show()
    }
}

function pcTurn() {
    if (pcList.length == 0) {
        console.log('firstPlay')
        firstPlay()
    } else if (pcList.length >= 1) {
        if (win() != undefined) {  // Try to win
            console.log('win')
            var winningCell = win()
            updateOperation(winningCell)
            $("." + winningCell).html(x)
        }
        else if (getPossibleTargets(playerList) != undefined) { // Evade
            console.log('#evade')
            $("." + evade(playerList)).html(x)
        }
        else { // play
            var played = play()
            console.log(played + ' ' + 'played')
            updateOperation(played)
            $("." + played).html(x)
        }
    }
    state = 0
    changeState(mode, state)
    if (winning(pcList) == true) {
        state = null
        changeState(mode, state)
        $('.cell').css('pointer-events', 'none');
        $('.result').html('PC won')
        $('.state').hide()
        $('.play-again').show()
        
    }else if(vacantCells.length == 0){
        // $(".result").html('Game Over')
        // $(".result").css('padding', 0);
        // $('.state').hide()

        state = null
        changeState(mode, state)
        $('.result').html('Game Over')
        $(".result").css('padding', 0);
        $('.state').hide()
        $('.play-again').show()
    }

}





//gets the third element in array of array given ( array , element1 , element 2 )
// function bringThird(arr, a, b) {
//     arr.forEach((e) => {
//         if (e.includes(a) && e.includes(b) && a != b) {
//             e.forEach((e) => {
//                 if (e != a && e != b) {
//                     third = e
//                 }
//             })
//         } else { return undefined }
//     })
//     return third
// }







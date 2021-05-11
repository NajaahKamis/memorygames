//Add eventListener for each cards
var flip = document.querySelectorAll('.card')
flip.forEach(flip => flip.addEventListener('click', flipCard));

//variables for cards
let cardTotal = 0, move = 0, matchedCard=0;
var firstCard, secondCard;

//variables for timer
let second = 0, minute = 0, hour =0;
let tenSecond =0, tenMinute = 0, tenHour=0;
var interval;

//Shuffle() variables
let cardFace = new Array();
let cardLength;

//gameScore() variables
let timeScore = 0, moveScore = 0, totalScore = 0;
let statsArray = new Array();

//Sound variables
let flipSound = 'sounds/rockSlide.mp3';
let matchSound = 'sounds/rockSmash.mp3';
let backgroundMusic = document.getElementById('backgroundMusic');
backgroundMusic.loop = true;
let muteAll = false;

//Welcome Page
function enterGame(){
    //remove 'fas' class so it does not interfere with shuffleCard function, as all cards are using 'fas' class icon
    document.getElementById('startIcon').classList.remove('fas'); 

    startGame();
    document.getElementById('startPopUp').classList.remove('show');//close welcome popup window
    backgroundMusic.play();
}

//Start game or reset function
function startGame(){
    //set cardFace
    cardFace = ['fa-cat','fa-cat','fa-dog','fa-dog','fa-dove','fa-dove','fa-fish','fa-fish','fa-frog','fa-frog','fa-horse','fa-horse','fa-kiwi-bird','fa-kiwi-bird','fa-hippo','fa-hippo'];
   
    //remove additional class
    var removeClass = document.querySelectorAll('.card');
    removeClass.forEach(removeClass => removeClass.classList.remove('flip','matched'));

    //remove all cards from Deck
    var removeCard = document.querySelectorAll('.fas');
    removeCard.forEach(removeCard => removeCard.classList.remove('fa-cat','fa-dog','fa-dove','fa-fish','fa-frog','fa-horse','fa-kiwi-bird','fa-hippo'));
   
    setTimeout(() => shuffleCard(),500);//shuffle card
    enableAllCard();

    //set score variables to default
    matchedCard = 0;
    timeScore = 0;
    moveScore =0;
    totalScore = 0;

    //reset move
    move = 0;
    document.getElementById('moveCounter').innerHTML = `: ${move}`;
    
    //reset Timer
    clearInterval(interval);
    second = 0;
    tenSecond = 0;
    minute = 0;
    tenMinute = 0;
    hour =0;
    tenHour =0;
    document.getElementById('timeCounter').innerHTML = `: ${tenHour}${hour}:${tenMinute}${minute}:${tenSecond}${second}`;

    //get scoreboard array from localStorage
    if (localStorage.getItem('scoreboard') !== null){
        statsArray = JSON.parse(localStorage.getItem('scoreboard'));
    }
}

//Shuffle Card function
function shuffleCard(){
    cardLength = cardFace.length;
    var shuffle = document.querySelectorAll('.fas');
    let result = 0;
    let a = 0;
    while(cardLength !== 0){
        result = Math.floor(Math.random() * (cardLength));
        shuffle[a].classList.add(cardFace[result]);
        cardFace.splice(result,1);
        a++;
        cardLength--;
    }
}

//If the card is flipped
function flipCard(){
    this.classList.add('flip');
    cardTotal++;
    soundFile(flipSound);

    if(cardTotal === 1){//if the first card is flipped
        firstCard = this;
    }
    else if (cardTotal === 2){//if the second card is flipped
        secondCard = this;
        disableAllCard();//disable all card until it finish checking
        setTimeout(function() {checkCard()},900);
    }
}

//Check if the two cards is matched
function checkCard(){
    //if cards matched
    if (firstCard.querySelector('#front').className == secondCard.querySelector('#front').className){
        matchedCard++;
        soundFile(matchSound);
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');

        //if all 8 pairs is found
        if (matchedCard == 8){
            gameScore();
            endGame();
        }
    }else{//reset flipped cards if not matched
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');  
    }
    cardTotal = 0;
    moveCounter();
    enableAllCard(); 
}

//Disable all card function
function disableAllCard(){
    var disable = document.querySelectorAll('.card');
    disable.forEach(disable => disable.classList.add('disable'));
}

//Enable All card function
function enableAllCard(){
    var enable = document.querySelectorAll('.card');
    enable.forEach(enable => enable.classList.remove('disable'));
}

//Move Counter Function
function moveCounter(){
    move++;
    document.getElementById('moveCounter').innerHTML = `: ${move}`;
    if (move == 1){
        timeCounter(); //Timer will start as soon as player start opening the first two cards
    }
}

//Timer Function
function timeCounter(){
    var timer = document.getElementById('timeCounter');
    interval = setInterval(function(){
        second++;
        timeScore++;
        if (second == 10){
            tenSecond++;
            second = 0;
        }
        if (tenSecond == 6){
            minute++;
            tenSecond = 0;
        }
        if(minute == 10){
            tenMinute++;
            minute = 0;
        } 
        if(tenMinute == 6){
            hour++;
            tenMinute = 0;
        }  
        if(hour == 10){
            tenHour++;
            hour = 0;
        }
        timer.innerHTML = `: ${tenHour}${hour}:${tenMinute}${minute}:${tenSecond}${second}`;
    },1000);
}

//gameScore Function
function gameScore(){
    //Score base on timer
    clearInterval(interval);
    timeScore = 500 -(5*(timeScore - 10));

    //Score base on moves
    moveScore = 500 - (5*(move-8));

    //totalScore
    totalScore = timeScore + moveScore;
}

//show Scoreboard function
function showScore(){
    document.getElementById('scorePopUp').classList.add('show');
    document.getElementById('scoreList').innerHTML = '';
    console.log(statsArray.length);

    //sort list by highest score
    if(statsArray.length !== 0){
        statsArray.sort((a,b) => { return b.score - a.score});
        //let scoreboard only show top 5;
        if(statsArray.length > 5){
            statsArray.pop();
        }
        for(var i=0; i < statsArray.length; i++){
            var scoreString = `${statsArray[i].username} \xa0\xa0\xa0\xa0 ${statsArray[i].score}`;
            var element = document.createElement('li');
            element.appendChild(document.createTextNode(scoreString));
            document.getElementById('scoreList').appendChild(element);
        }
    }
    else{
        var element = document.createElement('p')
        element.appendChild(document.createTextNode("NO SCORE YET"));
        document.getElementById('scoreList').appendChild(element);
    }   
}

//Sound effect function
function soundFile(file){
    var audio = document.createElement('audio');
    audio.src = file;
    audio.type = 'audio/mp3';

    //if sound is muted from muteMusic() 
    if(muteAll == false){
        audio.muted = false;
    }else if(muteAll == true){
        audio.muted = true;
    }
    audio.play();
}

//Mute music function
function muteMusic(){
    if(backgroundMusic.muted == false){
        backgroundMusic.muted = true;
        muteAll = true;
        document.getElementById('volumeIcon').innerHTML = 'volume_off';
        document.getElementById('volume').innerHTML = 'OFF';
    }
    else{
        backgroundMusic.muted = false;
        muteAll = false;
        document.getElementById('volumeIcon').innerHTML = 'volume_up';
        document.getElementById('volume').innerHTML = 'ON';
    }
}

//Show popup when game is completed
function endGame(){
    var endGame = document.getElementById('popUp')
    endGame.classList.add('show');
    document.getElementById('showScore').innerHTML = totalScore;
    document.getElementById('showMove').innerHTML = `Moves: ${move}`;
    document.getElementById('showTime').innerHTML = `Time: ${tenHour}${hour}:${tenMinute}${minute}:${tenSecond}${second}`;
}

//Enter username for scoreboard when game completed
function enterStats(){
    let userName = document.getElementById('userName').value;//get player username
    if (userName.trim() !== ''){
        let stats = {username: userName, score: totalScore};
        statsArray.push(stats);//update score board array
        document.getElementById('popUp').classList.remove('show');//close popup window
        showScore();//open scoreboard;
        localStorage.setItem('scoreboard',JSON.stringify(statsArray));//store score array into localStorage
        startGame();//restart game
    }
    else{//if username is empty
        document.getElementById('alert').innerHTML = 'Please enter valid username';
    }
}
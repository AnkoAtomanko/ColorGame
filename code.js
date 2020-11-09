let
    time = 10,
    level = 1,
    timer = 10;

let player = "Player";
let item;
let idItem = 1;
let ratingList = [];
let flag = 0;

function load() {
    //востановление состояния
    time = Number(localStorage.getItem('time'));
    timer = Number(localStorage.getItem('timer'));
    level = Number(localStorage.getItem('level'));
    flag = Number(localStorage.getItem('flag'));
}

function save() {//тут будет сохранение текущего состояния
    localStorage.setItem('time', time);
    localStorage.setItem('timer', timer);
    localStorage.setItem('level', level);
    localStorage.setItem('flag', flag);
}

function timeTick() {
    save();
    
    if (time === 0) {
        loose();
    }
    document.getElementById("timeText").innerHTML = time;
    time--;   
    
}

function rand(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function squareSplit() {
    const
        hue = rand(0, 360),
        saturation = 100,
        lightness = 50,
        squareCount = (level+1) * (level+1),
        gameField = document.getElementById("gameField");

    while (gameField.firstChild) {
        gameField.removeChild(gameField.firstChild);
    }

    gameField.style.gridTemplateColumns = `repeat(${(level+1).toString()}, 1fr)`;

    const
        mainColor = "hsl(" + hue.toString() + ", " + saturation.toString() + "%, " + lightness.toString() + "%)",
        semiColor = "hsl(" + hue.toString() + ", " + (saturation - saturation/level).toString() + "%, " + (lightness - lightness/level).toString() + "%)",
        randomSquare = rand(0, squareCount);

    for (let i = 0; i < squareCount; i++) {

        let square = document.createElement('div');
        square.className = 'square';
        
        if (i === randomSquare) {
            square.style.backgroundColor = semiColor;
            square.id = "semiSquare";
        } else {
            square.style.backgroundColor = mainColor;
            square.id = "mainSquare" + i.toString();
        }

        square.onclick = squareClick;
        gameField.appendChild(square);
    }
}

function loose() {
    clearInterval(timer);
    let gameField = document.getElementById("gameField");

    while (gameField.firstChild) {
        gameField.removeChild(gameField.firstChild);
    }
    
    player = prompt(`Вы проиграли. Вы дошли до ${level.toString()} уровня. Хотите попасть в рейтинг? Напишите Ваш никнейм`, 'Player');
    if (player) setRating();

    level = 1;
    timer = 10;

    document.getElementById("timeText").innerHTML = '0';
    document.getElementById("level").innerHTML = '0';
    flag = 0;
}

function squareClick() {
    if (this.id === "semiSquare") {
        time = 10;
        level++;
        document.getElementById("level").innerHTML = level;
        squareSplit();     
    }
    else {
        loose();
    }
}

function getRaring() {
    document.getElementById("ratingList").innerHTML = "";

    idItem = 1;
    item = localStorage.getItem(idItem);
    while (item) {
        document.getElementById("ratingList").innerHTML = document.getElementById("ratingList").innerHTML + `${idItem.toString()} - ${item} level` + "<br \/>";
        ratingList[idItem] = item;
        item = localStorage.getItem(++idItem);
    }
}

function sort() {
    for (let j = 1; j < idItem; j++) {
        for (let i = 1; i < idItem - j; i++)
        {
            let temp1 = ratingList[i].split(' - ');
            let temp2 = ratingList[i + 1].split(' - ');
            if (Number(temp1[1]) > Number(temp2[1])) {
                let temp = ratingList[i];
                ratingList[i] = ratingList[i+1];
                ratingList[i+1] = temp;
            }
        }
    }
}

function setRating() {
    ratingList[idItem++] = `${player.toString()} - ${level.toString()}`; //добавляем в массив
    localStorage.clear(); //очищаем локальное хранилище
    sort();     //пытаемся сортировать наш список
    for (let i = 1; i < idItem; i++) //добавляем все в локальное хранилище
        localStorage.setItem(i,ratingList[i]);
    
   getRaring(); //обновляем данные на экране
}

function startGame() {
    //localStorage.clear();
    flag = 1;
    clearInterval(timer);
    time = 10;
    timer = 10;
    
    document.getElementById("level").innerHTML = level;
    squareSplit();
    timer = setInterval(timeTick, 1000);
}

function start() { //запускаектся сразу после загрузки страницы
    //localStorage.clear();
    clearInterval(timer);
    getRaring();
    load();
    if (flag === 1) {
        document.getElementById("level").innerHTML = level;
        squareSplit();
        timer = setInterval(timeTick, 1000);
    }
}

function bot(){ //наш ботя

    squareCount = (level+1) * (level+1),
    gameField = document.getElementById("gameField");

    let arraySquare = document.getElementsByClassName('square');
    for (let i = 0; i < squareCount - 2; i++) {
        if(arraySquare[i].style.backgroundColor != arraySquare[i+1].style.backgroundColor)
        {
            if (arraySquare[i].style.backgroundColor != arraySquare[i+2].style.backgroundColor) {
                arraySquare[i].style.backgroundColor = "#FFFFFF";
                alert('Нашел!');
                arraySquare[i].click();
                break;
            } else {
                arraySquare[i+1].style.backgroundColor = "#FFFFFF";
                alert('Нашел!');
                arraySquare[i+1].click();
                break;
            }
        }
    }

}

start();
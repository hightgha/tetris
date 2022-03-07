function createMap(){
    let map = document.getElementById('map');
    for(let i = 0; i < 200; i++){
        let cube = document.createElement('div');
        cube.classList.add('cube');
        cube.id = i;
        map.append(cube);
    }
    let nextMap = document.getElementById('next');
    for(let i = 0; i < 8; i++){
        let cube = document.createElement('div');
        cube.classList.add('nextCube');;
        nextMap.append(cube);
    }
}
createMap();
function moveDown(){
    let canMove = checker();
    let all = [...document.getElementsByClassName('cube')]
    let newIndex = [], classList;
    for(let i = 0; i < all.length; i++){
        if(all[i].classList.contains('activeElem')){
            if(all[i+10] !== undefined){
                newIndex.push([i,i+10]);
                classList = all[i].className;
            } else {
                canMove = false;
                break;
            }
        }
    }
    if(canMove){
        newIndex.forEach(elem => all[elem[0]].className = 'cube');
        newIndex.forEach(elem => all[elem[1]].className = classList);
        let lastId = +matrix[matrix.length-1][3].id;
        if(matrix.length === 2){
            matrix.push(all.slice(lastId+7,lastId + 11));
            matrix.push(all.slice(lastId+17,lastId + 21));
        } else {
            if(+matrix[3][0].id < 190){
                matrix.shift()
                matrix.push(all.slice(lastId+7,lastId + 11));
            }
        }
    }

}

function moveLeft(){
    let active = [...document.getElementsByClassName('activeElem')];
        let all = [...document.getElementsByClassName('cube')];
        let canMove = true;
        for(let i = 0; i < all.length; i++){
            if(all[i].classList.contains('activeElem')){
                if(!(i % 10)){
                    canMove = false;
                    break;
                }
                if(all[i-1]?.className.length > 4 && !(all[i-1]?.classList.contains('activeElem'))){
                    canMove = false;
                    break;
                }
            }
        }
        if(canMove){
            let newActive = active.map(el => el.previousSibling);
            let className = active[0].className;
            active.forEach(el => el.className = 'cube');
            newActive.forEach(el => el.className = className);
            matrix.forEach(e => {
                if(e[0].previousSibling && (+e[0].previousSibling.id) % 10 !== 9){
                    e.unshift(e[0].previousSibling);
                    e.pop();
                }
            })
        }
}

function moveRight(){
    let active = [...document.getElementsByClassName('activeElem')];
        let all = [...document.getElementsByClassName('cube')];
        let canMove = true;
        for(let i = 0; i < all.length; i++){
            if(all[i].classList.contains('activeElem')){
                if(!((i+1) % 10)){
                    canMove = false;
                    break;
                }
                if(all[i+1]?.className.length > 4 && !(all[i+1]?.classList.contains('activeElem'))){
                    canMove = false;
                    break;
                }
            }
        }
        if(canMove){
            let newActive = active.map(el => el.nextSibling);
            let className = active[0].className;
            active.forEach(el => el.className = 'cube');
            newActive.forEach(el => el.className = className);
            matrix.forEach(e => {
                if(e[3].nextSibling && (+e[3].nextSibling.id) % 10 !== 0){
                    e.push(e[3].nextSibling);
                    e.shift();
                }
            })
        }
}

function hardDown(){
    while(checker()){
        moveDown();
    }
}

function keyboard(){
    switch (event.code) {
        case 'Space':
            hardDown();
            break;
        case 'KeyW':
        case 'ArrowUp':
            figureRotate(activeFigure);
            break;
        case 'KeyS':
        case 'ArrowDown':
            moveDown();
            break;
        case 'KeyA':
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'KeyD':
        case 'ArrowRight':
            moveRight();
            break;
    }
}
let matrix = [];
function figureRotate(){
    if(matrix.length === 4){
        let matrixClassList = matrix.map(e => {
            return e.map(cl => cl.className);
        })
        function rotate(matrix){
            const result = [];
            const count = matrix[0].length;
            for(let i = 0; i < count; i++){
              let row = matrix.map(elem => elem.shift()).reverse();
              result.push(row);
            }
            return result;
        }
        matrixClassList = rotate(matrixClassList);
        let canRotate = true;
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                if(matrixClassList[i][j].split(' ').includes('activeElem') && matrix[i][j].classList.length === 2){
                    canRotate = false;
                    break;
                }
            }
        }
        if(!canRotate){
            return;
        }
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                if(matrix[i][j].classList.contains('activeElem')){
                    matrix[i][j].className = 'cube';
                }
            }
        }
        for(let i = 0; i < 4; i++){
            for(let j = 0; j < 4; j++){
                if(matrixClassList[i][j].split(' ').includes('activeElem')){
                    matrix[i][j].className = matrixClassList[i][j];
                }
            }
        }
    }
}

function checker(){
    let all = [...document.getElementsByClassName('cube')];
    let active = [...document.getElementsByClassName('activeElem')];
    let stop = false;
    for(let i = all.length-1; i >= 0 ; i--){
        if(all[i].classList.contains('activeElem')){
            if(i >= 190){
                stop = true;
                break;
            }
            if(all[i+10].className.length !== 4 && !all[i+10].classList.contains('activeElem')){
                stop = true;
                break;
            }
        }
    }
    if(stop){
        active.forEach(e => e.classList.toggle('activeElem'));
        start();
        cleaner();
        return false;
    }
    return true;
}


function newGame(){
    alert('Game Over');
    [...document.getElementsByClassName('cube')].forEach(e=>e.className = 'cube');
    let highscore = document.getElementById('highscore');
    let score = document.getElementById('scoreBoard');
    highscore.innerHTML = Math.max(highscore.innerHTML, score.innerHTML);
    score.innerHTML = 0;
    start();
};

function startBtn(){
    event.target.disabled = true;
    start();
    intervaler();
}

let interval;
function intervaler(){
    let score = document.getElementById('scoreBoard').innerHTML;
    if(interval){
        clearInterval(interval);
    }
    let time = 2000;
    if(score > 1000){        time = 1000;    }
    if(score > 5000){        time = 700;    }
    if(score > 10000){        time = 400;    }
    interval = setInterval(()=>{        moveDown();    },time);
}

let activeFigure = {};
start.lastFigure = [rndmFigure()];

function start(){

    let figure = rndmFigure();
    start.lastFigure.push(figure)
    figure = start.lastFigure.shift();
    let map = [...document.getElementsByClassName('cube')];
    let startPos = [map.slice(3,7),map.slice(13,17)];
    activeFigure = Object.assign({},figure);
    for(let i = 0; i < 2; i++){
        for(let j = 0; j < 4; j++){
            if(figure.figure[i][j] === 1){
                if(startPos[i][j].className.length > 4){
                    return newGame();
                }
                startPos[i][j].classList.add(`activeElem`, `${figure.color}`);
            }
        }
    }
    matrix = startPos;
    figure = start.lastFigure[0];
    let next = [...document.getElementsByClassName('nextCube')];
    next.forEach(e => e.className = 'nextCube');
    next = [next.slice(0,4),next.slice(4)];
    for(let i = 0; i < 2; i++){
        for(let j = 0; j < 4; j++){
            if(figure.figure[i][j] === 1){
                next[i][j].classList.add(`${figure.color}`);
            }
        }
    }
    intervaler();
}
function cleaner(){
    let score = document.getElementById('scoreBoard');
    let cubes = [...document.getElementsByClassName('cube')];
    let map = [];
    for(let i = 0; i < 20; i++){
        map.push(cubes.splice(0,10));
    }
    let deletingLines = [];
    map.forEach((elem,i) => {
        if(elem.every(e => e.className.length > 4) && !elem.some(e => e.classList.contains('activeElem'))){
            deletingLines.push(i);
            elem.forEach(e => e.className = 'cube');
        }
    })
    score.innerHTML = +score.innerHTML + +(deletingLines.length ** 2) * 100;
    while(deletingLines.length){
        let index = Math.min(...deletingLines)-1;
        let grid = document.getElementsByClassName('cube');
        for (let k = index; k >= 0 ; k--) {
            if(map[k].every(e => e.className.length === 4) && map[k+1].every(e => e.className.length === 4)){
                break;
            }
            for(let i = 0; i < 10; i++){
                grid[k+1+''+i].className = grid[k+''+i].className;
            }
            
        }
        deletingLines.shift();
    }
}

function rndmFigure(){
    const figures = [
        [   [1,1,1,1],
            [0,0,0,0]   ],
        
        [   [1,1,0,0],
            [0,1,1,0]   ],
        
        [   [0,0,1,1],
            [0,1,1,0]   ],

        [   [0,0,1,0],
            [1,1,1,0]   ],

        [   [0,1,0,0],
            [0,1,1,1]   ],

        [   [0,0,1,0],
            [0,1,1,1]   ],
        
        [   [0,1,1,0],
            [0,1,1,0]   ]
    ];
    const colors = ['red', 'green', 'yellow', 'blue', 'orange', 'aqua', 'pink'];
    const rndm = Math.trunc(Math.random()*7);
    return {
        figure: figures[rndm],
        color: colors[rndm]
    }
}
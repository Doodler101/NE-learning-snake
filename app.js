let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
let death = false
let showing = 0;
let canShow = 10;
let genSize = 2000;

let batchSize = 100;
let score = 0;
let dead = []
for (let i = 0; i < batchSize; i++) {
    dead.push(false)
}
let batch = 0;
let snakesLeft = 50;
let averageFitness = [];
let touching = 0;
let snake = []

for (let i = 0; i < batchSize; i++) {
    snake.push({
        x: [15,14,13,12],
        y: [20,20,20,20],
        direction: 90,
        size: 4,
    });
}

let loopNodes = []
for (let i = 0; i < batchSize; i++) {
    loopNodes.push([])
}
let count = 100000;
let apple = []
for (let i = 0; i < batchSize; i++) {
    apple.push({
        x: 30,
        y: 20,
    });
}

let appleDirection = []
for (let i = 0; i < batchSize; i++) {
    appleDirection.push({
        x: 4,
        y: 0,
        direction: 90,
    })
}


let highscore = 0;


let nodesArray = []
for (let i = 1; i < 142; i++) {
    nodesArray.push("s" + i)
}

for (let i = 1; i < 17; i++) {
    nodesArray.push("a" + i)
}

for (let i = 1; i < 17; i++) {
    nodesArray.push("b" + i)
}

for (let i = 1; i < 5; i++) {
    nodesArray.push("f" + i)
}

let nodes = {}
for (let i = 0; i < nodesArray.length; i++) {
    nodes[nodesArray[i]] = 0
}

let TotalSteps = 0;
let steps = [];
for (let i = 0; i < batchSize; i++) {
    steps.push(0)
}


let firstSnakeArray = []

//nodes s - nodes a
for (let i = 1; i < 142; i ++) {
    let key = "s" + i + "-"
    for (let j = 1; j < 17; j ++){
        let keyv2 = key
        keyv2 += "a" + j
        firstSnakeArray.push(keyv2)
    }
}
//nodes a - nodes b
for (let i = 1; i < 17; i++){
    let key = "a" + i + "-"
        for (let j = 1; j < 17; j ++){
            let keyv2 = key
            keyv2 += "b" + j
            firstSnakeArray.push(keyv2)
        }
}
//nodes b - up, right, down, left
for (let i = 1; i < 17; i++){
    let key = "b" + i + "-"
        for (let j = 1; j < 5; j ++){
            let keyv2 = key
            keyv2 += "f" + j
            firstSnakeArray.push(keyv2)
        }
}

//weights  a, b, f

for (let i = 1; i < 17; i++) {
    firstSnakeArray.push("a" + i)
}

for (let i = 1; i < 17; i++) {
    firstSnakeArray.push("b" + i)
}





let bestSnake = {}
for (let i = 0; i < firstSnakeArray.length; i++) {
    bestSnake[firstSnakeArray[i]] = 0
}

function getBaseLog (x,y) {
    return Math.log(y) / Math.log(x)
}

let snakes = []
let snakesScore = []
for (let i = 0; i < genSize; i++) {
    snakesScore.push(0)
}
let snakeNumber = 1
let generation = 1
let bestSnakeScore = 0;

function arrayToObject(arr,key) {
    let obj = {}
    for (let i = 0; i < arr.length; i++){
        obj[key[i]] = arr[i]
    }
    return obj;
}

function mutateSnake (oldSnake) {
    let Keys = Object.keys(oldSnake)
    let values = Object.values(oldSnake)
    values = values.map((_el) => {
        if ( (getBaseLog(64, bestSnakeScore / 2 * 64)) < 12) {
            return _el + (Math.random() - 0.5) / (getBaseLog(64, bestSnakeScore / 2 * 64))
        } else {
            return _el + (Math.random() - 0.5) / 12
        }
    });

    snakes.push(arrayToObject(values, Keys))
}

function breedSnake (snake1, snake2, percentage) {
    let Keys1 = Object.keys(snake1)
    let values1 = Object.values(snake1)
    let values2 = Object.values(snake2)
    let totalValues = [];
    for (let i = 0; i < values1.length; i++) {
        totalValues.push((values1[i] * percentage) + (values2[i] * (1 - percentage)))
    }
    snakes.push(arrayToObject(totalValues, Keys1));
}



for (let i = 0; i < genSize; i++) {
    let Keys = Object.keys(bestSnake)
    let values = Object.values(bestSnake)
    values = values.map((el) => {
        return el + (Math.random() - 0.5) * 2
    });

    snakes.push(arrayToObject(values, Keys))
}





function loop () {
    requestAnimationFrame(loop);
    
    //60 fps
    if (++count < 0) {
        return
    }
    showing = 0;
    count = 0;
    TotalSteps++; 
    //clear canvas

    ctx.clearRect(0 , 0, c.width, c.height)
    showing = 0;
    for (let s = 0; s < batchSize; s++) {
        steps[s]++;
        if(dead[s] === false) {
        showing++
  ////////////////////////////////////////////////////////////////////////--- snake ai---///////////////////////////////////////////////////////////////////////////   



        //control snake
        function turnLeft () {
            if (snake[s].direction !== 90) { 
                snake[s].direction = 270
            }
        }

        function turnUp () {
            if (snake[s].direction !== 180) {
                    snake[s].direction = 0
            }
        }


        function turnRight () {
            if (snake[s].direction !== 270) {
                    snake[s].direction = 90
            }
        }   


        function turnDown () {
            if (snake[s].direction !== 0) {
                    snake[s].direction = 180
            }
        }

        // variables remember 1-16 apple direction,    17 - 137 block direction,    138 - 141 snake direction
        (function(){
            nodes = {}
            for (let i = 0; i < nodesArray.length; i++) {
                nodes[nodesArray[i]] = 0
            }

        
            // apple directions x: 1 - 16
            (function(){
                appleDirection[s].x = apple[s].x - snake[s].x[0]
                appleDirection[s].y = apple[s].y - snake[s].y[0]
                
                // 8 general directions
                if (appleDirection[s].y >  appleDirection[s].x && appleDirection[s].x > 0) {
                    nodes.s1 = 7
                }
                if (appleDirection[s].x >  appleDirection[s].y && appleDirection[s].x > 0) {
                    nodes.s2 = 7
                }
                if (-1 * appleDirection[s].x <  appleDirection[s].y && appleDirection[s].y < 0) {
                    nodes.s3 = 7
                }
                if (-1 * appleDirection[s].y >  appleDirection[s].x && appleDirection[s].x > 0) {
                    nodes.s4 = 7
                }
                if (appleDirection[s].y <  appleDirection[s].x && appleDirection[s].x < 0) {
                    nodes.s5 = 7
                }
                if (appleDirection[s].x <  appleDirection[s].y && appleDirection[s].y < 0) {
                    nodes.s6 = 7
                }
                if (-1 * appleDirection[s].x >  appleDirection[s].y && appleDirection[s].y > 0) {
                    nodes.s7 = 7
                }
                if (-1 * appleDirection[s].y <  appleDirection[s].x && appleDirection[s].x < 0) {
                    nodes.s8 = 7
                }
        
                // up down left right
                if (appleDirection[s].y >  0 && appleDirection[s].x === 0) {
                    nodes.s9 = 7
                }
                if (appleDirection[s].y < 0 && appleDirection[s].x === 0) {
                    nodes.s10 = 7
                }
                if (appleDirection[s].x < 0 && appleDirection[s].y === 0) {
                    nodes.s11 = 7
                }
                if (appleDirection[s].x > 0 && appleDirection[s].y === 0) {
                    nodes.s12 = 7
                }

                // diagonals
                if (appleDirection[s].x > 0 && appleDirection[s].y === appleDirection[s].x) {
                    nodes.s13 = 7
                }
                if (appleDirection[s].x < 0 && appleDirection[s].y === appleDirection[s].x) {
                    nodes.s14 = 7
                }
                if (appleDirection[s].x > 0 && appleDirection[s].y === appleDirection[s].x  * -1) {
                    nodes.s15 = 7
                }
                if (appleDirection[s].x < 0 && appleDirection[s].y === appleDirection[s].x * -1) {
                    nodes.s16 = 7
                }
            })();

            // block path tail 17 - 137
            for (let i = 1; i < snake[s].x.length; i++){
                let bodyX = snake[s].x[i] - snake[s].x[0]
                let bodyY = snake[s].y[i] - snake[s].y[0]

                if (bodyX > -6 && bodyX < 6 && bodyY > -6 && bodyY < 6){
                    nodes["s" + (17 + (bodyX + 5) + ((bodyY + 5) * 11))] = 1;
                }

            };

            //block path wall 17 - 137
            (function(){

                let boundariesx = []
                let boundariesy = []
                
                for (let i = -5; i < 0; i++) {
                    for (let j = -5; j < 45; j++){
                        boundariesx.push(j)
                        boundariesy.push(i)
                    }
                }
                for (let i = 40; i < 45; i++) {
                    for (let j = -5; j < 45; j++){
                        boundariesx.push(j)
                        boundariesy.push(i)
                    }
                }
                for (let i = 0; i < 40; i++) {
                    for (let j = -5; j < 0; j++){
                        boundariesx.push(j)
                        boundariesy.push(i)
                    }
                }
                for (let i = 0; i < 40; i++) {
                    for (let j = 40; j < 45; j++){
                        boundariesx.push(j)
                        boundariesy.push(i)
                    }
                }


                for (let i = 0; i < boundariesx.length; i++){
                    let bodyX = boundariesx[i] - snake[s].x[0]
                    let bodyY = boundariesy[i] - snake[s].y[0]

                    if (bodyX > -6 && bodyX < 6 && bodyY > -6 && bodyY < 6){
                        nodes["s" + (17 + (bodyX + 5) + ((bodyY + 5) * 11))] = 1;
                    }

                }
            })();

            //snake direction 138 - 141
            (function(){
                switch (snake[s].direction) {
                    case 0:
                        nodes.s138 = 2;
                        break;
                    case 90:
                        nodes.s139 = 2;
                        break;
                    case 180:
                        nodes.s140 = 2
                        break;
                    case 270:
                        nodes.s141 = 2
                        break;        
                }
            })();

        })();

        //plot map
        (function(){

            for (let i = 1; i < 17; i++) {
                for (let j = 1; j < 142; j++){
                    nodes["a" + i] += nodes["s" + j] * snakes[batch * batchSize+ s]["s" + j + "-a" + i]
                }
                nodes["a" + i] = 1 / (1 + Math.pow(Math.E, -1 * (nodes["a" + i] + (snakes[batch * batchSize + s]["a" + i]))))
            }


            for (let i = 1; i < 17; i++) {
                for (let j = 1; j < 17; j++){
                    nodes["b" + i] += nodes["a" + j] * snakes[batch * batchSize+ s]["a" + j + "-b" + i]
                }
                nodes["b" + i] = 1 / (1 + Math.pow(Math.E, -1 * (nodes["b" + i] + (snakes[batch * batchSize + s]["b" + i]))))
            }


            for (let i = 1; i < 5; i++) {
                for (let j = 1; j < 17; j++){
                    nodes["f" + i] += nodes["b" + j] * snakes[batch * batchSize+ s]["b" + j + "-f" + i]
                }
                nodes["f" + i] = 1 / (1 + Math.pow(Math.E, -1 * nodes["f" + i]))
            }

            // can't turn back on itself
            switch (snake[s].direction) {
                case 0:
                    nodes["f" + 3] = -10000000000000000
                    break;
                case 90:
                    nodes["f" + 4] = -10000000000000000
                    break;
                case 180:
                    nodes["f" + 1] = -10000000000000000
                    break;
                case 270:
                    nodes["f" + 2] = -10000000000000000
                    break;        
            }

        })();

        // turn snake 
        (function(){
            if (nodes["f1"] >= nodes["f2"] && nodes["f1"] >= nodes["f3"] && nodes["f1"] >= nodes["f4"]) {
                turnUp()
            }
            if (nodes["f2"] >= nodes["f1"] && nodes["f2"] >= nodes["f3"] && nodes["f2"] >= nodes["f4"]) {
                turnRight()
            }
            if (nodes["f3"] >= nodes["f2"] && nodes["f3"] >= nodes["f1"] && nodes["f3"] >= nodes["f4"]) {
                turnDown()
            }
            if (nodes["f4"] >= nodes["f2"] && nodes["f4"] >= nodes["f3"] && nodes["f4"] >= nodes["f1"]) {
                turnLeft()
            }
        })();






        ///////////////////////////////////////////////////////////////////////--- move and draw snake ---////////////////////////////////////////////////////////////////////////

        

        function createbody (x , y) {
            ctx.fillStyle = "green"
            ctx.fillRect(x * 20 + 2, y * 20 + 2, 18, 18);
        }
    

        // update snake position
        (function() {
            switch (snake[s].direction) {
                case 0:
                    snake[s].x.unshift(snake[s].x[0])
                    snake[s].y.unshift(snake[s].y[0] - 1)
                    break;

                case 90:
                    snake[s].x.unshift(snake[s].x[0] + 1)
                    snake[s].y.unshift((snake[s].y[0]))
                    break;

                case 180:
                    snake[s].x.unshift(snake[s].x[0])
                    snake[s].y.unshift(snake[s].y[0] + 1)
                    break;

                case 270:
                    snake[s].x.unshift(snake[s].x[0] - 1)
                    snake[s].y.unshift((snake[s].y[0]))
                    break;

            };

            if (snake[s].x[0] > 39 || snake[s].x[0] < 0 || snake[s].y[0] > 39 || snake[s].y[0] < 0) {
                death = true
            }

            if (snake[s].x.length > snake[s].size) {
                snake[s].x.pop()
                snake[s].y.pop()
            }
        })();


        //draw apple
        if (canShow + 1) {
            (function() {
                    ctx.fillStyle = "red"
                    ctx.fillRect(apple[s].x * 20 + 2, apple[s].y * 20 + 2, 18, 18);
            })();
        }
        

        //sense apple and move to different location,
        (function() {

            if (snake[s].x[0] === apple[s].x && snake[s].y[0] === apple[s].y){
                snake[s].size++;

                if (snake[s].size - 4 > score) {
                    score = snake[s].size - 4;
                    document.getElementById("score").textContent = "score: " + score
    
                }

                loopNodes[s] = []
                if ((snake[s].size - 4) > highscore) {
                    document.getElementById("highscore").textContent = "highscore: " + (snake[s].size - 4)
                    highscore++;
                    appleCollected = 1;
                    steps[s] = 0;
                }


                do {
                    apple[s].x = Math.floor(Math.random()*40);
                    apple[s].y = Math.floor(Math.random()*40);

                    touching = 0;
                    for (let i = 0; i < snake[s].x.length; i++) {
                        if (apple[s].x === snake[s].x[i] && apple[s].y === snake[s].y[i]) {
                            touching = 1
                        }
                    }

                }
                while (touching = 0)
            };

        })();
        

        //sense if the snake bumps into itself
        (function() {
            for(let i = 1; i < snake[s].x.length; i++){
                if (snake[s].x[0] === snake[s].x[i] && snake[s].y[0] === snake[s].y[i] ){
                    death = true
                }
            };

        })();


        //draw snake
        if (showing < canShow + 1) {
            (function() {
                for(let i = 0; i < snake[s].x.length; i++) {
                    createbody(snake[s].x[i], snake[s].y[i])
                }
            })();
        }
    
        //check death
        (function(){

            let loopNodesA = loopNodes[s].slice()
            let loopNode = Object.values(nodes).splice(0,141)
            loopNode.push(snake[s].x[0])
            loopNode.push(snake[s].y[0])

            for (let i = 0; i < loopNodesA.length; i++) {
                let n = 0;
                for (let j = 0; j < loopNode.length; j++) {
                    if (loopNodesA[i][j] === loopNode[j]) {
                        n++
                    } else {
                        break;
                    }
                    if (n > 142) {
                        death = true
                    }
                }
                if (death === true) {
                    break;
                }
            }

        })();

        if (TotalSteps % 12 === 0) {
            loopNodes[s].push(Object.values(nodes).splice(0,141))
            loopNodes[s][loopNodes[s].length - 1].push(snake[s].x[0])
            loopNodes[s][loopNodes[s].length - 1].push(snake[s].y[0])
        }

        /////////////////////////////////////////////////////////////////////////////--- kill ai if "death"--- /////////////////////////////////////////////////////////////////

        if (death) {

            loopNodes[s] = []
            apple[s] = {
                x: 30,
                y: 20,
            };
            death = false
            dead[s] = true
            steps[s] = 0
            function fitness(steps , apples) {
                if ((Math.pow(2,apples) + Math.pow(apples + 1, 3) - ((((Math.pow(2,apples) + Math.pow(apples + 1, 3)) - (Math.pow(2,apples - 1) + Math.pow(apples, 3)))) * steps ) / (500 * (apples + 1))) > 1) {
                    return (Math.pow(2,apples) + Math.pow(apples + 1, 3) - ((((Math.pow(2,apples) + Math.pow(apples + 1, 3)) - (Math.pow(2,apples - 1) + Math.pow(apples, 3)))) * steps ) / (500 * (apples + 1)))
                } else {
                    return 1
                }
            }
            snakesScore.splice(s + batch * batchSize, 1, fitness(TotalSteps,snake[s].size - 4))
            snakeNumber++;
            snakesLeft--;
            if (snakesLeft < 1) {
                snakesLeft = 50
                batch++;
                TotalSteps = 0
                dead = []
                for (let i = 0; i < batchSize; i++) {
                    dead.push(false)
                }
                score = 0;
                document.getElementById("score").textContent = "score: 0";
                document.getElementById("group").textContent = "group: " + (batch + 1)
                loopNodes = []
                for (let i = 0; i < batchSize; i++) {
                    loopNodes.push([])
                }
            }

            snake[s] = {
                x: [15,14,13,12],
                y: [20,20,20,20],
                direction: 90,
                size: 4,

            };

            function getAverageSum(a){
                let total = 0;
                for(let i = 0; i < a.length; i++) { 
                    total += a[i]
                }
                total = total / a.length
                return total;
            }
            
/////////////////////////////////////////////////////////////////////////////////////// reproduce ////////////////////////////////////////////////////////////////////

            if (snakeNumber > genSize) {
                averageFitness[generation - 1] = Math.round(getAverageSum(snakesScore))

                // set up best 10 snakes
                let parentSnakes = snakes.slice();
                snakes = [];
                let highestScoreIndex;
                bestSnake = [];
                for (let i = 0; i < 10 ; i++) {
                    highestScoreIndex = snakesScore.indexOf(Math.max(...snakesScore))
                    bestSnake.push(parentSnakes[highestScoreIndex])
                    parentSnakes.splice(highestScoreIndex,1);
                    snakesScore.splice(highestScoreIndex,1);
                }
                bestSnakeScore = Math.max(...snakesScore)


                // recreate 10
                for (let i = 0; i < 10; i++) {
                    snakes.push(bestSnake[i]);
                }

                // mutate
                for (let i = 0; i < 10; i++) {
                    for (let j = 0; j < 94 - (6 * i); j++) {
                        mutateSnake(bestSnake[i])
                    }
                }

                // cross breed
                for (let i = 1; i < 11; i++) {
                    for (let j = 1; j < i; j++) {
                        for (let k = 0; k < (i*j); k++) {
                            breedSnake(bestSnake[10 - i],bestSnake[10 - j], (1 / ((i * j) + 1)) * (k + 1))
                        }
                    }
                }


//////////////////////////////////////////////////////////////////////////////////////// reset vars //////////////////////////////////////////////////////////////////////////////
                generation++;
                batch = 0;
                snakesLeft = 50;
                snakeNumber = 1;
                snakesScore = [];
                for (let i = 0; i < genSize; i++) {
                    snakesScore.push(averageFitness[generation - 2])
                }
                let string = ""
                for (let i = averageFitness.length - 1; i > -1; i--) {
                    string += averageFitness[i]
                    string += ", "
                }
                document.getElementById("average").textContent = "average fitness:  " + string
            }

            document.getElementById("generation").textContent = "generation: " + generation
            document.getElementById("snakeNumber").textContent = "snakes Left: " + snakesLeft      
            document.getElementById("group").textContent = "group: " + (batch + 1)


        }
        }     
    }    
};



// start the game
requestAnimationFrame(loop);

document.getElementById("minusShowing").addEventListener("click", () => {
    if (canShow > 0) {
        canShow--;
    }
    document.getElementById("snakesShowing").textContent = "snakes showing: " + canShow;
})

document.getElementById("plusShowing").addEventListener("click", () => {
    if (canShow < batchSize) {
        canShow++;
    }
    document.getElementById("snakesShowing").textContent = "snakes showing: " + canShow;
})


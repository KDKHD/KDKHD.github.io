function PathFinderSetup(){
    //creates the grid
    this.createGrid = function createGrid(){
        var w = document.querySelector('.pathFindingArea').offsetWidth;
        var h = document.querySelector('.pathFindingArea').offsetHeight;
        for(var y = 0; y < (h/25)-3; y ++){
            var newRow = document.createElement("tr");
            newRow.className = "row" 
            newRow.id = y
            for(var x = 0; x < (w/25)-3; x ++){
                var newCol = document.createElement("td"); 
                newCol.className = "col" 
                newCol.id = x
                var square = document.createElement("div"); 
                square.className = "square"
                newCol.appendChild(square)
                newRow.appendChild(newCol)
            }
            document.querySelector(".grid").appendChild(newRow);
        }

    }

    //returns array of wall coords
    this.getWallCoords = function getWallCoords(){
        walls = document.querySelectorAll('.wall')
        coordlist = []
        for(i = 0; i < walls.length; i ++){
            coordlist.push(this.getCoorinates(walls[i].parentElement))
        }
        return coordlist
    }

    //returns start coords
    this.getStartCoords = function getStartCoords(){
        return this.getCoorinates(document.querySelector('.start').parentElement)
    }
    //returns end coords
    this.getEndCoords = function getEndCoords(){
        return this.getCoorinates(document.querySelector('.end').parentElement)
    }

    //returns grid coordinates 
    this.getGridCoords = function getGridCoords(){
        squares = document.querySelectorAll('.square')
        coordlist = []
        for(i = 0 ; i < squares.length; i ++){
            coordlist.push(this.getCoorinates(squares[i].parentElement))
        }
        return coordlist
    }

    //returns item coords
    this.getCoorinates = function getCoorinates(square){
        row = square.parentElement.id
        col = square.id
        return [+col,-row]
    }

    //generates random start and end location
    this.randomStart = function randomStart(){
        // document.querySelectorAll('.square')[Math.floor(Math.random() * document.querySelectorAll('.square').length)].classList.add("start")
        // document.querySelectorAll('.square')[Math.floor(Math.random() * document.querySelectorAll('.square').length)].classList.add("end")
        document.querySelectorAll('.square')[(document.querySelectorAll('.square').length/2)-5].classList.add("end")
        document.querySelectorAll('.square')[(document.querySelectorAll('.square').length/2)+5].classList.add("start")
    }

    this.eventListeners = function eventListeners(){
        //mousedown
        var mouseDown = 0;
        document.body.onmousedown = function() { 
            ++mouseDown;
        }
        document.body.onmouseup = function() {
            --mouseDown;
        }

        //wall drawing
        isDrawing = false
        pickupStart=false
        pickupEnd = false
        document.querySelectorAll('.square:not(.start):not(.end)').forEach(item => {
            item.addEventListener('mousedown', e => {
                isDrawing = true
            });
        })

        document.querySelectorAll('.start').forEach(item => {
            item.addEventListener('mousedown', e => {
                pickupStart=true
            });
        })

        document.querySelectorAll('.end').forEach(item => {
            item.addEventListener('mousedown', e => {
                pickupEnd=true
            });
        })

        

        document.querySelectorAll('.square').forEach(item => {
            item.addEventListener('mousemove', e => {
                x = item.parentElement.id
                y = item.parentElement.parentElement.id
                if (isDrawing === true) {
                    this.makeWall(item)
                }
                else if (pickupStart === true) {
                    starts = document.querySelectorAll(".start")
                    for(p = 0; p < starts.length;p++){
                        tempElement = starts[p]
                        tempX = tempElement.parentElement.id
                        tempY = tempElement.parentElement.parentElement.id
                        if(tempX!=x || tempY!=y){
                            tempElement.classList.remove("start");
                        }
                    }
                    
                        item.classList.add("start")
                }
                else if (pickupEnd === true) {
                    ends = document.querySelectorAll(".end")
                    for(p = 0; p < ends.length;p++){
                        tempElement = ends[p]
                        tempX = tempElement.parentElement.id
                        tempY = tempElement.parentElement.parentElement.id
                        if(tempX!=x || tempY!=y){
                            tempElement.classList.remove("end");
                        }
                    }
                    
                        item.classList.add("end")
                }
        });
        })

        document.querySelectorAll('.grid').forEach(item => {
            item.addEventListener('mouseup', e => {
            if (isDrawing === true) {
            isDrawing = false;
            }
            if (pickupStart === true) {
                pickupStart = false;
                }
            if (pickupEnd === true) {
                pickupEnd = false;
                }

        });
        })
    }

    this.clear = function clear(){
        trElements = document.querySelectorAll("tr")
        for(x = 0; x < trElements.length; x ++){
            trElements[x].remove()
        }

    }

    this.makeWall = function makeWall(item){
        if(!(item.classList.contains("start") || item.classList.contains("end"))){
             item.classList.add("wall")
         }
    }
}


gridGlobal = null
function start(){
    const grid = new PathFinderSetup()
    grid.clear()
    grid.createGrid()
    grid.randomStart()
    grid.eventListeners() 
    gridGlobal = grid
    return grid
}

function alg(){
    const aStarAlgorithm = new a_Star(gridGlobal)
    aStarAlgorithm.start()
}



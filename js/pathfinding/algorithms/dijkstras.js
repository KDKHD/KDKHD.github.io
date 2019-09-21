//Dijkstra's algorithm

function dijkstraAlg(grid){
    visited = []
    weights = {}
    this.start = function start(){
        this.gridCoords = grid.getGridCoords()
        this.wallCoords = grid.getWallCoords()
        this.startCoords = grid.getStartCoords()
        this.endCoords = grid.getEndCoords()
        this.calculateCostSurrounding(this.startCoords,0)
        key = String(this.startCoords[0]+","+this.startCoords[1])
        visited.push(key)
        weights[key] = {'weight':0, 'prev':this.startCoords}
        this.startSearch()


    }

    this.startSearch = function startSearch(){
        var that = this;
        let interval = setInterval(function(){
            if(visited.includes(String(that.endCoords[0]+","+that.endCoords[1]))){
                clearInterval(interval)
                console.log(weights)
                console.log("end found")
                for(element in weights){
                    startFound = false
                    key = String(that.endCoords[0]+","+that.endCoords[1])
                    prev = weights[key].prev
                    while(!startFound){
                        document.querySelector('.row[id="'+Math.abs(prev[1])+'"] .col[id="'+prev[0]+'"]').classList.add("path")
                        key = String(prev[0]+","+prev[1])
                        prev = weights[key].prev
                        if(prev[0]==that.startCoords[0] && prev[1]==that.startCoords[1]){
                            startFound = true
                            return
                        }
                    }
                    element = element.split(",").map(Number)
                    document.querySelector('.row[id="'+Math.abs(element[1])+'"] .col[id="'+Math.abs(element[0])+'"]').childNodes[0].innerHTML = "<h6 style='color:red; float:left'>"+~~(weights[element].weight*10)+"</h6>"
                }
            }
            lowestWeightKey = that.getLowestWeight()
            if(lowestWeightKey == null){
                alert("no path")
                clearInterval(interval)
                return
            }
            that.calculateCostSurrounding(lowestWeightKey.split(",").map(Number),weights[lowestWeightKey].weight)
        }, 10)

    }
    


    this.itemToCoordString = function itemToCoordString(item){
        x = item.parentElement.id
        y = item.parentElement.parentElement.id
        return String(x+","+y)
    }

    this.itemToCoordArr = function itemToCoordArr(item){
        x = item.parentElement.id
        y = item.parentElement.parentElement.id
        return [x,y]
    }

    this.calculateDistance = function (start,end){
        x_offset = start[0] - end[0]
        y_offset = start[1] - end[1]    
        distance = Math.sqrt(Math.pow(x_offset, 2) + Math.pow(y_offset, 2))
        return distance;
    }

    //Calculate the cost of surrounding squares (not walls)
    this.calculateCostSurrounding = function calculateCostSurrounding(squareCoord,distancePrev){
        adjacent = []
        for(y = squareCoord[1]-1; y < squareCoord[1]+2; y ++){
            for(x = squareCoord[0]-1; x < squareCoord[0]+2; x ++){
                if(!((x == squareCoord[0] && y == squareCoord[1]) || (x < 0 || y > 0) || (x > parseInt(document.querySelector('.row[id="0"] td:last-child').id) || y < -1*(parseInt(document.querySelector('.grid tr:last-child').id))  ))){
                    adjacent.push([x,y])
                }
            }
        }
        difference = this.arrDiff(adjacent, this.wallCoords,squareCoord)
        for(element in difference){
            this.calculateWeight(difference[element],squareCoord,distancePrev)
            document.querySelector('.row[id="'+Math.abs(difference[element][1])+'"] .col[id="'+difference[element][0]+'"]').classList.add("visisted")
        }
    }

    this.calculateWeight = function calculateWeight(element,squareCoord,distancePrev){
        distance = this.calculateDistance(squareCoord,element)
        totalDistance = distance + distancePrev
        key = String(element[0]+","+element[1])

        tempDistance = weights[key]
        if(tempDistance == null){
            weights[key] = {'weight':totalDistance, 'prev':squareCoord}
        }
        else{
            tempDistance = weights[key].weight
            if(totalDistance < tempDistance){
                weights[key] = {'weight':totalDistance, 'prev':squareCoord}
            }
        }
    }

    this.getLowestWeight = function getLowestWeight(){
        lowestKey = null
        lowestWeight =  null
        for(key in weights){
            if(!visited.includes(key)){
                tempElement = weights[key]
                if(lowestWeight == null || tempElement.weight < lowestWeight){
                    lowestKey = key
                    lowestWeight = tempElement.weight
                }
            }
        }
        visited.push(lowestKey)
        if(lowestKey == null){
            return null
        }
        tempElement = lowestKey.split(",").map(Number)
        document.querySelector('.row[id="'+Math.abs(tempElement[1])+'"] .col[id="'+tempElement[0]+'"]').classList.add("closed")
        return lowestKey
    }

    //filter out walls from the surrounding nodes
    this.arrDiff = function arrDiff(arr1, arr2, origin){
        arr1temp = []
        arr2temp = []
        for(i = 0; i < arr1.length; i ++){
            arr1temp.push(String(arr1[i]))
        }
        for(i = 0; i < arr2.length; i ++){
            arr2temp.push(String(arr2[i]))
        }
        for(square in arr1temp){
            tempSquare = arr1temp[square].split(",").map(Number)
            x = tempSquare[0]
            y = tempSquare[1]
            //Handle diagonals (Algorithm can not search through diagonal walls)
            if (x > origin[0]){
                //down
                if(y>origin[1]){
                    //left
                    if(arr2temp.includes(String([origin[0],origin[1]-1])) && arr2temp.includes(String([origin[0]-1,origin[1]]))){
                        wall = String([origin[0]-1,origin[1]-1])
                        arr2temp.push(wall)
                    }
                }
                else if(y < origin[1]){
                    //right
                    if(arr2temp.includes(String([origin[0],origin[1]-1])) && arr2temp.includes(String([origin[0]+1,origin[1]]))){
                        wall = String([origin[0]+1,origin[1]-1])
                        arr2temp.push(wall)
                    }
                }
            }
            else if(x < origin[0]){
                //up
                if(y>origin[1]){
                    //left
                    if(arr2temp.includes(String([origin[0],origin[1]+1])) && arr2temp.includes(String([origin[0]-1,origin[1]]))){
                        wall = String([origin[0]-1,origin[1]+1])
                        arr2temp.push(wall)
                    }
                }
                else if(y<origin[1]){
                    //right
                    if(arr2temp.includes(String([origin[0],origin[1]+1])) && arr2temp.includes(String([origin[0]+1,origin[1]]))){
                        wall = String([origin[0]+1,origin[1]+1])
                        arr2temp.push(wall)
                    }
                }
            }
        }
        difference = arr1temp.filter(x => !arr2temp.includes(x));
        toreturnarr = []
        for(i = 0; i < difference.length; i ++){
            toreturnarr.push(difference[i].split(",").map(Number))
        }
        return toreturnarr
    }

}
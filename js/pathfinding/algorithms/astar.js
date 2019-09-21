//A* algorithm implementation
//Gcost - distamce from start node
//Hcost - distance from end node
//Fcost = Gcost + Fcost

//Object implementation of A* algorithm
//A* is relativly efficient and accurate

function aStarAlg(grid){
    costs = {}
    this.start = function start(){
        endFound = false
        this.gridCoords = grid.getGridCoords()
        this.wallCoords = grid.getWallCoords()
        this.startCoords = grid.getStartCoords()
        this.endCoords = grid.getEndCoords()
        this.calculateCostSurrounding(this.startCoords,0)
        counter = 0;
        this.startSearch()
    }

    //start the search algorithm
    this.startSearch = function startSearch(){
        var that = this;
        let interval = setInterval(function(){
            [lowest,Gcosttemp] = that.findLowestFcost()
            if(lowest==null){
                clearInterval(interval)
                alert("No path")
                return
            }
            if(that.endCoords[0] == lowest[0] && that.endCoords[1] == lowest[1]){
                clearInterval(interval)
                endFound = true
                startFound = false
                prev = costs[that.endCoords].origin
                while(!startFound){
                    if(prev == that.startCoords){
                        startFound = true
                        
                    }
                    document.querySelector('.row[id="'+Math.abs(prev[1])+'"] .col[id="'+Math.abs(prev[0])+'"]').classList.add("path") 
                    prev = costs[prev].origin
                    //Uncomment to see algorithm scores
                    //   for(element in costs){
                    //       element = element.split(",").map(Number)
                    //       document.querySelector('.row[id="'+Math.abs(element[1])+'"] .col[id="'+Math.abs(element[0])+'"]').childNodes[0].innerHTML = "<h6 style='color:red; float:left'>"+~~costs[element].Gcost+"</h6><h6 style='color:green ; float:right'>"+~~costs[element].Hcost+"</h6><h6 style='color:blue ;'>"+~~costs[element].Fcost+"</h6>"
                    //   }
                } 
                return

            }
            else{
                that.calculateCostSurrounding(lowest,Gcosttemp)
            }
        }, 10)
    }

    //return the coordinates of the square with the lowest Fcost
    this.findLowestFcost = function findLowestFcost(){
        lowestCoord = null
        lowestFcost = null
        lowestHcost = null
        Gcosttemp = null
        for(coord in costs){
            if(costs[coord].closed == null){
                lowestCoord =  coord
                lowestFcost = costs[coord].Fcost
                lowestHcost = costs[coord].Hcost
                Gcosttemp = costs[coord].Gcost
                break
            }  
        }
        for(coord in costs){
            tempCoord = costs[coord]
            tempFcost = tempCoord.Fcost
            tempHcost = tempCoord.Hcost
            tempGcost = tempCoord.Gcost
                if(tempFcost < lowestFcost && tempCoord.closed == null){
                    lowestFcost = tempFcost
                    lowestHcost = tempHcost
                    Gcosttemp = tempGcost
                    lowestCoord = coord
                } 
                else if (tempFcost == lowestFcost && tempCoord.closed == null){
                    if(tempHcost<lowestHcost){
                        //if there are multiple elements with the same Fcost, select the one closest
                        //to the end node
                        lowestFcost = tempFcost
                        lowestHcost = tempHcost
                        lowestCoord = coord
                        Gcosttemp = tempGcost
                    }
                }
        }
        if(lowestCoord==null){
            //all elements are closed and there is no path
            return [null,null]
        }
        squareCoord = lowestCoord.split(",").map(Number)
        costs[squareCoord].closed = true
        document.querySelector('.row[id="'+Math.abs(squareCoord[1])+'"] .col[id="'+squareCoord[0]+'"]').classList.add("closed")
        return [lowestCoord.split(",").map(Number),Gcosttemp];
    }

    //claculate distanc between coordinates
    this.calculateDistance = function (start,end){
        x_offset = start[0] - end[0]
        y_offset = start[1] - end[1]    
        distance = Math.sqrt(Math.pow(x_offset, 2) + Math.pow(y_offset, 2))
        return distance;
    }

    //calculate the costs involved in the A* algorithm
    this.calculateCosts = function calculateCosts(squareCoord, origin, Gcosttemp){
        Gcost = Gcosttemp+this.calculateDistance(origin,squareCoord)
        Hcost = this.calculateDistance(squareCoord, this.endCoords)
        Fcost = Gcost + Hcost
        if (costs[squareCoord] == null){
            costs[squareCoord] = {}
        }
        if (costs[squareCoord].Fcost == null){
            costs[squareCoord].Gcost = Math.abs(Gcost)
            costs[squareCoord].Hcost = Math.abs(Hcost)
            costs[squareCoord].Fcost = Math.abs(Fcost)
            costs[squareCoord].origin = origin
        }
        else if (Fcost < costs[squareCoord].Fcost){
            //if a better Fcoast is found, update the values
            costs[squareCoord].Gcost = Math.abs(Gcost)
            costs[squareCoord].Hcost = Math.abs(Hcost)
            costs[squareCoord].Fcost = Math.abs(Fcost)
            costs[squareCoord].origin = origin
        }
        document.querySelector('.row[id="'+Math.abs(squareCoord[1])+'"] .col[id="'+squareCoord[0]+'"]').classList.add("visisted")    
        return costs[squareCoord]
    }

    //Calculate the cost of surrounding squares (not walls)
    this.calculateCostSurrounding = function calculateCostSurrounding(squareCoord,Gcosttemp){
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
            this.calculateCosts(difference[element],squareCoord,Gcosttemp)
        }
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

    //return true if square is wall. Else false
    this.checkIfWall = function checkIfWall(coord){
        isWall = false
        for(wall in this.wallCoords)
            if(this.wallCoords[wall][0] == coord[0] && this.wallCoords[wall][1] == coord[1]){
                isWall = true
                return true;
            }
        return isWall

    }
  
}
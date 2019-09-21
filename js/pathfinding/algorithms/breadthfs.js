function breadthFirstSearch(grid){
    var open = []
    var closed = []
    var weights = {}

    this.start = function start(){
        this.gridCoords = grid.getGridCoords()
        this.wallCoords = grid.getWallCoords()
        this.startCoords = grid.getStartCoords()
        this.endCoords = grid.getEndCoords()
        tempNode = {'coord':this.startCoords,'weight':0}
        open.push(tempNode)
        this.startSearch()
        

    }

    this.startSearch = function startSearch(){
        var that = this
        let interval = setInterval(function(){
            if(that.checkIncludesArr(closed,{'coord':that.endCoords,'weight':9999})){
                clearInterval(interval)
                tempNode = open[0]
                that.calculateCostSurrounding(tempNode)
                console.log("end found")
                //backtrace
                startFound = false
                prev = that.endCoords
                while(!startFound){
                    
                    prevElement = that.findPrev(prev)
                    document.querySelector('.row[id="'+Math.abs(prevElement[1])+'"] .col[id="'+prevElement[0]+'"]').classList.add("path")
                    prev = prevElement
                    if(prev[0] == that.startCoords[0] && prev[1] == that.startCoords[1]){
                        startFound = true
                    }

                }
                return
            }
            tempNode = open[0]
            open.splice(0, 1); 
            includeVar = that.checkIncludesArr(closed,tempNode)
            if(includeVar == null){
                alert("no path")
                clearInterval(interval)

            }
            if(!includeVar){
                closed.push(tempNode)
                document.querySelector('.row[id="'+Math.abs(tempNode['coord'][1])+'"] .col[id="'+tempNode['coord'][0]+'"]').classList.add("closed")

            }
            that.calculateCostSurrounding(tempNode)

        }, 10)
    }

    this.findPrev = function findPrev(prev){
        for(element in closed){
            tempElement = closed[element]
            tempCoord = tempElement['coord']
            if(tempCoord[0]==prev[0]&&tempCoord[1]==prev[1]){
                return tempElement['prev']
            }
        }
        return null

    }

    this.sortOpen = function sortOpen(){
        //open = this.mergeSort(open)
        open = open
    }

    this.mergeSort = function mergeSort (unsortedArray) {
        // No need to sort the array if the array only has one element or empty
        if (unsortedArray.length <= 1) {
          return unsortedArray;
        }
        // In order to divide the array in half, we need to figure out the middle
        const middle = Math.floor(unsortedArray.length / 2);
      
        // This is where we will be dividing the array into left and right
        const left = unsortedArray.slice(0, middle);
        const right = unsortedArray.slice(middle);
      
        // Using recursion to combine the left and right
        return this.merge(
          this.mergeSort(left), this.mergeSort(right)
        );
      }

      this.merge = function merge (left, right) {
        let resultArray = [], leftIndex = 0, rightIndex = 0;
      
        // We will concatenate values into the resultArray in order
        while (leftIndex < left.length && rightIndex < right.length) {
          if (left[leftIndex]['weight'] < right[rightIndex]['weight']) {
            resultArray.push(left[leftIndex]);
            leftIndex++; // move left array cursor
          } else {
            resultArray.push(right[rightIndex]);
            rightIndex++; // move right array cursor
          }
        }
      
        // We need to concat here because there will be one element remaining
        // from either left OR the right
        return resultArray
                .concat(left.slice(leftIndex))
                .concat(right.slice(rightIndex));
      }

      this.calculateDistance = function (start,end){
        x_offset = start[0] - end[0]
        y_offset = start[1] - end[1]    
        distance = Math.sqrt(Math.pow(x_offset, 2) + Math.pow(y_offset, 2))
        return distance;
    }

    this.calculateCostSurrounding = function calculateCostSurrounding(squareCoord){
        adjacent = []
        for(y = squareCoord['coord'][1]-1; y < squareCoord['coord'][1]+2; y ++){
            for(x = squareCoord['coord'][0]-1; x < squareCoord['coord'][0]+2; x ++){
                if(!((x == squareCoord['coord'][0] && y == squareCoord['coord'][1]) || (x < 0 || y > 0) || (x > parseInt(document.querySelector('.row[id="0"] td:last-child').id) || y < -1*(parseInt(document.querySelector('.grid tr:last-child').id))  ))){
                    adjacent.push([x,y])
                }
            }
        }
        difference = this.arrDiff(adjacent, this.wallCoords,squareCoord['coord'])
        for(element in difference){
            this.calculateWeight(difference[element],squareCoord['coord'])
            document.querySelector('.row[id="'+Math.abs(difference[element][1])+'"] .col[id="'+difference[element][0]+'"]').classList.add("visisted")
        }
        this.sortOpen()
    }

    this.calculateWeight = function calculateWeight(element,squareCoord){
        //distance = this.calculateDistance(element,squareCoord) //bfs
        //distance = this.calculateDistance(this.endCoords,element) //greedy bfs
        distance = 0
        tempNode = {'coord':element,'weight':distance,'prev':squareCoord}
        if(!this.checkIncludesArr(open,tempNode) && !this.checkIncludesArr(closed,tempNode)){
            open.push(tempNode)
        }
    }

    this.checkIncludesArr = function includes(arr,element){
        if(element == null){
            return null
        }
        coord = element['coord']
        weight = element['weight']
        found = false
        for(item in arr){
            tempitem = arr[item]
            if(tempitem['coord'][0]==coord[0] && tempitem['coord'][1]==coord[1] ){
                return true
            }
        }
        return false
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
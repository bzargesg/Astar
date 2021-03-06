function removeFromArray(arr, el){
    for(var i = arr.length-1; i >= 0; i--){
        if(arr[i] == el){
            arr.splice(i, 1);
        }
    }
}
function heuristic(a, b){
    var d = dist(a.i,a.j,b.i,b.j);
    // var d = abs(a.i-b.i) + abs(a.j-b.j);
    return d;
}

var cols = 25;
var rows = 25;
var grid = new Array(cols);

var openSet = [];
var closedSet = [];
var start;
var end;
var w, h ;
var path = [];

function Spot(i, j) {
    this.i = i;
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.wall = false;

    if(random(1) < .2){
        this.wall = true;
    }

    this.neighbors = [];
    this.previous = undefined;
    this.show = function(col) {
        col = this.wall ? color(122,122,122) : col;
        fill(col);
        noStroke();
        rect(this.i * w, this.j * h, w-1, h-1);
    }
    this.addNeighbors = function(grid){
        if(this.i < cols-1){
            this.neighbors.push(grid[this.i+1][this.j]);
        }
        if(this.i > 0){
            this.neighbors.push(grid[this.i-1][this.j]);
        }
        if(this.j < rows-1){
            this.neighbors.push(grid[this.i][this.j+1]);
        }
        if(this.j > 0){
            this.neighbors.push(grid[this.i][this.j-1]);
        }

        if(this.i > 0 && this.j > 0){
            this.neighbors.push(grid[this.i-1][this.j-1]);
        }
        if(this.i < cols-1 && j > 0){
            this.neighbors.push(grid[this.i+1][this.j-1]);
        }
        if(this.i > 0 && this.j < rows - 1){
            this.neighbors.push(grid[this.i-1][this.j+1]);
        }
        if(this.j < rows-1 && this.i < cols - 1){
            this.neighbors.push(grid[this.i+1][this.j+1]);
        }
    }
}

function setup() {
    createCanvas(400,400);

    w = width / cols;
    h = height / rows;
    for(var i = 0; i < cols; i++){
        grid[i] = new Array(rows);
    }
    for(var i = 0; i < cols; i++){
        for (var j = 0; j < rows; j++){
            grid[i][j] = new Spot(i,j);
        }    
    }
    for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
            grid[i][j].addNeighbors(grid);
        }
    }
    start = grid[0][0];
    end = grid[cols-1][rows-1];
    start.wall = false;
    end.wall = false;
    console.log(grid)
    openSet.push(start);
}



function draw(){
    if(openSet.length > 0){
        var lowestIndex = 0;
        for(var i = 0; i < openSet.length; i++){
            if(openSet[i].f < openSet[lowestIndex].f){
                lowestIndex = i;
            }
        }
        var current = openSet[lowestIndex];
        if(current === end){
            noLoop();
            console.log("DONE");
        }

        removeFromArray(openSet,current);
        closedSet.push(current);
        var neighbors = current.neighbors;
        for(var i = 0;i < neighbors.length; i++){
            var neighbor = neighbors[i];
            if(!closedSet.includes(neighbor) && !neighbor.wall){
                var tempG = current.g + 1;
                if(openSet.includes(neighbor)){
                    if(tempG < neighbor.g){
                        neighbor.g= tempG;
                    }
                } else {
                    neighbor.g = tempG;
                    openSet.push(neighbor);
                }

                neighbor.h = heuristic(neighbor, end);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.previous = current;
            }
        }

    } else {
        console.log("no solution");
        noLoop();
        return;
        //no soln
    }
    background(0);
    for(var i = 0; i < cols; i++){
        for(var j = 0; j < rows; j++){
            grid[i][j].show(color(255));
        }
    }
    for(var i = 0; i < closedSet.length; i++){
        closedSet[i].show(color(255,0,0));
    }
    for(var i = 0; i < openSet.length; i++){
        openSet[i].show(color(0,255,0));
    }
    path = [];
    var temp = current;
    path.push(temp);
    while(temp.previous){
        path.push(temp.previous);
        temp = temp.previous;
    }
    for ( var i = 0; i < path.length ; i++){
        path[i].show(color(0,0,255));
    }

}


function generateMaze(w, h) {
  let m = [];
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      m.push({x, y, up: false, down: false, right: false, left: false});
    }
  }

  let visited = [];
  let visitedNeighbors = [];

  let startX = Math.floor(Math.random()*w);
  let startY = Math.floor(Math.random()*h);

  let currentCell = getCell(m, startX, startY);
  currentCell.start = true;

  let lastDir;

  while(visited.length != w*h) {
    let ns = getNeighbors(m, currentCell);
    let nextCell;

    let cs = whichCellsNotVisited(Object.values(ns), visited);

    if (cs.length > 0) {
      let cellNeighbors = combineArrsToObj(ns, cs);
      let dir = getRandomDirection(cellNeighbors, lastDir);
      nextCell = cellNeighbors[dir];
      lastDir = dir;
      m = cutWalls(m, currentCell, nextCell, dir);
      visited.push(currentCell);
      currentCell = nextCell;
    } else {
      visitedNeighbors = getVisitedNeighbors(visited, m);
      let randNum = Math.floor(Math.random()*(visitedNeighbors.length));
      currentCell = visitedNeighbors[randNum];
    }
  }
  currentCell.end = true;
  return [m, {x: startX, y: startY}, {x: currentCell.x, y: currentCell.y}]
}

function getRandomDirection(ns, lastDir) {
  let dirs = Object.keys(ns);
  if (dirs.length == 1) return dirs[0];

  let newDir = lastDir
  do {
    let n = Math.floor(Math.random()*(dirs.length));
    newDir = dirs[n];
  } while (newDir == lastDir)
  return newDir;
}

function combineArrsToObj(obj, vals) {
  let newobj = {};
  for (let i in obj) {
    if (vals.includes(obj[i])) newobj[i] = obj[i];
  }
  return newobj;
}

function getKey(ns, cell) {
  for (let i in ns) {
    if (ns[i] == cell) return i;
  }
  return null;
}

let dirs = ["up", "down", "right", "left"];
function cutWalls(m, cell, newcell, dir) {
  let newCell = cell;
  newCell[dir] = true;

  let newNewCell = newcell;
  newNewCell[oppositeDir(dir)] = true;

  let newM = m;
  newM[m.indexOf(cell)] = newCell;
  newM[m.indexOf(newcell)] = newNewCell;

  return newM;
}

function oppositeDir(dir) {
  if (dir == "up") {
    return "down"
  }
  if (dir == "down") {
    return "up"
  }
  if (dir == "left") {
    return "right"
  }
  if (dir == "right") {
    return "left"
  }
}

function getVisitedNeighbors(visited, m) {
  let unvisited = getUnvisited(visited, m);
  let visitedNeighbors = [];
  for (let cell of unvisited) {
    let ns = getNeighbors(m, cell);
    for (let i of Object.values(ns)) {
      if (!visitedNeighbors.includes(i)) visitedNeighbors.push(i);
    }
  }
  return visitedNeighbors;
}

function getUnvisited(visited, m) {
  return m.filter(obj => {
    return isVisited(visited, obj.x, obj.y);
  });
}

function whichCellsNotVisited(ns, visited) {
  let cells = [];
  ns.forEach(obj => {
    if (!isVisited(visited, obj.x, obj.y)) cells.push(obj);
  })
  return cells;
}

function getNeighbors(maze, cell) {
  let neighbors = {};
  let left = getCell(maze, cell.x-1, cell.y);
  if (left != null) neighbors = {...neighbors, left};
  let right = getCell(maze, cell.x+1, cell.y);
  if (right != null) neighbors = {...neighbors, right};
  let up = getCell(maze, cell.x, cell.y-1);
  if (up != null) neighbors = {...neighbors, up};
  let down = getCell(maze, cell.x, cell.y+1);
  if (down != null) neighbors = {...neighbors, down};
  return neighbors;
}

function isVisited(vs, x, y) {
  var cell = vs.find(obj => {
    return obj.x == x && obj.y == y
  });
  return cell != null;
}

function getCell(maze, x, y) {
  var cell = maze.find(obj => {
    return obj.x == x && obj.y == y
  });
  return cell;
}

function drawMaze(maze, w, h) {
  for (let i of maze) {
    let x = i.x;
    let y = i.y;

    if (!i.up) {
      line(x*width/w, y*height/h, (x+1)*width/w, y*height/h);
    }
    if (!i.down) {
      line(x*width/w, (y+1)*height/h, (x+1)*width/w, (y+1)*height/h);
    }
    if (!i.right) {
      line((x+1)*width/w, y*height/h, (x+1)*width/w, (y+1)*height/h);
    }
    if (!i.left) {
      line(x*width/w, y*height/h, x*width/w, (y+1)*height/h);
    }
    if (i.start) {
      push();
      noStroke();
      fill("green");
      rect(x*width/w, y*height/h, width/w, height/h);
      pop();
    }
    if (i.end) {
      push();
      noStroke();
      fill("red");
      rect(x*width/w, y*height/h, width/w, height/h);
      pop();
    }
  }
}

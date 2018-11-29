var maze;
var mazeW = 20,
    mazeH = 20;
var startPos, endPos;

function setup() {
  createCanvas(500, 500);
  [maze, startPos, endPos] = generateMaze(mazeW, mazeH);
}

function draw() {
  background(200);

  drawMaze(maze, mazeW, mazeH);
}

function aStar() {
  let startCell = getCell(startPos.x, startPos.y);
  let endCell = getCell(endPos.x, endPos.y);

  let currentCell = startCell;

  let null_set = maze;
  let closed_set = [];
  let opened_set = []

  let working = true
  while (working) {
    closed_set.push(currentCell);
    opened_set.splice(closed_set.indexOf(currentCell), 1);
    let currPos = {x: currentCell.x, y: currentCell.y};
    let neighbors = possibleDirs(maze, currentCell);

    for (let neighbor in neighbors) {
      let cell = neighbors[neighbor];
      null_set.splice(null_set.indexOf(cell), 1);

      let pos = {x: cell.x, y: cell.y};
      let gcost = dist(startCell.x, startCell.x, pos.x, pos.y);
      let hcost = dist(endCell.x, endCell.y, pos.x, pos.y);
      let fcost = gcost + hcost;

      opened_set.push([cell, {
        gcost, hcost, fcost
      }]);
    }

    let nextCell = getNextCell(opened_set);
  }
}

function getNextCell(opened_set) {
  let least_fcost
  for (let c of opened_set) {
    let stats = c[1];
    if (stats.fcost < least_fcost[1].fcost) {
      least_fcost = c;
    } else if (stats.fcost == least_fcost[1].fcost) {
      if (stats.hcost <= least_fcost[1].hcost) {
        least_fcost = c;
      }
    }
  }
  return least_fcost;
}

function removeCell(opened_set, cell) {
  let new_set = opened_set
  for (let c of new_set) {
    if (c[0] == cell) {
      new_set.splice(new_set.indexOf(c), 1)
      break;
    }
  }
  console.error("couldn't remove cell")
  return new_set;
}

function possibleDirs(maze, cell) {
  let neighbors = {};
  let left = getCell(maze, cell.x-1, cell.y);
  if (left != null) {
    if (!left.right && !cell.right) {
      neighbors = {...neighbors, left};
    }
  }

  let right = getCell(maze, cell.x+1, cell.y);
  if (right != null) {
    if (!right.left && !cell.left) {
      neighbors = {...neighbors, right};
    }
  }

  let up = getCell(maze, cell.x, cell.y-1);
  if (up != null) {
    if (!up.down && !cell.up) {
      neighbors = {...neighbors, up};
    }
  }

  let down = getCell(maze, cell.x, cell.y+1);
  if (down != null) {
    if (!down.up && !cell.down) {
      neighbors = {...neighbors, down};
    }
  }

  return neighbors;
}

function Rules() {

  // Pieces
  this.S = 1;
  this.M = 2;
  this.K = 3;

  // Buildings
  this.E = 1;
  this.T = 2;

  this.SS = "Sweedes";
  this.MS = "Muscovites";

  this.turn = this.S;

  this.board = [
    [ ""     , ""     , ""     , this.M , this.M , this.M , ""     , ""     , ""     ],
    [ ""     , ""     , ""     , ""     , this.M , ""     , ""     , ""     , ""     ],
    [ ""     , ""     , ""     , ""     , this.S , ""     , ""     , ""     , ""     ],
    [ this.M , ""     , ""     , ""     , this.S , ""     , ""     , ""     , this.M ],
    [ this.M , this.M , this.S , this.S , this.K , this.S , this.S , this.M , this.M ],
    [ this.M , ""     , ""     , ""     , this.S , ""     , ""     , ""     , this.M ],
    [ ""     , ""     , ""     , ""     , this.S , ""     , ""     , ""     , ""     ],
    [ ""     , ""     , ""     , ""     , this.M , ""     , ""     , ""     , ""     ],
    [ ""     , ""     , ""     , this.M , this.M , this.M , ""     , ""     , ""     ]
  ];

  this.boardRowsLength = this.board.length;
  this.boardColumnsLength = this.board[0].length;

  this.buildings = {};

  var lastRowIndex = this.boardRowsLength - 1;
  var lastColumnIndex = this.boardColumnsLength - 1;

  // Throne
  this.buildings[lastRowIndex / 2] = {};
  this.buildings[lastColumnIndex / 2] = this.T;

  // Top Exits
  this.buildings[0] = {};
  this.buildings[0][0] = this.E;
  this.buildings[0][lastColumnIndex] = this.E;

  // Bottom Exits
  this.buildings[lastRowIndex] = {};
  this.buildings[lastRowIndex][0] = this.E;
  this.buildings[lastRowIndex][lastColumnIndex] = this.E;
};

Rules.prototype.getAvailableMoves = function(x, y) {
	
	if (x == null || y == null) {
		return false;
	}

	var position = {x: x, y: y};

  if (!this.checkBoundaries(position)) {
    return false;
  }

  var pieceAtCurrentPosition = this.board[position.y][position.x];
	if (!pieceAtCurrentPosition) {
		return false;
	}

	var moves = [];
  if (!this.getAvailableLineMoves('h', '+', moves)) return false;
  if (!this.getAvailableLineMoves('h', '-', moves)) return false;
  if (!this.getAvailableLineMoves('v', '+', moves)) return false;
  if (!this.getAvailableLineMoves('v', '-', moves)) return false;

	return moves;
};

Rules.prototype.commit = function(currentPosition, nextPosition) {

  if (this.won) {
    return {
      "won": this.won
    };
  }

  if (currentPosition == null || currentPosition.x == null || currentPosition.y == null ||
      nextPosition == null || nextPosition.x == null || nextPosition.y == null)
  {
    return false;
  }
     
  var deltaX = nextPosition.x - currentPosition.x;
  var deltaY = nextPosition.y - currentPosition.y;

  if (deltaX !== 0 && deltaY !== 0 || deltaX === 0 && deltaY === 0) {
    return false;
  }

  // Check if current position is valid
  if (!this.checkBoundaries(currentPosition)) {
    return false;
  }

  // Check if next position is valid
  if (!this.checkBoundaries(nextPosition)) {
    return false;
  }

  var pieceAtCurrentPosition = this.board[currentPosition.y][currentPosition.x];
  var pieceAtNextPosition = this.board[nextPosition.y][nextPosition.x];

  // Check if it is the turn of this piece
  if (!this.checkTurn) {
    return false;
  }

  var incX = 0;
  var incY = 0;
  
  if (deltaX > 0) {
    incX = 1;
  } else if (deltaX < 0) {
    incX = -1;
  }
  if (deltaY > 0) {
    incY = 1;
  } else if (deltaY < 0) {
    incY = -1;
  }

  // Pieces cannot move through others
  var posX = currentPosition.x; var posY = currentPosition.y;
  do {
    posX += incX;
    posY += incY;
    if (this.board[posY][posX]) {
      return false;
    }
  } while (posX !== nextPosition.x && posY !== nextPosition.y);

  var buildingsAtRow = this.buildings[nextPosition.y];

  if (buildingsAtRow) {

    // Only king can move to the throne or exit
    var building = buildingsAtRow[nextPosition.x];
    if (pieceAtCurrentPosition !== this.K && (building === this.T || building === this.E)) {
      return false;
    }

    // Sweedes Win
    if (pieceAtCurrentPosition === this.K && building === this.E) {
      this.turn = (this.turn == this.S) ? this.M : this.S;
      return {"won": this.SS};
    }
  }

  var deleted = [];
  if (!this.checkFlank("h", 1, deleted)) return false;
  if (!this.checkFlank("h", -1, deleted)) return false;
  if (!this.checkFlank("v", 1, deleted)) return false;
  if (!this.checkFlank("v", -1, deleted)) return false;

  this.turn = (this.turn == this.S) ? this.M : this.S;
  return {
    "won": this.won,
    "deleted": deleted
  };
};

// Private Methods

Rules.prototype.checkTurn = function(piece) {
	return (pieceAtCurrentPosition === this.turn) || (this.turn === this.S && pieceAtNextPosition === this.K);
};

Rules.prototype.isFriendly = function(piece) {
  return (piece === this.turn || (piece === this.K && this.turn === this.S));
};

Rules.prototype.existsPiece = function(position) {
  return (this.board[position.y][position.x]);
};

Rules.prototype.existsBuilding = function(position) {
  return (this.buildings[position.y] && this.buildings[position.y][position.x]);
};

Rules.prototype.existsPieceOrBuilding = function(position) {
	return (this.existsBuilding(position) || this.existsPiece(position));
};

Rules.prototype.checkBoundaries = function(position) {
if (position.x < 0 || position.x >= this.boardColumnsLength ||
		position.y < 0 || position.y >= this.boardRowsLength)
	{
		return false;
	};
return true;
}

Rules.prototype.checkFlank = function(line, forwardOrBackwards, deleted) {

  if ((forwardOrBackwards !== 1 && forwardOrBackwards !== -1) || deleted.constructor !== Array) {
    return false;
  }
  var inc1x = 0; var inc1y = 0;
  switch (line) {
    case "h":
        inc1x = forwardOrBackwards;
      break;
    case "v":
        inc1y = forwardOrBackwards;
      break;
    default:
      return false;
  }

  var adjacentPiece = this.board[nextPosition.y + inc1y][nextPosition.x + inc1x];
  if (adjacentPiece && !this.isFriendly(adjacentPiece)) {
    var inc2y = inc1y * 2; var inc2x = inc1x * 2;
    var afterAdjacentPiece = this.board[nextPosition.y + inc2y][nextPosition.x + inc2x];
    if (afterAdjacentPiece && (this.isFriendly(afterAdjacentPiece) || this.existsBuilding(afterAdjacentPiece))) {
      this.board[nextPosition.y + inc1y][nextPosition.x + inc1x] = "";
      deleted.push({x: nextPosition.x + inc1x, y: nextPosition.y + inc1y});
      if (adjacentPiece === this.K) {
        this.won = this.MS;
      }
    }
  }
  return true;
};

Rules.prototype.getAvailableLineMoves = function(position, line, side, moves) {
	if ((side !== '+' && side !== '-') || moves.constructor !== Array) {
		return false;
	}

	var incrementor = (side === '+') ? 1 : -1; 
	var inc1x = 0; var inc1y = 0;
	switch (line) {
		case "h":
				inc1x = incrementor;
			break;
		case "v":
				inc1y = incrementor;
			break;
		default:
			return false;
	}

	var pos = {x: position.x + inc1x, y: position.y + inc1y};
	
	while (this.checkBoundaries(pos) && !this.existsPieceOrBuilding(pos)) {		
		moves.push(pos);
		pos.x += incX;
		pos.y += incY;
	};

	return moves;
};
const boardRegions = document.querySelectorAll(".tilePart");
let vBoard = [];
let turnPlayer = "";

function updateTurnTitle() {
  const playerInput = document.getElementById(turnPlayer);
  document.getElementById("turnPlayer").innerText = playerInput.value;
}

//Inicia o jogo e habilita o botão de 'restart' no lugar do de 'começar'.
function initGame() {
  document.querySelector("#startBtn").classList.add('hide');
  document.querySelector("#restartBtn").classList.remove('hide');
  vBoard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  turnPlayer = "player1";
  document.querySelector("h2").innerHTML = 'Vez de: <span id="turnPlayer"></span>';
  updateTurnTitle();
  boardRegions.forEach(function (e) {
    e.style.cursor = "pointer";
    e.addEventListener("click", handleBoardClick);
  });
  document.getElementById("player1").disabled = true;
  document.getElementById("player2").disabled = true;
}

//Restart do jogo após ele ser iniciado apenas, habilitando o botão de 'começar'.
function restartGame(){
  document.querySelector("#startBtn").classList.remove('hide');
  document.querySelector("#restartBtn").classList.add('hide');
  document.querySelector("h2").innerHTML = 'Digitem seus nomes!';
  document.getElementById('player1').value = '';
  document.getElementById('player2').value = '';
  boardRegions.forEach(function (e) {
    e.style.cursor = "default";
    e.classList.remove("win");
    e.innerText = "";
    e.removeEventListener("click", handleBoardClick);
  });
  document.getElementById("player1").disabled = false;
  document.getElementById("player2").disabled = false;
}

// Verifica se existem três regiões iguais em sequência e devolve as regiões
function getWinRegions() {
  const winRegions = [];
  if (vBoard[0][0] && vBoard[0][0] === vBoard[0][1] && vBoard[0][0] === vBoard[0][2])
    winRegions.push("0.0", "0.1", "0.2");
  if (vBoard[1][0] && vBoard[1][0] === vBoard[1][1] && vBoard[1][0] === vBoard[1][2])
    winRegions.push("1.0", "1.1", "1.2");
  if (vBoard[2][0] && vBoard[2][0] === vBoard[2][1] && vBoard[2][0] === vBoard[2][2])
    winRegions.push("2.0", "2.1", "2.2");
  if (vBoard[0][0] && vBoard[0][0] === vBoard[1][0] && vBoard[0][0] === vBoard[2][0])
    winRegions.push("0.0", "1.0", "2.0");
  if (vBoard[0][1] && vBoard[0][1] === vBoard[1][1] && vBoard[0][1] === vBoard[2][1])
    winRegions.push("0.1", "1.1", "2.1");
  if (vBoard[0][2] && vBoard[0][2] === vBoard[1][2] &&vBoard[0][2] === vBoard[2][2])
    winRegions.push("0.2", "1.2", "2.2");
  if (vBoard[0][0] && vBoard[0][0] === vBoard[1][1] && vBoard[0][0] === vBoard[2][2])
    winRegions.push("0.0", "1.1", "2.2");
  if (vBoard[0][2] && vBoard[0][2] === vBoard[1][1] && vBoard[0][2] === vBoard[2][0])
    winRegions.push("0.2", "1.1", "2.0");
  return winRegions;
}

//Disabilita o tile após ser clicado uma vez
function disableRegion(e) {
  e.style.cursor = "not-allowed";
  e.removeEventListener("click", handleBoardClick);
}

//Função que trata da vitória e pinta os tiles.
function itsAWin(regions) {
  regions.forEach(function (region) {
    document.querySelector('[data-region="' + region + '"]').classList.add("win");
  });
  const player = document.getElementById(turnPlayer).value;
  document.querySelector("h2").innerHTML = player + " venceu!";
}

//Função dos eventos de cada click
function handleBoardClick(ev) {
  const tile = ev.currentTarget;
  const region = tile.dataset.region; //N.N
  const rowColumnPair = region.split("."); // ["N", "N"]
  const row = rowColumnPair[0];
  const column = rowColumnPair[1];

  if (turnPlayer === "player1") {
    tile.innerText = "X";
    vBoard[row][column] = "X";
  } else {
    tile.innerText = "O";
    vBoard[row][column] = "O";
  }
  //Limpa o console e faz print no mesmo do tabuleiro virtual.
  console.clear();
  console.table(vBoard);
  //Desabilita a região já preenchida.
  disableRegion(tile);
  //Verificação de Vitória
  const winRegions = getWinRegions();
  if (winRegions.length > 0) {
    itsAWin(winRegions);
    boardRegions.forEach(function (e) {
      e.removeEventListener("click", handleBoardClick);
      e.style.cursor = "default";
    });
  } else if (vBoard.flat().includes("")) {
    turnPlayer = turnPlayer === "player1" ? "player2" : "player1";
    updateTurnTitle();
  } else {
    document.querySelector("h2").innerHTML = "Empate!";
    boardRegions.forEach(function (e) {
      e.removeEventListener("click", handleBoardClick);
      e.style.cursor = "default";
    });
  }
}

document.getElementById("startBtn").addEventListener("click", initGame);
document.getElementById("restartBtn").addEventListener('click', restartGame);

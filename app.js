/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

const RESET_VALUE = 2;
const diceWrapper = document.querySelector('.dice-wrapper');
const diceElements = document.querySelectorAll('.dice');
const limitField = document.querySelector('#game-limit');
const btnRoll = document.querySelector('.btn-roll');
const btnHold = document.querySelector('.btn-hold');
const btnNew = document.querySelector('.btn-new');
const btnShowWinners = document.querySelector('.btn-show-winners');

let players = [];
let activePlayer = 0;
let current = 0;
let winnersData = JSON.parse(localStorage.getItem('winners')) || {};
let winnersList = Object.keys(winnersData) || [];

// PLAYERS DATA ENTRY
const player1Name = prompt('Пожалуйста, игрок №1, введите Ваше имя пользователя') || 'Игрок 1';
const player2Name = prompt('Пожалуйста, игрок №2, введите Ваше имя пользователя') || 'Игрок 2';

// OBJECT GAMER
const Gamer = function (name, score, id, isExists = true) {
  this.name = name;
  this.score = score;
  this.id = id;
  this.isExists = isExists;
};

Gamer.prototype.setName = function (newName) {
  this.name = newName;
};

Gamer.prototype.getScore = function () {
  return this.score;
};

Gamer.prototype.setScore = function (newScore) {
  this.score += newScore;
};

Gamer.prototype.resetScore = function () {
  this.score = 0;
};

const player1 = new Gamer(player1Name);
const player2 = new Gamer(player2Name);

players.push(player1);
players.push(player2);

// FUNCTIONS
const initGame = () => {
  current = 0;
  player1.resetScore(0);
  player2.resetScore(0);

  document.querySelector('#name-0').textContent = player1.name;
  document.querySelector('#name-1').textContent = player2.name;
  document.querySelector('#current-0').textContent = 0;
  document.querySelector('#current-1').textContent = 0;
  document.querySelector('#score-0').textContent = 0;
  document.querySelector('#score-1').textContent = 0;
  diceWrapper.style.display = 'none';
  limitField.value = '100';
};

const uniq = arr => arr.filter((item, index) => arr.indexOf(item) === index);

const generateId = name => {
  const currIndex = name.indexOf('-');

  if (currIndex < 0) {
    return `${name}-${new Date().valueOf()}`;
  } else {
    let currId = name.slice(currIndex + 1);
    return `${name.slice(0, currIndex)}-${new Date().valueOf()}`;
  }
};

const changePlayer = () => {
  current = 0;
  document.getElementById('current-' + activePlayer).textContent = 0;
  document.querySelector(`.player-${activePlayer}-panel`).classList.toggle('active');
  activePlayer = +!activePlayer;
  diceWrapper.style.display = 'none';
  document.querySelector(`.player-${activePlayer}-panel`).classList.toggle('active');
};

const getWinners = () => {
  const winnersListUI = document.querySelector('.winners-list');
  const winnersData = JSON.parse(localStorage.getItem('winners')) || {};
  const winners = Object.keys(winnersData).sort((a, b) => winnersData[b] - winnersData[a]);

  if (winnersListUI.childNodes.length) {
    [...winnersListUI.querySelectorAll('.winners-list__item')].forEach(item => item.remove());
  }

  winners.map(winner => {
    const winnersItem = document.createElement('li');
    winnersItem.classList.add('winners-list__item');
    winnersListUI.appendChild(winnersItem);
    const winnersName = document.createElement('h5');
    winnersName.classList.add('winners-list__name');
    winnersName.innerText = winner;
    winnersItem.appendChild(winnersName);
    const winnersScore = document.createElement('span');
    winnersScore.classList.add('winners-list__score');
    winnersScore.innerText = winnersData[winner];
    winnersItem.appendChild(winnersScore);
  });
};

initGame();

players.forEach(item => {
  if (winnersList.includes(item.name.toLowerCase())) {
    item.isExists = confirm(`Вы правда ${item.name}?`);
  }

  item.id = item.isExists ? item.name : generateId(item.name);
});

// EVENTS
btnRoll.addEventListener('click', function () {
  const LIMIT_VALUE = +(limitField.value) || 100;
  const diceValues = [];

  const dice = [...diceElements].reduce((sum, item) => {
    const diceCurr = Math.floor(Math.random() * 6) + 1;

    diceValues.push(diceCurr);
    item.src = `dice-${diceCurr}.png`;

    return sum + diceCurr;
  }, 0);

  diceWrapper.style.display = 'block';
  const RESET_CONDITION = diceValues.includes(RESET_VALUE) || diceValues.length !== uniq(diceValues).length;

  if (RESET_CONDITION) {
    changePlayer();
  } else {
    current += dice;
    document.getElementById('current-' + activePlayer).textContent = current;

    if (players[activePlayer].getScore() + current >= LIMIT_VALUE) {
      const winnerName = players[activePlayer].id.toLowerCase();

      winnersData[winnerName] = winnersData[winnerName] ? ++winnersData[winnerName] : 1;

      localStorage.setItem("winners", JSON.stringify(winnersData));
      alert(`${players[activePlayer].name} won!!!`);
      getWinners();
    }
  }
});

btnHold.addEventListener('click', function () {
  players[activePlayer].setScore(current);
  document.querySelector(`#score-${activePlayer}`).textContent = players[activePlayer].getScore();
  changePlayer();
});

btnNew.addEventListener('click', function () {
  initGame();
});

btnShowWinners.addEventListener('click', function () {
  const winnersWrap = document.querySelector('.winners');
  const winnersListUI = document.querySelector('.winners-list');
  winnersWrap.classList.toggle('hidden');

  if (!winnersListUI.childNodes.length) {
    getWinners();
  }
});

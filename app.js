/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

const Gamer = function (name, score) {
  this.name = name;
  this.score = score;
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

const RESET_VALUE = 2;
let gamers = [];
let activePlayer = 0;
let current = 0;
const diceWrapper = document.querySelector('.dice-wrapper');
const diceElements = document.querySelectorAll('.dice');
const limitField = document.querySelector('#game-limit');

const player1 = new Gamer(prompt('Пожалуйста, игрок №1, введите Ваше имя пользователя') || 'Игрок 1');
const player2 = new Gamer(prompt('Пожалуйста, игрок №2, введите Ваше имя пользователя') || 'Игрок 2');

gamers.push(player1);
gamers.push(player2);

const initGame = () => {
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

initGame();

document.querySelector('.btn-roll').addEventListener('click', function () {
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

    if (gamers[activePlayer].getScore() + current >= LIMIT_VALUE) {
      alert(`${gamers[activePlayer].name} won!!!`);
    }
  }
});

const uniq = arr => arr.filter((item, index) => arr.indexOf(item) === index);

const changePlayer = () => {
  current = 0;
  document.getElementById('current-' + activePlayer).textContent = 0;
  document.querySelector(`.player-${activePlayer}-panel`).classList.toggle('active');
  activePlayer = +!activePlayer;
  diceWrapper.style.display = 'none';
  document.querySelector(`.player-${activePlayer}-panel`).classList.toggle('active');
};

document.querySelector('.btn-hold').addEventListener('click', function () {
  gamers[activePlayer].setScore(current);
  document.querySelector(`#score-${activePlayer}`).textContent = gamers[activePlayer].getScore();
  changePlayer();
});

document.querySelector('.btn-new').addEventListener('click', function () {
  initGame();
});

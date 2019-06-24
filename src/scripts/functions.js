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

export {
  uniq,
  generateId,
  getWinners
}

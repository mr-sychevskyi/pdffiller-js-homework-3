const Gamer = function (name, score, id, isExists = true) {
  this.name = name;
  this.score = score;
  this.id = id;
  this.isExists = isExists;
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

export default Gamer;

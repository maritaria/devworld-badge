const defaultAlphabets = [
  'abcdefghijklmnopqrstuvwxyz',
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  '0123456789',
  '!@#$%^&*_+-=;:|<>,.?§~',
];

export function ScrambledText({
  alphabets = defaultAlphabets,
} = {}) {
  this.alphabets = alphabets;
  this.target = '';
  this.text = [];
  this.settled = [];
  this.settleChance = 0.6;
  this.scrambleChance = 0.04;
  this.isScrambling = false;
}

ScrambledText.prototype = {
  update() {
    this.updateCharacters();
    if (this.isScrambling) {
      this.unsettle();
    } else if (this.text.length !== this.target.length) {
      this.resize();
    } else if (this.settled.length >= this.target.length) {
      this.destabilize();
    } else {
      this.settle();
    }
  },
  updateCharacters() {
    for (let index = 0; index < this.text.length; index++) {
      const isSettled = this.settled.includes(index);
      this.text[index] = isSettled ? this.target[index] : this.letter();
    }
  },
  unsettle() {
    if (roll(this.settleChance)) {
      if (this.text.length <= 1) {
        this.isScrambling = false;
      } else if (this.settled.length) {
        this.settled.splice(Math.floor(Math.random() * this.settled.length), 1);
      } else {
        this.text.splice(0, 1);
      }
    }
  },
  resize() {
    if (roll(this.settleChance)) {
      if (this.text.length < this.target.length) {
        this.text.push('');
      } else {
        this.text.splice(0, 1);
      }
    }
  },
  destabilize() {
    if (roll(this.scrambleChance)) {
      this.isScrambling = true;
    }
  },
  settle() {
    if (roll(this.settleChance)) {
      const remaining = this.target.length - this.settled.length;
      let index = Math.floor(Math.random() * remaining);
      while (this.settled.includes(index)) {
        index++;
      }
      this.settled.push(index);
      this.settled.sort((a, b) => a - b);
    }
  },
  letter() {
    const alphabet = pick(this.alphabets);
    return pick(alphabet);

    function pick(set) {
      return set[Math.floor(Math.random() * set.length)];
    }
  },
};

const text = new ScrambledText();
text.update();


/**
 * Randomly returns true, based on the given chance to pass.
 * @param {number} chance - Chance to pass the check, 0..1 => 0%..100%
 * @return {boolean}
 */
function roll(chance) {
  return Math.random() < chance;
}



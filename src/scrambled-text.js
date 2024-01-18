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
  this.resizeChance = this.unsettleChance = this.settleChance = 0.6;
  this.scrambleChance = 0.04;
  this.locked = false;
  /** @type {'growing'|'settling'|'stable'|'scrambling'|'shrinking'} */
  this.state = 'growing';
}

ScrambledText.prototype = {
  reset() {
    this.text = [];
    this.settled = [];
    this.state = 'growing'
  },
  reveal() {
    this.text = this.target.split('');
    this.settled = Array.from(this.text, (_, i) => i);
  },
  update() {
    this.updateCharacters();
    if (this.locked) return;
    switch (this.state) {
      default:
      case "growing":
        if (roll(this.resizeChance)) {
          if (this.text.length < this.target.length) {
            this.text.push('');
          } else {
            this.text.splice(0, 1);
          }
        }
        if (this.text.length == this.target.length) {
          this.state = 'settling';
        }
        break;
      case "settling":
        if (roll(this.settleChance)) {
          const remaining = this.target.length - this.settled.length;
          let index = Math.floor(Math.random() * remaining);
          while (this.settled.includes(index)) {
            index++;
          }
          this.settled.push(index);
          this.settled.sort((a, b) => a - b);

          if (this.settled.length >= this.target.length) {
            this.state = 'stable';
          }
        }
        break;
      case "stable":
        if (roll(this.scrambleChance)) {
          this.state = 'scrambling';
        }
        break;
      case "scrambling":
        if (roll(this.unsettleChance)) {
          const index = Math.floor(Math.random() * this.settled.length);
          this.settled.splice(index, 1);

          if (!this.settled.length) {
            this.state = 'shrinking';
          }
        }
        break;
      case "shrinking":
        if (roll(this.resizeChance)) {
          this.text.splice(0, 1);
          if (!this.text.length) {
            this.state = 'growing';
          }
        }
        break;
    }
  },
  updateCharacters() {
    const {text, settled, target, alphabets} = this;
    for (let index = 0; index < text.length; index++) {
      const isSettled = settled.includes(index);
      text[index] = isSettled ? target[index] : letter(alphabets);
    }
  },
};

/**
 * Randomly returns true, based on the given chance to pass.
 * @param {number} chance - Chance to pass the check, 0..1 => 0%..100%
 * @return {boolean}
 */
function roll(chance) {
  return Math.random() < chance;
}

function letter(alphabets) {
  const alphabet = pick(alphabets);
  return pick(alphabet);
}

function pick(set) {
  return set[Math.floor(Math.random() * set.length)];
}

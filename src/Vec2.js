import {round, toDegrees, toRadians} from "./math.js";
import {createError} from "./error.js";

/**
 * @class
 * @property {number} x
 * @property {number} y
 */
function Vec2(x, y = x) {
  if (typeof x !== 'number') throw new TypeError("Parameter 'x' must be a number");
  if (typeof y !== 'number') throw new TypeError("Parameter 'y' must be a number");
  // Define x and y as read-only fields because PropertyDescriptor.writable defaults to false
  Object.defineProperties(this, {
    x: {value: x, enumerable: true},
    y: {value: y, enumerable: true},
  });
}

/**
 * @param {number} degrees
 * @param {number} length
 * @return {Vec2}
 */
Vec2.fromAngle = function fromAngle(degrees, length = 1) {
  const radians = toRadians(degrees);
  return new Vec2(
    Math.cos(radians) * length,
    Math.sin(radians) * length,
  );
}

/**
 * @param {number} width - The X component of the vector
 * @param {number} height - The Y component of the vector
 * @return {Vec2}
 */
Vec2.fromSize = function ({width, height}) {
  return new Vec2(width, height);
};

/**
 * @param vector
 * @return {Vec2}
 */
Vec2.parse = function (...vector) {
  if (vector.length === 0) throw new TypeError('Cannot produce Vec2 from 0 arguments');
  if (vector.length >= 3) throw new TypeError('Cannot produce Vec2 from more than 2 arguments');
  if (vector.length === 2) return new Vec2(...vector);

  const arg = vector[0];
  const type = typeof arg;
  if (type === 'number') {
    return new Vec2(arg);
  }
  if (type !== 'object') {
    throw new TypeError(`Cannot coerce ${typeof arg} into Vec2 instance`);
  }
  if (arg instanceof Vec2) {
    return arg;
  }
  if (arg[Symbol.iterator]) {
    return new Vec2(...arg);
  }
  if ('x' in arg && 'y' in arg) {
    return new Vec2(arg.x, arg.y);
  }
  throw createError({
    constructor: TypeError,
    message: 'Failed to coerce argument into Vec2 instance',
    data: arg,
  });
}
/**
 * @type {(function(...[*]): Vec2)}
 */
Vec2.fromObject = Vec2.parse;

Vec2.prototype = {
  constructor: Vec2,
  // Query
  /** @return {boolean} */
  get isZero() {
    return this.x === 0 && this.y === 0;
  },
  /** @return {number} */
  get lengthSqr() {
    return this.x ** 2 + this.y ** 2;
  },
  /** @return {number} */
  get length() {
    return Math.sqrt(this.lengthSqr);
  },
  /** @return {number} */
  get angle() {
    return toDegrees(Math.atan2(this.y, this.x));
  },
  // Arithmetic
  /** @return {Vec2} */
  add(...vector) {
    const other = Vec2.parse(...vector);
    return new this.constructor(this.x + other.x, this.y + other.y);
  },
  /** @return {Vec2} */
  subtract(...vector) {
    const other = Vec2.parse(...vector);
    return new this.constructor(this.x - other.x, this.y - other.y);
  },
  /** @return {Vec2} */
  multiply(...vector) {
    const other = Vec2.parse(...vector);
    return new this.constructor(this.x * other.x, this.y * other.y);
  },
  /** @return {Vec2} */
  divide(...vector) {
    const other = Vec2.parse(...vector);
    return new this.constructor(this.x / other.x, this.y / other.y);
  },
  // Modify
  /**
   * @param {((this: Vec2, xy: number, index: number)) => number} fn
   * @return {Vec2}
   */
  map(fn) {
    return new this.constructor(
      fn.call(this, this.x, 0),
      fn.call(this, this.y, 1),
    );
  },
  /**
   * @param {number} angle
   * @return {Vec2}
   */
  withAngle(angle) {
    return Vec2.fromAngle(angle, this.length);
  },
  /**
   * @param {number} angle
   * @return {Vec2}
   */
  withLength(length) {
    return this.multiply(length / this.length);
  },
  withX(x) {
    return new this.constructor(x, this.y);
  },
  withY(y) {
    return new this.constructor(this.x, y);
  },
  /** @return {Vec2} */
  normalized() {
    return this.withLength(1);
  },
  /** @return {Vec2} */
  transposed() {
    return new this.constructor(this.y, this.x);
  },
  /**
   * @param {number} decimals
   * @return {Vec2}
   */
  round(decimals = 0) {
    return this.map(n => round(n, decimals));
  },
  // Iterable / Array support
  [Symbol.iterator]: function* () {
    yield this.x;
    yield this.y;
  },
  toArray() {
    return [this[0], this[1]];
  },
  /** @return {number} */
  get [0]() {
    return this.x;
  },
  /** @return {number} */
  get [1]() {
    return this.y;
  },
  /** @return {{width:number,height:number}} */
  toSize() {
    return {width: this.x, height: this.y};
  },
  // ToString
  toStringPrecision: 3,
  toString() {
    const {toStringPrecision} = Vec2.prototype;
    const round = (number) => parseFloat(number.toFixed(toStringPrecision));
    return `Vec2[x:${round(this.x)},y:${round(this.y)}]`;
  },
  [Symbol.toStringTag]: 'Vec2',
};

// Static
Vec2.zero = new Vec2(0);
Vec2.one = new Vec2(1);
Vec2.left = new Vec2(-1, 0);
Vec2.right = new Vec2(1, 0);
Vec2.up = new Vec2(0, -1);
Vec2.down = new Vec2(0, 1);

export {Vec2};

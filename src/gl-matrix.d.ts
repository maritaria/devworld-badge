declare module "gl-matrix" {

// prettier-ignore
  export type Mat2 =
    | [number, number,
    number, number]
    | Float32Array;

// prettier-ignore
  export type Mat2d =
    | [number, number,
    number, number,
    number, number]
    | Float32Array;

// prettier-ignore
  export type Mat3 =
    | [number, number, number,
    number, number, number,
    number, number, number]
    | Float32Array;

// prettier-ignore
  export type Mat4 =
    | [number, number, number, number,
    number, number, number, number,
    number, number, number, number,
    number, number, number, number]
    | Float32Array;

  export type Quat = [number, number, number, number] | Float32Array;

// prettier-ignore
  export type Quat2 =
    | [number, number, number, number,
    number, number, number, number]
    | Float32Array;

  export type Vec2 = [number, number] | Float32Array;
  export type Vec3 = [number, number, number] | Float32Array;
  export type Vec4 = [number, number, number, number] | Float32Array;

// prettier-ignore
  export type ReadonlyMat2 =
    | readonly [
    number, number,
    number, number
  ]
    | Float32Array;

// prettier-ignore
  export type ReadonlyMat2d =
    | readonly [
    number, number,
    number, number,
    number, number
  ]
    | Float32Array;

// prettier-ignore
  export type ReadonlyMat3 =
    | readonly [
    number, number, number,
    number, number, number,
    number, number, number
  ]
    | Float32Array;

// prettier-ignore
  export type ReadonlyMat4 =
    | readonly [
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
    number, number, number, number
  ]
    | Float32Array;

  export type ReadonlyQuat =
    | readonly [number, number, number, number]
    | Float32Array;

  export type ReadonlyQuat2 =
    | readonly [number, number, number, number, number, number, number, number]
    | Float32Array;

  export type ReadonlyVec2 = readonly [number, number] | Float32Array;
  export type ReadonlyVec3 = readonly [number, number, number] | Float32Array;
  export type ReadonlyVec4 =
    | readonly [number, number, number, number]
    | Float32Array;

  export module glMatrix {
    /**
     * Sets the type of array used when creating new vectors and matrices
     *
     * @param {Float32ArrayConstructor | ArrayConstructor} type Array type, such as Float32Array or Array
     */
    export function setMatrixArrayType(type: ArrayConstructor | Float32ArrayConstructor): void;
    /**
     * Convert Degree To Radian
     *
     * @param {Number} a Angle in Degrees
     */
    export function toRadian(a: number): number;
    /**
     * Tests whether or not the arguments have approximately the same value, within an absolute
     * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
     * than or equal to 1.0, and a relative tolerance is used for larger values)
     *
     * @param {Number} a The first number to test.
     * @param {Number} b The second number to test.
     * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
     */
    export function equals(a: number, b: number): boolean;
    /**
     * Common utilities
     * @module glMatrix
     */
    export const EPSILON: 0.000001;
    export let ARRAY_TYPE: ArrayConstructor | Float32ArrayConstructor;
    export const RANDOM: () => number;
  }
  export module mat2 {
    /**
     * 2x2 Matrix
     * @module mat2
     */
    /**
     * Creates a new identity mat2
     *
     * @returns {Mat2} a new 2x2 matrix
     */
    export function create(): Mat2;
    /**
     * Creates a new mat2 initialized with values from an existing matrix
     *
     * @param {ReadonlyMat2} a matrix to clone
     * @returns {Mat2} a new 2x2 matrix
     */
    export function clone(a: ReadonlyMat2): Mat2;
    /**
     * Copy the values from one mat2 to another
     *
     * @param {Mat2} out the receiving matrix
     * @param {ReadonlyMat2} a the source matrix
     * @returns {Mat2} out
     */
    export function copy(out: Mat2, a: ReadonlyMat2): Mat2;
    /**
     * Set a mat2 to the identity matrix
     *
     * @param {Mat2} out the receiving matrix
     * @returns {Mat2} out
     */
    export function identity(out: Mat2): Mat2;
    /**
     * Create a new mat2 with the given values
     *
     * @param {Number} m00 Component in column 0, row 0 position (index 0)
     * @param {Number} m01 Component in column 0, row 1 position (index 1)
     * @param {Number} m10 Component in column 1, row 0 position (index 2)
     * @param {Number} m11 Component in column 1, row 1 position (index 3)
     * @returns {Mat2} out A new 2x2 matrix
     */
    export function fromValues(m00: number, m01: number, m10: number, m11: number): Mat2;
    /**
     * Set the components of a mat2 to the given values
     *
     * @param {Mat2} out the receiving matrix
     * @param {Number} m00 Component in column 0, row 0 position (index 0)
     * @param {Number} m01 Component in column 0, row 1 position (index 1)
     * @param {Number} m10 Component in column 1, row 0 position (index 2)
     * @param {Number} m11 Component in column 1, row 1 position (index 3)
     * @returns {Mat2} out
     */
    export function set(out: Mat2, m00: number, m01: number, m10: number, m11: number): Mat2;
    /**
     * Transpose the values of a mat2
     *
     * @param {Mat2} out the receiving matrix
     * @param {ReadonlyMat2} a the source matrix
     * @returns {Mat2} out
     */
    export function transpose(out: Mat2, a: ReadonlyMat2): Mat2;
    /**
     * Inverts a mat2
     *
     * @param {Mat2} out the receiving matrix
     * @param {ReadonlyMat2} a the source matrix
     * @returns {Mat2} out
     */
    export function invert(out: Mat2, a: ReadonlyMat2): Mat2;
    /**
     * Calculates the adjugate of a mat2
     *
     * @param {Mat2} out the receiving matrix
     * @param {ReadonlyMat2} a the source matrix
     * @returns {Mat2} out
     */
    export function adjoint(out: Mat2, a: ReadonlyMat2): Mat2;
    /**
     * Calculates the determinant of a mat2
     *
     * @param {ReadonlyMat2} a the source matrix
     * @returns {Number} determinant of a
     */
    export function determinant(a: ReadonlyMat2): number;
    /**
     * Multiplies two mat2's
     *
     * @param {Mat2} out the receiving matrix
     * @param {ReadonlyMat2} a the first operand
     * @param {ReadonlyMat2} b the second operand
     * @returns {Mat2} out
     */
    export function multiply(out: Mat2, a: ReadonlyMat2, b: ReadonlyMat2): Mat2;
    /**
     * Rotates a mat2 by the given angle
     *
     * @param {Mat2} out the receiving matrix
     * @param {ReadonlyMat2} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {Mat2} out
     */
    export function rotate(out: Mat2, a: ReadonlyMat2, rad: number): Mat2;
    /**
     * Scales the mat2 by the dimensions in the given vec2
     *
     * @param {Mat2} out the receiving matrix
     * @param {ReadonlyMat2} a the matrix to rotate
     * @param {ReadonlyVec2} v the vec2 to scale the matrix by
     * @returns {Mat2} out
     **/
    export function scale(out: Mat2, a: ReadonlyMat2, v: ReadonlyVec2): Mat2;
    /**
     * Creates a matrix from a given angle
     * This is equivalent to (but much faster than):
     *
     *     mat2.identity(dest);
     *     mat2.rotate(dest, dest, rad);
     *
     * @param {Mat2} out mat2 receiving operation result
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {Mat2} out
     */
    export function fromRotation(out: Mat2, rad: number): Mat2;
    /**
     * Creates a matrix from a vector scaling
     * This is equivalent to (but much faster than):
     *
     *     mat2.identity(dest);
     *     mat2.scale(dest, dest, vec);
     *
     * @param {Mat2} out mat2 receiving operation result
     * @param {ReadonlyVec2} v Scaling vector
     * @returns {Mat2} out
     */
    export function fromScaling(out: Mat2, v: ReadonlyVec2): Mat2;
    /**
     * Returns a string representation of a mat2
     *
     * @param {ReadonlyMat2} a matrix to represent as a string
     * @returns {String} string representation of the matrix
     */
    export function str(a: ReadonlyMat2): string;
    /**
     * Returns Frobenius norm of a mat2
     *
     * @param {ReadonlyMat2} a the matrix to calculate Frobenius norm of
     * @returns {Number} Frobenius norm
     */
    export function frob(a: ReadonlyMat2): number;
    /**
     * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
     * @param {ReadonlyMat2} L the lower triangular matrix
     * @param {ReadonlyMat2} D the diagonal matrix
     * @param {ReadonlyMat2} U the upper triangular matrix
     * @param {ReadonlyMat2} a the input matrix to factorize
     */
    export function LDU(L: ReadonlyMat2, D: ReadonlyMat2, U: ReadonlyMat2, a: ReadonlyMat2): ReadonlyMat2[];
    /**
     * Adds two mat2's
     *
     * @param {Mat2} out the receiving matrix
     * @param {ReadonlyMat2} a the first operand
     * @param {ReadonlyMat2} b the second operand
     * @returns {Mat2} out
     */
    export function add(out: Mat2, a: ReadonlyMat2, b: ReadonlyMat2): Mat2;
    /**
     * Subtracts matrix b from matrix a
     *
     * @param {Mat2} out the receiving matrix
     * @param {ReadonlyMat2} a the first operand
     * @param {ReadonlyMat2} b the second operand
     * @returns {Mat2} out
     */
    export function subtract(out: Mat2, a: ReadonlyMat2, b: ReadonlyMat2): Mat2;
    /**
     * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
     *
     * @param {ReadonlyMat2} a The first matrix.
     * @param {ReadonlyMat2} b The second matrix.
     * @returns {Boolean} True if the matrices are equal, false otherwise.
     */
    export function exactEquals(a: ReadonlyMat2, b: ReadonlyMat2): boolean;
    /**
     * Returns whether or not the matrices have approximately the same elements in the same position.
     *
     * @param {ReadonlyMat2} a The first matrix.
     * @param {ReadonlyMat2} b The second matrix.
     * @returns {Boolean} True if the matrices are equal, false otherwise.
     */
    export function equals(a: ReadonlyMat2, b: ReadonlyMat2): boolean;
    /**
     * Multiply each element of the matrix by a scalar.
     *
     * @param {Mat2} out the receiving matrix
     * @param {ReadonlyMat2} a the matrix to scale
     * @param {Number} b amount to scale the matrix's elements by
     * @returns {Mat2} out
     */
    export function multiplyScalar(out: Mat2, a: ReadonlyMat2, b: number): Mat2;
    /**
     * Adds two mat2's after multiplying each element of the second operand by a scalar value.
     *
     * @param {Mat2} out the receiving vector
     * @param {ReadonlyMat2} a the first operand
     * @param {ReadonlyMat2} b the second operand
     * @param {Number} scale the amount to scale b's elements by before adding
     * @returns {Mat2} out
     */
    export function multiplyScalarAndAdd(out: Mat2, a: ReadonlyMat2, b: ReadonlyMat2, scale: number): Mat2;
    /**
     * Multiplies two mat2's
     *
     * @param {Mat2} out the receiving matrix
     * @param {ReadonlyMat2} a the first operand
     * @param {ReadonlyMat2} b the second operand
     * @returns {Mat2} out
     */
    export function mul(out: Mat2, a: ReadonlyMat2, b: ReadonlyMat2): Mat2;
    /**
     * Subtracts matrix b from matrix a
     *
     * @param {Mat2} out the receiving matrix
     * @param {ReadonlyMat2} a the first operand
     * @param {ReadonlyMat2} b the second operand
     * @returns {Mat2} out
     */
    export function sub(out: Mat2, a: ReadonlyMat2, b: ReadonlyMat2): Mat2;
  }
  export module mat2d {
    /**
     * 2x3 Matrix
     * @module mat2d
     * @description
     * A mat2d contains six elements defined as:
     * <pre>
     * [a, b,
     *  c, d,
     *  tx, ty]
     * </pre>
     * This is a short form for the 3x3 matrix:
     * <pre>
     * [a, b, 0,
     *  c, d, 0,
     *  tx, ty, 1]
     * </pre>
     * The last column is ignored so the array is shorter and operations are faster.
     */
    /**
     * Creates a new identity mat2d
     *
     * @returns {Mat2d} a new 2x3 matrix
     */
    export function create(): Mat2d;
    /**
     * Creates a new mat2d initialized with values from an existing matrix
     *
     * @param {ReadonlyMat2d} a matrix to clone
     * @returns {Mat2d} a new 2x3 matrix
     */
    export function clone(a: ReadonlyMat2d): Mat2d;
    /**
     * Copy the values from one mat2d to another
     *
     * @param {Mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the source matrix
     * @returns {Mat2d} out
     */
    export function copy(out: Mat2d, a: ReadonlyMat2d): Mat2d;
    /**
     * Set a mat2d to the identity matrix
     *
     * @param {Mat2d} out the receiving matrix
     * @returns {Mat2d} out
     */
    export function identity(out: Mat2d): Mat2d;
    /**
     * Create a new mat2d with the given values
     *
     * @param {Number} a Component A (index 0)
     * @param {Number} b Component B (index 1)
     * @param {Number} c Component C (index 2)
     * @param {Number} d Component D (index 3)
     * @param {Number} tx Component TX (index 4)
     * @param {Number} ty Component TY (index 5)
     * @returns {Mat2d} A new mat2d
     */
    export function fromValues(a: number, b: number, c: number, d: number, tx: number, ty: number): Mat2d;
    /**
     * Set the components of a mat2d to the given values
     *
     * @param {Mat2d} out the receiving matrix
     * @param {Number} a Component A (index 0)
     * @param {Number} b Component B (index 1)
     * @param {Number} c Component C (index 2)
     * @param {Number} d Component D (index 3)
     * @param {Number} tx Component TX (index 4)
     * @param {Number} ty Component TY (index 5)
     * @returns {Mat2d} out
     */
    export function set(out: Mat2d, a: number, b: number, c: number, d: number, tx: number, ty: number): Mat2d;
    /**
     * Inverts a mat2d
     *
     * @param {Mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the source matrix
     * @returns {Mat2d} out
     */
    export function invert(out: Mat2d, a: ReadonlyMat2d): Mat2d;
    /**
     * Calculates the determinant of a mat2d
     *
     * @param {ReadonlyMat2d} a the source matrix
     * @returns {Number} determinant of a
     */
    export function determinant(a: ReadonlyMat2d): number;
    /**
     * Multiplies two mat2d's
     *
     * @param {Mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the first operand
     * @param {ReadonlyMat2d} b the second operand
     * @returns {Mat2d} out
     */
    export function multiply(out: Mat2d, a: ReadonlyMat2d, b: ReadonlyMat2d): Mat2d;
    /**
     * Rotates a mat2d by the given angle
     *
     * @param {Mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {Mat2d} out
     */
    export function rotate(out: Mat2d, a: ReadonlyMat2d, rad: number): Mat2d;
    /**
     * Scales the mat2d by the dimensions in the given vec2
     *
     * @param {Mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the matrix to translate
     * @param {ReadonlyVec2} v the vec2 to scale the matrix by
     * @returns {Mat2d} out
     **/
    export function scale(out: Mat2d, a: ReadonlyMat2d, v: ReadonlyVec2): Mat2d;
    /**
     * Translates the mat2d by the dimensions in the given vec2
     *
     * @param {Mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the matrix to translate
     * @param {ReadonlyVec2} v the vec2 to translate the matrix by
     * @returns {Mat2d} out
     **/
    export function translate(out: Mat2d, a: ReadonlyMat2d, v: ReadonlyVec2): Mat2d;
    /**
     * Creates a matrix from a given angle
     * This is equivalent to (but much faster than):
     *
     *     mat2d.identity(dest);
     *     mat2d.rotate(dest, dest, rad);
     *
     * @param {Mat2d} out mat2d receiving operation result
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {Mat2d} out
     */
    export function fromRotation(out: Mat2d, rad: number): Mat2d;
    /**
     * Creates a matrix from a vector scaling
     * This is equivalent to (but much faster than):
     *
     *     mat2d.identity(dest);
     *     mat2d.scale(dest, dest, vec);
     *
     * @param {Mat2d} out mat2d receiving operation result
     * @param {ReadonlyVec2} v Scaling vector
     * @returns {Mat2d} out
     */
    export function fromScaling(out: Mat2d, v: ReadonlyVec2): Mat2d;
    /**
     * Creates a matrix from a vector translation
     * This is equivalent to (but much faster than):
     *
     *     mat2d.identity(dest);
     *     mat2d.translate(dest, dest, vec);
     *
     * @param {Mat2d} out mat2d receiving operation result
     * @param {ReadonlyVec2} v Translation vector
     * @returns {Mat2d} out
     */
    export function fromTranslation(out: Mat2d, v: ReadonlyVec2): Mat2d;
    /**
     * Returns a string representation of a mat2d
     *
     * @param {ReadonlyMat2d} a matrix to represent as a string
     * @returns {String} string representation of the matrix
     */
    export function str(a: ReadonlyMat2d): string;
    /**
     * Returns Frobenius norm of a mat2d
     *
     * @param {ReadonlyMat2d} a the matrix to calculate Frobenius norm of
     * @returns {Number} Frobenius norm
     */
    export function frob(a: ReadonlyMat2d): number;
    /**
     * Adds two mat2d's
     *
     * @param {Mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the first operand
     * @param {ReadonlyMat2d} b the second operand
     * @returns {Mat2d} out
     */
    export function add(out: Mat2d, a: ReadonlyMat2d, b: ReadonlyMat2d): Mat2d;
    /**
     * Subtracts matrix b from matrix a
     *
     * @param {Mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the first operand
     * @param {ReadonlyMat2d} b the second operand
     * @returns {Mat2d} out
     */
    export function subtract(out: Mat2d, a: ReadonlyMat2d, b: ReadonlyMat2d): Mat2d;
    /**
     * Multiply each element of the matrix by a scalar.
     *
     * @param {Mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the matrix to scale
     * @param {Number} b amount to scale the matrix's elements by
     * @returns {Mat2d} out
     */
    export function multiplyScalar(out: Mat2d, a: ReadonlyMat2d, b: number): Mat2d;
    /**
     * Adds two mat2d's after multiplying each element of the second operand by a scalar value.
     *
     * @param {Mat2d} out the receiving vector
     * @param {ReadonlyMat2d} a the first operand
     * @param {ReadonlyMat2d} b the second operand
     * @param {Number} scale the amount to scale b's elements by before adding
     * @returns {Mat2d} out
     */
    export function multiplyScalarAndAdd(out: Mat2d, a: ReadonlyMat2d, b: ReadonlyMat2d, scale: number): Mat2d;
    /**
     * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
     *
     * @param {ReadonlyMat2d} a The first matrix.
     * @param {ReadonlyMat2d} b The second matrix.
     * @returns {Boolean} True if the matrices are equal, false otherwise.
     */
    export function exactEquals(a: ReadonlyMat2d, b: ReadonlyMat2d): boolean;
    /**
     * Returns whether or not the matrices have approximately the same elements in the same position.
     *
     * @param {ReadonlyMat2d} a The first matrix.
     * @param {ReadonlyMat2d} b The second matrix.
     * @returns {Boolean} True if the matrices are equal, false otherwise.
     */
    export function equals(a: ReadonlyMat2d, b: ReadonlyMat2d): boolean;
    /**
     * Multiplies two mat2d's
     *
     * @param {Mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the first operand
     * @param {ReadonlyMat2d} b the second operand
     * @returns {Mat2d} out
     */
    export function mul(out: Mat2d, a: ReadonlyMat2d, b: ReadonlyMat2d): Mat2d;
    /**
     * Subtracts matrix b from matrix a
     *
     * @param {Mat2d} out the receiving matrix
     * @param {ReadonlyMat2d} a the first operand
     * @param {ReadonlyMat2d} b the second operand
     * @returns {Mat2d} out
     */
    export function sub(out: Mat2d, a: ReadonlyMat2d, b: ReadonlyMat2d): Mat2d;
  }
  export module mat3 {
    /**
     * 3x3 Matrix
     * @module mat3
     */
    /**
     * Creates a new identity mat3
     *
     * @returns {Mat3} a new 3x3 matrix
     */
    export function create(): Mat3;
    /**
     * Copies the upper-left 3x3 values into the given mat3.
     *
     * @param {Mat3} out the receiving 3x3 matrix
     * @param {ReadonlyMat4} a   the source 4x4 matrix
     * @returns {Mat3} out
     */
    export function fromMat4(out: Mat3, a: ReadonlyMat4): Mat3;
    /**
     * Creates a new mat3 initialized with values from an existing matrix
     *
     * @param {ReadonlyMat3} a matrix to clone
     * @returns {Mat3} a new 3x3 matrix
     */
    export function clone(a: ReadonlyMat3): Mat3;
    /**
     * Copy the values from one mat3 to another
     *
     * @param {Mat3} out the receiving matrix
     * @param {ReadonlyMat3} a the source matrix
     * @returns {Mat3} out
     */
    export function copy(out: Mat3, a: ReadonlyMat3): Mat3;
    /**
     * Create a new mat3 with the given values
     *
     * @param {Number} m00 Component in column 0, row 0 position (index 0)
     * @param {Number} m01 Component in column 0, row 1 position (index 1)
     * @param {Number} m02 Component in column 0, row 2 position (index 2)
     * @param {Number} m10 Component in column 1, row 0 position (index 3)
     * @param {Number} m11 Component in column 1, row 1 position (index 4)
     * @param {Number} m12 Component in column 1, row 2 position (index 5)
     * @param {Number} m20 Component in column 2, row 0 position (index 6)
     * @param {Number} m21 Component in column 2, row 1 position (index 7)
     * @param {Number} m22 Component in column 2, row 2 position (index 8)
     * @returns {Mat3} A new mat3
     */
    export function fromValues(m00: number, m01: number, m02: number, m10: number, m11: number, m12: number, m20: number, m21: number, m22: number): Mat3;
    /**
     * Set the components of a mat3 to the given values
     *
     * @param {Mat3} out the receiving matrix
     * @param {Number} m00 Component in column 0, row 0 position (index 0)
     * @param {Number} m01 Component in column 0, row 1 position (index 1)
     * @param {Number} m02 Component in column 0, row 2 position (index 2)
     * @param {Number} m10 Component in column 1, row 0 position (index 3)
     * @param {Number} m11 Component in column 1, row 1 position (index 4)
     * @param {Number} m12 Component in column 1, row 2 position (index 5)
     * @param {Number} m20 Component in column 2, row 0 position (index 6)
     * @param {Number} m21 Component in column 2, row 1 position (index 7)
     * @param {Number} m22 Component in column 2, row 2 position (index 8)
     * @returns {Mat3} out
     */
    export function set(out: Mat3, m00: number, m01: number, m02: number, m10: number, m11: number, m12: number, m20: number, m21: number, m22: number): Mat3;
    /**
     * Set a mat3 to the identity matrix
     *
     * @param {Mat3} out the receiving matrix
     * @returns {Mat3} out
     */
    export function identity(out: Mat3): Mat3;
    /**
     * Transpose the values of a mat3
     *
     * @param {Mat3} out the receiving matrix
     * @param {ReadonlyMat3} a the source matrix
     * @returns {Mat3} out
     */
    export function transpose(out: Mat3, a: ReadonlyMat3): Mat3;
    /**
     * Inverts a mat3
     *
     * @param {Mat3} out the receiving matrix
     * @param {ReadonlyMat3} a the source matrix
     * @returns {Mat3} out
     */
    export function invert(out: Mat3, a: ReadonlyMat3): Mat3;
    /**
     * Calculates the adjugate of a mat3
     *
     * @param {Mat3} out the receiving matrix
     * @param {ReadonlyMat3} a the source matrix
     * @returns {Mat3} out
     */
    export function adjoint(out: Mat3, a: ReadonlyMat3): Mat3;
    /**
     * Calculates the determinant of a mat3
     *
     * @param {ReadonlyMat3} a the source matrix
     * @returns {Number} determinant of a
     */
    export function determinant(a: ReadonlyMat3): number;
    /**
     * Multiplies two mat3's
     *
     * @param {Mat3} out the receiving matrix
     * @param {ReadonlyMat3} a the first operand
     * @param {ReadonlyMat3} b the second operand
     * @returns {Mat3} out
     */
    export function multiply(out: Mat3, a: ReadonlyMat3, b: ReadonlyMat3): Mat3;
    /**
     * Translate a mat3 by the given vector
     *
     * @param {Mat3} out the receiving matrix
     * @param {ReadonlyMat3} a the matrix to translate
     * @param {ReadonlyVec2} v vector to translate by
     * @returns {Mat3} out
     */
    export function translate(out: Mat3, a: ReadonlyMat3, v: ReadonlyVec2): Mat3;
    /**
     * Rotates a mat3 by the given angle
     *
     * @param {Mat3} out the receiving matrix
     * @param {ReadonlyMat3} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {Mat3} out
     */
    export function rotate(out: Mat3, a: ReadonlyMat3, rad: number): Mat3;
    /**
     * Scales the mat3 by the dimensions in the given vec2
     *
     * @param {Mat3} out the receiving matrix
     * @param {ReadonlyMat3} a the matrix to rotate
     * @param {ReadonlyVec2} v the vec2 to scale the matrix by
     * @returns {Mat3} out
     **/
    export function scale(out: Mat3, a: ReadonlyMat3, v: ReadonlyVec2): Mat3;
    /**
     * Creates a matrix from a vector translation
     * This is equivalent to (but much faster than):
     *
     *     mat3.identity(dest);
     *     mat3.translate(dest, dest, vec);
     *
     * @param {Mat3} out mat3 receiving operation result
     * @param {ReadonlyVec2} v Translation vector
     * @returns {Mat3} out
     */
    export function fromTranslation(out: Mat3, v: ReadonlyVec2): Mat3;
    /**
     * Creates a matrix from a given angle
     * This is equivalent to (but much faster than):
     *
     *     mat3.identity(dest);
     *     mat3.rotate(dest, dest, rad);
     *
     * @param {Mat3} out mat3 receiving operation result
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {Mat3} out
     */
    export function fromRotation(out: Mat3, rad: number): Mat3;
    /**
     * Creates a matrix from a vector scaling
     * This is equivalent to (but much faster than):
     *
     *     mat3.identity(dest);
     *     mat3.scale(dest, dest, vec);
     *
     * @param {Mat3} out mat3 receiving operation result
     * @param {ReadonlyVec2} v Scaling vector
     * @returns {Mat3} out
     */
    export function fromScaling(out: Mat3, v: ReadonlyVec2): Mat3;
    /**
     * Copies the values from a mat2d into a mat3
     *
     * @param {Mat3} out the receiving matrix
     * @param {ReadonlyMat2d} a the matrix to copy
     * @returns {Mat3} out
     **/
    export function fromMat2d(out: Mat3, a: ReadonlyMat2d): Mat3;
    /**
     * Calculates a 3x3 matrix from the given quaternion
     *
     * @param {Mat3} out mat3 receiving operation result
     * @param {ReadonlyQuat} q Quaternion to create matrix from
     *
     * @returns {Mat3} out
     */
    export function fromQuat(out: Mat3, q: ReadonlyQuat): Mat3;
    /**
     * Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
     *
     * @param {Mat3} out mat3 receiving operation result
     * @param {ReadonlyMat4} a Mat4 to derive the normal matrix from
     *
     * @returns {Mat3} out
     */
    export function normalFromMat4(out: Mat3, a: ReadonlyMat4): Mat3;
    /**
     * Generates a 2D projection matrix with the given bounds
     *
     * @param {Mat3} out mat3 frustum matrix will be written into
     * @param {number} width Width of your gl context
     * @param {number} height Height of gl context
     * @returns {Mat3} out
     */
    export function projection(out: Mat3, width: number, height: number): Mat3;
    /**
     * Returns a string representation of a mat3
     *
     * @param {ReadonlyMat3} a matrix to represent as a string
     * @returns {String} string representation of the matrix
     */
    export function str(a: ReadonlyMat3): string;
    /**
     * Returns Frobenius norm of a mat3
     *
     * @param {ReadonlyMat3} a the matrix to calculate Frobenius norm of
     * @returns {Number} Frobenius norm
     */
    export function frob(a: ReadonlyMat3): number;
    /**
     * Adds two mat3's
     *
     * @param {Mat3} out the receiving matrix
     * @param {ReadonlyMat3} a the first operand
     * @param {ReadonlyMat3} b the second operand
     * @returns {Mat3} out
     */
    export function add(out: Mat3, a: ReadonlyMat3, b: ReadonlyMat3): Mat3;
    /**
     * Subtracts matrix b from matrix a
     *
     * @param {Mat3} out the receiving matrix
     * @param {ReadonlyMat3} a the first operand
     * @param {ReadonlyMat3} b the second operand
     * @returns {Mat3} out
     */
    export function subtract(out: Mat3, a: ReadonlyMat3, b: ReadonlyMat3): Mat3;
    /**
     * Multiply each element of the matrix by a scalar.
     *
     * @param {Mat3} out the receiving matrix
     * @param {ReadonlyMat3} a the matrix to scale
     * @param {Number} b amount to scale the matrix's elements by
     * @returns {Mat3} out
     */
    export function multiplyScalar(out: Mat3, a: ReadonlyMat3, b: number): Mat3;
    /**
     * Adds two mat3's after multiplying each element of the second operand by a scalar value.
     *
     * @param {Mat3} out the receiving vector
     * @param {ReadonlyMat3} a the first operand
     * @param {ReadonlyMat3} b the second operand
     * @param {Number} scale the amount to scale b's elements by before adding
     * @returns {Mat3} out
     */
    export function multiplyScalarAndAdd(out: Mat3, a: ReadonlyMat3, b: ReadonlyMat3, scale: number): Mat3;
    /**
     * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
     *
     * @param {ReadonlyMat3} a The first matrix.
     * @param {ReadonlyMat3} b The second matrix.
     * @returns {Boolean} True if the matrices are equal, false otherwise.
     */
    export function exactEquals(a: ReadonlyMat3, b: ReadonlyMat3): boolean;
    /**
     * Returns whether or not the matrices have approximately the same elements in the same position.
     *
     * @param {ReadonlyMat3} a The first matrix.
     * @param {ReadonlyMat3} b The second matrix.
     * @returns {Boolean} True if the matrices are equal, false otherwise.
     */
    export function equals(a: ReadonlyMat3, b: ReadonlyMat3): boolean;
    /**
     * Multiplies two mat3's
     *
     * @param {Mat3} out the receiving matrix
     * @param {ReadonlyMat3} a the first operand
     * @param {ReadonlyMat3} b the second operand
     * @returns {Mat3} out
     */
    export function mul(out: Mat3, a: ReadonlyMat3, b: ReadonlyMat3): Mat3;
    /**
     * Subtracts matrix b from matrix a
     *
     * @param {Mat3} out the receiving matrix
     * @param {ReadonlyMat3} a the first operand
     * @param {ReadonlyMat3} b the second operand
     * @returns {Mat3} out
     */
    export function sub(out: Mat3, a: ReadonlyMat3, b: ReadonlyMat3): Mat3;
  }
  export module mat4 {
    /**
     * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
     * @module mat4
     */
    /**
     * Creates a new identity mat4
     *
     * @returns {Mat4} a new 4x4 matrix
     */
    export function create(): Mat4;
    /**
     * Creates a new mat4 initialized with values from an existing matrix
     *
     * @param {ReadonlyMat4} a matrix to clone
     * @returns {Mat4} a new 4x4 matrix
     */
    export function clone(a: ReadonlyMat4): Mat4;
    /**
     * Copy the values from one mat4 to another
     *
     * @param {Mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the source matrix
     * @returns {Mat4} out
     */
    export function copy(out: Mat4, a: ReadonlyMat4): Mat4;
    /**
     * Create a new mat4 with the given values
     *
     * @param {Number} m00 Component in column 0, row 0 position (index 0)
     * @param {Number} m01 Component in column 0, row 1 position (index 1)
     * @param {Number} m02 Component in column 0, row 2 position (index 2)
     * @param {Number} m03 Component in column 0, row 3 position (index 3)
     * @param {Number} m10 Component in column 1, row 0 position (index 4)
     * @param {Number} m11 Component in column 1, row 1 position (index 5)
     * @param {Number} m12 Component in column 1, row 2 position (index 6)
     * @param {Number} m13 Component in column 1, row 3 position (index 7)
     * @param {Number} m20 Component in column 2, row 0 position (index 8)
     * @param {Number} m21 Component in column 2, row 1 position (index 9)
     * @param {Number} m22 Component in column 2, row 2 position (index 10)
     * @param {Number} m23 Component in column 2, row 3 position (index 11)
     * @param {Number} m30 Component in column 3, row 0 position (index 12)
     * @param {Number} m31 Component in column 3, row 1 position (index 13)
     * @param {Number} m32 Component in column 3, row 2 position (index 14)
     * @param {Number} m33 Component in column 3, row 3 position (index 15)
     * @returns {Mat4} A new mat4
     */
    export function fromValues(m00: number, m01: number, m02: number, m03: number, m10: number, m11: number, m12: number, m13: number, m20: number, m21: number, m22: number, m23: number, m30: number, m31: number, m32: number, m33: number): Mat4;
    /**
     * Set the components of a mat4 to the given values
     *
     * @param {Mat4} out the receiving matrix
     * @param {Number} m00 Component in column 0, row 0 position (index 0)
     * @param {Number} m01 Component in column 0, row 1 position (index 1)
     * @param {Number} m02 Component in column 0, row 2 position (index 2)
     * @param {Number} m03 Component in column 0, row 3 position (index 3)
     * @param {Number} m10 Component in column 1, row 0 position (index 4)
     * @param {Number} m11 Component in column 1, row 1 position (index 5)
     * @param {Number} m12 Component in column 1, row 2 position (index 6)
     * @param {Number} m13 Component in column 1, row 3 position (index 7)
     * @param {Number} m20 Component in column 2, row 0 position (index 8)
     * @param {Number} m21 Component in column 2, row 1 position (index 9)
     * @param {Number} m22 Component in column 2, row 2 position (index 10)
     * @param {Number} m23 Component in column 2, row 3 position (index 11)
     * @param {Number} m30 Component in column 3, row 0 position (index 12)
     * @param {Number} m31 Component in column 3, row 1 position (index 13)
     * @param {Number} m32 Component in column 3, row 2 position (index 14)
     * @param {Number} m33 Component in column 3, row 3 position (index 15)
     * @returns {Mat4} out
     */
    export function set(out: Mat4, m00: number, m01: number, m02: number, m03: number, m10: number, m11: number, m12: number, m13: number, m20: number, m21: number, m22: number, m23: number, m30: number, m31: number, m32: number, m33: number): Mat4;
    /**
     * Set a mat4 to the identity matrix
     *
     * @param {Mat4} out the receiving matrix
     * @returns {Mat4} out
     */
    export function identity(out: Mat4): Mat4;
    /**
     * Transpose the values of a mat4
     *
     * @param {Mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the source matrix
     * @returns {Mat4} out
     */
    export function transpose(out: Mat4, a: ReadonlyMat4): Mat4;
    /**
     * Inverts a mat4
     *
     * @param {Mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the source matrix
     * @returns {Mat4} out
     */
    export function invert(out: Mat4, a: ReadonlyMat4): Mat4;
    /**
     * Calculates the adjugate of a mat4
     *
     * @param {Mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the source matrix
     * @returns {Mat4} out
     */
    export function adjoint(out: Mat4, a: ReadonlyMat4): Mat4;
    /**
     * Calculates the determinant of a mat4
     *
     * @param {ReadonlyMat4} a the source matrix
     * @returns {Number} determinant of a
     */
    export function determinant(a: ReadonlyMat4): number;
    /**
     * Multiplies two mat4s
     *
     * @param {Mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the first operand
     * @param {ReadonlyMat4} b the second operand
     * @returns {Mat4} out
     */
    export function multiply(out: Mat4, a: ReadonlyMat4, b: ReadonlyMat4): Mat4;
    /**
     * Translate a mat4 by the given vector
     *
     * @param {Mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the matrix to translate
     * @param {ReadonlyVec3} v vector to translate by
     * @returns {Mat4} out
     */
    export function translate(out: Mat4, a: ReadonlyMat4, v: ReadonlyVec3): Mat4;
    /**
     * Scales the mat4 by the dimensions in the given vec3 not using vectorization
     *
     * @param {Mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the matrix to scale
     * @param {ReadonlyVec3} v the vec3 to scale the matrix by
     * @returns {Mat4} out
     **/
    export function scale(out: Mat4, a: ReadonlyMat4, v: ReadonlyVec3): Mat4;
    /**
     * Rotates a mat4 by the given angle around the given axis
     *
     * @param {Mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @param {ReadonlyVec3} axis the axis to rotate around
     * @returns {Mat4} out
     */
    export function rotate(out: Mat4, a: ReadonlyMat4, rad: number, axis: ReadonlyVec3): Mat4;
    /**
     * Rotates a matrix by the given angle around the X axis
     *
     * @param {Mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {Mat4} out
     */
    export function rotateX(out: Mat4, a: ReadonlyMat4, rad: number): Mat4;
    /**
     * Rotates a matrix by the given angle around the Y axis
     *
     * @param {Mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {Mat4} out
     */
    export function rotateY(out: Mat4, a: ReadonlyMat4, rad: number): Mat4;
    /**
     * Rotates a matrix by the given angle around the Z axis
     *
     * @param {Mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {Mat4} out
     */
    export function rotateZ(out: Mat4, a: ReadonlyMat4, rad: number): Mat4;
    /**
     * Creates a matrix from a vector translation
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest);
     *     mat4.translate(dest, dest, vec);
     *
     * @param {Mat4} out mat4 receiving operation result
     * @param {ReadonlyVec3} v Translation vector
     * @returns {Mat4} out
     */
    export function fromTranslation(out: Mat4, v: ReadonlyVec3): Mat4;
    /**
     * Creates a matrix from a vector scaling
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest);
     *     mat4.scale(dest, dest, vec);
     *
     * @param {Mat4} out mat4 receiving operation result
     * @param {ReadonlyVec3} v Scaling vector
     * @returns {Mat4} out
     */
    export function fromScaling(out: Mat4, v: ReadonlyVec3): Mat4;
    /**
     * Creates a matrix from a given angle around a given axis
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest);
     *     mat4.rotate(dest, dest, rad, axis);
     *
     * @param {Mat4} out mat4 receiving operation result
     * @param {Number} rad the angle to rotate the matrix by
     * @param {ReadonlyVec3} axis the axis to rotate around
     * @returns {Mat4} out
     */
    export function fromRotation(out: Mat4, rad: number, axis: ReadonlyVec3): Mat4;
    /**
     * Creates a matrix from the given angle around the X axis
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest);
     *     mat4.rotateX(dest, dest, rad);
     *
     * @param {Mat4} out mat4 receiving operation result
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {Mat4} out
     */
    export function fromXRotation(out: Mat4, rad: number): Mat4;
    /**
     * Creates a matrix from the given angle around the Y axis
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest);
     *     mat4.rotateY(dest, dest, rad);
     *
     * @param {Mat4} out mat4 receiving operation result
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {Mat4} out
     */
    export function fromYRotation(out: Mat4, rad: number): Mat4;
    /**
     * Creates a matrix from the given angle around the Z axis
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest);
     *     mat4.rotateZ(dest, dest, rad);
     *
     * @param {Mat4} out mat4 receiving operation result
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {Mat4} out
     */
    export function fromZRotation(out: Mat4, rad: number): Mat4;
    /**
     * Creates a matrix from a quaternion rotation and vector translation
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest);
     *     mat4.translate(dest, vec);
     *     let quatMat = mat4.create();
     *     quat4.toMat4(quat, quatMat);
     *     mat4.multiply(dest, quatMat);
     *
     * @param {Mat4} out mat4 receiving operation result
     * @param {Quat4} q Rotation quaternion
     * @param {ReadonlyVec3} v Translation vector
     * @returns {Mat4} out
     */
    export function fromRotationTranslation(out: Mat4, q: any, v: ReadonlyVec3): Mat4;
    /**
     * Creates a new mat4 from a dual quat.
     *
     * @param {Mat4} out Matrix
     * @param {ReadonlyQuat2} a Dual Quaternion
     * @returns {Mat4} mat4 receiving operation result
     */
    export function fromQuat2(out: Mat4, a: ReadonlyQuat2): Mat4;
    /**
     * Returns the translation vector component of a transformation
     *  matrix. If a matrix is built with fromRotationTranslation,
     *  the returned vector will be the same as the translation vector
     *  originally supplied.
     * @param  {Vec3} out Vector to receive translation component
     * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
     * @return {Vec3} out
     */
    export function getTranslation(out: Vec3, mat: ReadonlyMat4): Vec3;
    /**
     * Returns the scaling factor component of a transformation
     *  matrix. If a matrix is built with fromRotationTranslationScale
     *  with a normalized Quaternion paramter, the returned vector will be
     *  the same as the scaling vector
     *  originally supplied.
     * @param  {Vec3} out Vector to receive scaling factor component
     * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
     * @return {Vec3} out
     */
    export function getScaling(out: Vec3, mat: ReadonlyMat4): Vec3;
    /**
     * Returns a quaternion representing the rotational component
     *  of a transformation matrix. If a matrix is built with
     *  fromRotationTranslation, the returned quaternion will be the
     *  same as the quaternion originally supplied.
     * @param {Quat} out Quaternion to receive the rotation component
     * @param {ReadonlyMat4} mat Matrix to be decomposed (input)
     * @return {Quat} out
     */
    export function getRotation(out: Quat, mat: ReadonlyMat4): Quat;
    /**
     * Creates a matrix from a quaternion rotation, vector translation and vector scale
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest);
     *     mat4.translate(dest, vec);
     *     let quatMat = mat4.create();
     *     quat4.toMat4(quat, quatMat);
     *     mat4.multiply(dest, quatMat);
     *     mat4.scale(dest, scale)
     *
     * @param {Mat4} out mat4 receiving operation result
     * @param {Quat4} q Rotation quaternion
     * @param {ReadonlyVec3} v Translation vector
     * @param {ReadonlyVec3} s Scaling vector
     * @returns {Mat4} out
     */
    export function fromRotationTranslationScale(out: Mat4, q: any, v: ReadonlyVec3, s: ReadonlyVec3): Mat4;
    /**
     * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest);
     *     mat4.translate(dest, vec);
     *     mat4.translate(dest, origin);
     *     let quatMat = mat4.create();
     *     quat4.toMat4(quat, quatMat);
     *     mat4.multiply(dest, quatMat);
     *     mat4.scale(dest, scale)
     *     mat4.translate(dest, negativeOrigin);
     *
     * @param {Mat4} out mat4 receiving operation result
     * @param {Quat4} q Rotation quaternion
     * @param {ReadonlyVec3} v Translation vector
     * @param {ReadonlyVec3} s Scaling vector
     * @param {ReadonlyVec3} o The origin vector around which to scale and rotate
     * @returns {Mat4} out
     */
    export function fromRotationTranslationScaleOrigin(out: Mat4, q: Quat, v: ReadonlyVec3, s: ReadonlyVec3, o: ReadonlyVec3): Mat4;
    /**
     * Calculates a 4x4 matrix from the given quaternion
     *
     * @param {Mat4} out mat4 receiving operation result
     * @param {ReadonlyQuat} q Quaternion to create matrix from
     *
     * @returns {Mat4} out
     */
    export function fromQuat(out: Mat4, q: ReadonlyQuat): Mat4;
    /**
     * Generates a frustum matrix with the given bounds
     *
     * @param {Mat4} out mat4 frustum matrix will be written into
     * @param {Number} left Left bound of the frustum
     * @param {Number} right Right bound of the frustum
     * @param {Number} bottom Bottom bound of the frustum
     * @param {Number} top Top bound of the frustum
     * @param {Number} near Near bound of the frustum
     * @param {Number} far Far bound of the frustum
     * @returns {Mat4} out
     */
    export function frustum(out: Mat4, left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4;
    /**
     * Generates a perspective projection matrix with the given bounds.
     * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
     * which matches WebGL/OpenGL's clip volume.
     * Passing null/undefined/no value for far will generate infinite projection matrix.
     *
     * @param {Mat4} out mat4 frustum matrix will be written into
     * @param {number} fovy Vertical field of view in radians
     * @param {number} aspect Aspect ratio. typically viewport width/height
     * @param {number} near Near bound of the frustum
     * @param {number} far Far bound of the frustum, can be null or Infinity
     * @returns {Mat4} out
     */
    export function perspectiveNO(out: Mat4, fovy: number, aspect: number, near: number, far: number): Mat4;
    /**
     * Generates a perspective projection matrix suitable for WebGPU with the given bounds.
     * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
     * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
     * Passing null/undefined/no value for far will generate infinite projection matrix.
     *
     * @param {Mat4} out mat4 frustum matrix will be written into
     * @param {number} fovy Vertical field of view in radians
     * @param {number} aspect Aspect ratio. typically viewport width/height
     * @param {number} near Near bound of the frustum
     * @param {number} far Far bound of the frustum, can be null or Infinity
     * @returns {Mat4} out
     */
    export function perspectiveZO(out: Mat4, fovy: number, aspect: number, near: number, far: number): Mat4;
    /**
     * Generates a perspective projection matrix with the given field of view.
     * This is primarily useful for generating projection matrices to be used
     * with the still experiemental WebVR API.
     *
     * @param {Mat4} out mat4 frustum matrix will be written into
     * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
     * @param {number} near Near bound of the frustum
     * @param {number} far Far bound of the frustum
     * @returns {Mat4} out
     */
    export function perspectiveFromFieldOfView(out: Mat4, fov: any, near: number, far: number): Mat4;
    /**
     * Generates a orthogonal projection matrix with the given bounds.
     * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
     * which matches WebGL/OpenGL's clip volume.
     *
     * @param {Mat4} out mat4 frustum matrix will be written into
     * @param {number} left Left bound of the frustum
     * @param {number} right Right bound of the frustum
     * @param {number} bottom Bottom bound of the frustum
     * @param {number} top Top bound of the frustum
     * @param {number} near Near bound of the frustum
     * @param {number} far Far bound of the frustum
     * @returns {Mat4} out
     */
    export function orthoNO(out: Mat4, left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4;
    /**
     * Generates a orthogonal projection matrix with the given bounds.
     * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
     * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
     *
     * @param {Mat4} out mat4 frustum matrix will be written into
     * @param {number} left Left bound of the frustum
     * @param {number} right Right bound of the frustum
     * @param {number} bottom Bottom bound of the frustum
     * @param {number} top Top bound of the frustum
     * @param {number} near Near bound of the frustum
     * @param {number} far Far bound of the frustum
     * @returns {Mat4} out
     */
    export function orthoZO(out: Mat4, left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4;
    /**
     * Generates a look-at matrix with the given eye position, focal point, and up axis.
     * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
     *
     * @param {Mat4} out mat4 frustum matrix will be written into
     * @param {ReadonlyVec3} eye Position of the viewer
     * @param {ReadonlyVec3} center Point the viewer is looking at
     * @param {ReadonlyVec3} up vec3 pointing up
     * @returns {Mat4} out
     */
    export function lookAt(out: Mat4, eye: ReadonlyVec3, center: ReadonlyVec3, up: ReadonlyVec3): Mat4;
    /**
     * Generates a matrix that makes something look at something else.
     *
     * @param {Mat4} out mat4 frustum matrix will be written into
     * @param {ReadonlyVec3} eye Position of the viewer
     * @param {ReadonlyVec3} center Point the viewer is looking at
     * @param {ReadonlyVec3} up vec3 pointing up
     * @returns {Mat4} out
     */
    export function targetTo(out: Mat4, eye: ReadonlyVec3, target: any, up: ReadonlyVec3): Mat4;
    /**
     * Returns a string representation of a mat4
     *
     * @param {ReadonlyMat4} a matrix to represent as a string
     * @returns {String} string representation of the matrix
     */
    export function str(a: ReadonlyMat4): string;
    /**
     * Returns Frobenius norm of a mat4
     *
     * @param {ReadonlyMat4} a the matrix to calculate Frobenius norm of
     * @returns {Number} Frobenius norm
     */
    export function frob(a: ReadonlyMat4): number;
    /**
     * Adds two mat4's
     *
     * @param {Mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the first operand
     * @param {ReadonlyMat4} b the second operand
     * @returns {Mat4} out
     */
    export function add(out: Mat4, a: ReadonlyMat4, b: ReadonlyMat4): Mat4;
    /**
     * Subtracts matrix b from matrix a
     *
     * @param {Mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the first operand
     * @param {ReadonlyMat4} b the second operand
     * @returns {Mat4} out
     */
    export function subtract(out: Mat4, a: ReadonlyMat4, b: ReadonlyMat4): Mat4;
    /**
     * Multiply each element of the matrix by a scalar.
     *
     * @param {Mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the matrix to scale
     * @param {Number} b amount to scale the matrix's elements by
     * @returns {Mat4} out
     */
    export function multiplyScalar(out: Mat4, a: ReadonlyMat4, b: number): Mat4;
    /**
     * Adds two mat4's after multiplying each element of the second operand by a scalar value.
     *
     * @param {Mat4} out the receiving vector
     * @param {ReadonlyMat4} a the first operand
     * @param {ReadonlyMat4} b the second operand
     * @param {Number} scale the amount to scale b's elements by before adding
     * @returns {Mat4} out
     */
    export function multiplyScalarAndAdd(out: Mat4, a: ReadonlyMat4, b: ReadonlyMat4, scale: number): Mat4;
    /**
     * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
     *
     * @param {ReadonlyMat4} a The first matrix.
     * @param {ReadonlyMat4} b The second matrix.
     * @returns {Boolean} True if the matrices are equal, false otherwise.
     */
    export function exactEquals(a: ReadonlyMat4, b: ReadonlyMat4): boolean;
    /**
     * Returns whether or not the matrices have approximately the same elements in the same position.
     *
     * @param {ReadonlyMat4} a The first matrix.
     * @param {ReadonlyMat4} b The second matrix.
     * @returns {Boolean} True if the matrices are equal, false otherwise.
     */
    export function equals(a: ReadonlyMat4, b: ReadonlyMat4): boolean;
    /**
     * Generates a perspective projection matrix with the given bounds.
     * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
     * which matches WebGL/OpenGL's clip volume.
     * Passing null/undefined/no value for far will generate infinite projection matrix.
     *
     * @param {Mat4} out mat4 frustum matrix will be written into
     * @param {number} fovy Vertical field of view in radians
     * @param {number} aspect Aspect ratio. typically viewport width/height
     * @param {number} near Near bound of the frustum
     * @param {number} far Far bound of the frustum, can be null or Infinity
     * @returns {Mat4} out
     */
    export function perspective(out: Mat4, fovy: number, aspect: number, near: number, far: number): Mat4;
    /**
     * Generates a orthogonal projection matrix with the given bounds.
     * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
     * which matches WebGL/OpenGL's clip volume.
     *
     * @param {Mat4} out mat4 frustum matrix will be written into
     * @param {number} left Left bound of the frustum
     * @param {number} right Right bound of the frustum
     * @param {number} bottom Bottom bound of the frustum
     * @param {number} top Top bound of the frustum
     * @param {number} near Near bound of the frustum
     * @param {number} far Far bound of the frustum
     * @returns {Mat4} out
     */
    export function ortho(out: Mat4, left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4;
    /**
     * Multiplies two mat4s
     *
     * @param {Mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the first operand
     * @param {ReadonlyMat4} b the second operand
     * @returns {Mat4} out
     */
    export function mul(out: Mat4, a: ReadonlyMat4, b: ReadonlyMat4): Mat4;
    /**
     * Subtracts matrix b from matrix a
     *
     * @param {Mat4} out the receiving matrix
     * @param {ReadonlyMat4} a the first operand
     * @param {ReadonlyMat4} b the second operand
     * @returns {Mat4} out
     */
    export function sub(out: Mat4, a: ReadonlyMat4, b: ReadonlyMat4): Mat4;
  }
  export module vec3 {
    /**
     * 3 Dimensional Vector
     * @module vec3
     */
    /**
     * Creates a new, empty vec3
     *
     * @returns {Vec3} a new 3D vector
     */
    export function create(): Vec3;
    /**
     * Creates a new vec3 initialized with values from an existing vector
     *
     * @param {ReadonlyVec3} a vector to clone
     * @returns {Vec3} a new 3D vector
     */
    export function clone(a: ReadonlyVec3): Vec3;
    /**
     * Calculates the length of a vec3
     *
     * @param {ReadonlyVec3} a vector to calculate length of
     * @returns {Number} length of a
     */
    export function length(a: ReadonlyVec3): number;
    /**
     * Creates a new vec3 initialized with the given values
     *
     * @param {Number} x X component
     * @param {Number} y Y component
     * @param {Number} z Z component
     * @returns {Vec3} a new 3D vector
     */
    export function fromValues(x: number, y: number, z: number): Vec3;
    /**
     * Copy the values from one vec3 to another
     *
     * @param {Vec3} out the receiving vector
     * @param {ReadonlyVec3} a the source vector
     * @returns {Vec3} out
     */
    export function copy(out: Vec3, a: ReadonlyVec3): Vec3;
    /**
     * Set the components of a vec3 to the given values
     *
     * @param {Vec3} out the receiving vector
     * @param {Number} x X component
     * @param {Number} y Y component
     * @param {Number} z Z component
     * @returns {Vec3} out
     */
    export function set(out: Vec3, x: number, y: number, z: number): Vec3;
    /**
     * Adds two vec3's
     *
     * @param {Vec3} out the receiving vector
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @returns {Vec3} out
     */
    export function add(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3): Vec3;
    /**
     * Subtracts vector b from vector a
     *
     * @param {Vec3} out the receiving vector
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @returns {Vec3} out
     */
    export function subtract(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3): Vec3;
    /**
     * Multiplies two vec3's
     *
     * @param {Vec3} out the receiving vector
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @returns {Vec3} out
     */
    export function multiply(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3): Vec3;
    /**
     * Divides two vec3's
     *
     * @param {Vec3} out the receiving vector
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @returns {Vec3} out
     */
    export function divide(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3): Vec3;
    /**
     * Math.ceil the components of a vec3
     *
     * @param {Vec3} out the receiving vector
     * @param {ReadonlyVec3} a vector to ceil
     * @returns {Vec3} out
     */
    export function ceil(out: Vec3, a: ReadonlyVec3): Vec3;
    /**
     * Math.floor the components of a vec3
     *
     * @param {Vec3} out the receiving vector
     * @param {ReadonlyVec3} a vector to floor
     * @returns {Vec3} out
     */
    export function floor(out: Vec3, a: ReadonlyVec3): Vec3;
    /**
     * Returns the minimum of two vec3's
     *
     * @param {Vec3} out the receiving vector
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @returns {Vec3} out
     */
    export function min(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3): Vec3;
    /**
     * Returns the maximum of two vec3's
     *
     * @param {Vec3} out the receiving vector
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @returns {Vec3} out
     */
    export function max(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3): Vec3;
    /**
     * Math.round the components of a vec3
     *
     * @param {Vec3} out the receiving vector
     * @param {ReadonlyVec3} a vector to round
     * @returns {Vec3} out
     */
    export function round(out: Vec3, a: ReadonlyVec3): Vec3;
    /**
     * Scales a vec3 by a scalar number
     *
     * @param {Vec3} out the receiving vector
     * @param {ReadonlyVec3} a the vector to scale
     * @param {Number} b amount to scale the vector by
     * @returns {Vec3} out
     */
    export function scale(out: Vec3, a: ReadonlyVec3, b: number): Vec3;
    /**
     * Adds two vec3's after scaling the second operand by a scalar value
     *
     * @param {Vec3} out the receiving vector
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @param {Number} scale the amount to scale b by before adding
     * @returns {Vec3} out
     */
    export function scaleAndAdd(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3, scale: number): Vec3;
    /**
     * Calculates the euclidian distance between two vec3's
     *
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @returns {Number} distance between a and b
     */
    export function distance(a: ReadonlyVec3, b: ReadonlyVec3): number;
    /**
     * Calculates the squared euclidian distance between two vec3's
     *
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @returns {Number} squared distance between a and b
     */
    export function squaredDistance(a: ReadonlyVec3, b: ReadonlyVec3): number;
    /**
     * Calculates the squared length of a vec3
     *
     * @param {ReadonlyVec3} a vector to calculate squared length of
     * @returns {Number} squared length of a
     */
    export function squaredLength(a: ReadonlyVec3): number;
    /**
     * Negates the components of a vec3
     *
     * @param {Vec3} out the receiving vector
     * @param {ReadonlyVec3} a vector to negate
     * @returns {Vec3} out
     */
    export function negate(out: Vec3, a: ReadonlyVec3): Vec3;
    /**
     * Returns the inverse of the components of a vec3
     *
     * @param {Vec3} out the receiving vector
     * @param {ReadonlyVec3} a vector to invert
     * @returns {Vec3} out
     */
    export function inverse(out: Vec3, a: ReadonlyVec3): Vec3;
    /**
     * Normalize a vec3
     *
     * @param {Vec3} out the receiving vector
     * @param {ReadonlyVec3} a vector to normalize
     * @returns {Vec3} out
     */
    export function normalize(out: Vec3, a: ReadonlyVec3): Vec3;
    /**
     * Calculates the dot product of two vec3's
     *
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @returns {Number} dot product of a and b
     */
    export function dot(a: ReadonlyVec3, b: ReadonlyVec3): number;
    /**
     * Computes the cross product of two vec3's
     *
     * @param {Vec3} out the receiving vector
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @returns {Vec3} out
     */
    export function cross(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3): Vec3;
    /**
     * Performs a linear interpolation between two vec3's
     *
     * @param {Vec3} out the receiving vector
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @returns {Vec3} out
     */
    export function lerp(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3, t: number): Vec3;
    /**
     * Performs a hermite interpolation with two control points
     *
     * @param {Vec3} out the receiving vector
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @param {ReadonlyVec3} c the third operand
     * @param {ReadonlyVec3} d the fourth operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @returns {Vec3} out
     */
    export function hermite(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3, c: ReadonlyVec3, d: ReadonlyVec3, t: number): Vec3;
    /**
     * Performs a bezier interpolation with two control points
     *
     * @param {Vec3} out the receiving vector
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @param {ReadonlyVec3} c the third operand
     * @param {ReadonlyVec3} d the fourth operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @returns {Vec3} out
     */
    export function bezier(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3, c: ReadonlyVec3, d: ReadonlyVec3, t: number): Vec3;
    /**
     * Generates a random vector with the given scale
     *
     * @param {Vec3} out the receiving vector
     * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
     * @returns {Vec3} out
     */
    export function random(out: Vec3, scale?: number): Vec3;
    /**
     * Transforms the vec3 with a mat4.
     * 4th vector component is implicitly '1'
     *
     * @param {Vec3} out the receiving vector
     * @param {ReadonlyVec3} a the vector to transform
     * @param {ReadonlyMat4} m matrix to transform with
     * @returns {Vec3} out
     */
    export function transformMat4(out: Vec3, a: ReadonlyVec3, m: ReadonlyMat4): Vec3;
    /**
     * Transforms the vec3 with a mat3.
     *
     * @param {Vec3} out the receiving vector
     * @param {ReadonlyVec3} a the vector to transform
     * @param {ReadonlyMat3} m the 3x3 matrix to transform with
     * @returns {Vec3} out
     */
    export function transformMat3(out: Vec3, a: ReadonlyVec3, m: ReadonlyMat3): Vec3;
    /**
     * Transforms the vec3 with a quat
     * Can also be used for dual quaternions. (Multiply it with the real part)
     *
     * @param {Vec3} out the receiving vector
     * @param {ReadonlyVec3} a the vector to transform
     * @param {ReadonlyQuat} q quaternion to transform with
     * @returns {Vec3} out
     */
    export function transformQuat(out: Vec3, a: ReadonlyVec3, q: ReadonlyQuat): Vec3;
    /**
     * Rotate a 3D vector around the x-axis
     * @param {Vec3} out The receiving vec3
     * @param {ReadonlyVec3} a The vec3 point to rotate
     * @param {ReadonlyVec3} b The origin of the rotation
     * @param {Number} rad The angle of rotation in radians
     * @returns {Vec3} out
     */
    export function rotateX(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3, rad: number): Vec3;
    /**
     * Rotate a 3D vector around the y-axis
     * @param {Vec3} out The receiving vec3
     * @param {ReadonlyVec3} a The vec3 point to rotate
     * @param {ReadonlyVec3} b The origin of the rotation
     * @param {Number} rad The angle of rotation in radians
     * @returns {Vec3} out
     */
    export function rotateY(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3, rad: number): Vec3;
    /**
     * Rotate a 3D vector around the z-axis
     * @param {Vec3} out The receiving vec3
     * @param {ReadonlyVec3} a The vec3 point to rotate
     * @param {ReadonlyVec3} b The origin of the rotation
     * @param {Number} rad The angle of rotation in radians
     * @returns {Vec3} out
     */
    export function rotateZ(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3, rad: number): Vec3;
    /**
     * Get the angle between two 3D vectors
     * @param {ReadonlyVec3} a The first operand
     * @param {ReadonlyVec3} b The second operand
     * @returns {Number} The angle in radians
     */
    export function angle(a: ReadonlyVec3, b: ReadonlyVec3): number;
    /**
     * Set the components of a vec3 to zero
     *
     * @param {Vec3} out the receiving vector
     * @returns {Vec3} out
     */
    export function zero(out: Vec3): Vec3;
    /**
     * Returns a string representation of a vector
     *
     * @param {ReadonlyVec3} a vector to represent as a string
     * @returns {String} string representation of the vector
     */
    export function str(a: ReadonlyVec3): string;
    /**
     * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
     *
     * @param {ReadonlyVec3} a The first vector.
     * @param {ReadonlyVec3} b The second vector.
     * @returns {Boolean} True if the vectors are equal, false otherwise.
     */
    export function exactEquals(a: ReadonlyVec3, b: ReadonlyVec3): boolean;
    /**
     * Returns whether or not the vectors have approximately the same elements in the same position.
     *
     * @param {ReadonlyVec3} a The first vector.
     * @param {ReadonlyVec3} b The second vector.
     * @returns {Boolean} True if the vectors are equal, false otherwise.
     */
    export function equals(a: ReadonlyVec3, b: ReadonlyVec3): boolean;
    /**
     * Subtracts vector b from vector a
     *
     * @param {Vec3} out the receiving vector
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @returns {Vec3} out
     */
    export function sub(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3): Vec3;
    /**
     * Multiplies two vec3's
     *
     * @param {Vec3} out the receiving vector
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @returns {Vec3} out
     */
    export function mul(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3): Vec3;
    /**
     * Divides two vec3's
     *
     * @param {Vec3} out the receiving vector
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @returns {Vec3} out
     */
    export function div(out: Vec3, a: ReadonlyVec3, b: ReadonlyVec3): Vec3;
    /**
     * Calculates the euclidian distance between two vec3's
     *
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @returns {Number} distance between a and b
     */
    export function dist(a: ReadonlyVec3, b: ReadonlyVec3): number;
    /**
     * Calculates the squared euclidian distance between two vec3's
     *
     * @param {ReadonlyVec3} a the first operand
     * @param {ReadonlyVec3} b the second operand
     * @returns {Number} squared distance between a and b
     */
    export function sqrDist(a: ReadonlyVec3, b: ReadonlyVec3): number;
    /**
     * Calculates the length of a vec3
     *
     * @param {ReadonlyVec3} a vector to calculate length of
     * @returns {Number} length of a
     */
    export function len(a: ReadonlyVec3): number;
    /**
     * Calculates the squared length of a vec3
     *
     * @param {ReadonlyVec3} a vector to calculate squared length of
     * @returns {Number} squared length of a
     */
    export function sqrLen(a: ReadonlyVec3): number;
    export function forEach(a: any, stride: any, offset: any, count: any, fn: any, arg: any): any;
  }
  export module vec4 {
    /**
     * 4 Dimensional Vector
     * @module vec4
     */
    /**
     * Creates a new, empty vec4
     *
     * @returns {Vec4} a new 4D vector
     */
    export function create(): Vec4;
    /**
     * Creates a new vec4 initialized with values from an existing vector
     *
     * @param {ReadonlyVec4} a vector to clone
     * @returns {Vec4} a new 4D vector
     */
    export function clone(a: ReadonlyVec4): Vec4;
    /**
     * Creates a new vec4 initialized with the given values
     *
     * @param {Number} x X component
     * @param {Number} y Y component
     * @param {Number} z Z component
     * @param {Number} w W component
     * @returns {Vec4} a new 4D vector
     */
    export function fromValues(x: number, y: number, z: number, w: number): Vec4;
    /**
     * Copy the values from one vec4 to another
     *
     * @param {Vec4} out the receiving vector
     * @param {ReadonlyVec4} a the source vector
     * @returns {Vec4} out
     */
    export function copy(out: Vec4, a: ReadonlyVec4): Vec4;
    /**
     * Set the components of a vec4 to the given values
     *
     * @param {Vec4} out the receiving vector
     * @param {Number} x X component
     * @param {Number} y Y component
     * @param {Number} z Z component
     * @param {Number} w W component
     * @returns {Vec4} out
     */
    export function set(out: Vec4, x: number, y: number, z: number, w: number): Vec4;
    /**
     * Adds two vec4's
     *
     * @param {Vec4} out the receiving vector
     * @param {ReadonlyVec4} a the first operand
     * @param {ReadonlyVec4} b the second operand
     * @returns {Vec4} out
     */
    export function add(out: Vec4, a: ReadonlyVec4, b: ReadonlyVec4): Vec4;
    /**
     * Subtracts vector b from vector a
     *
     * @param {Vec4} out the receiving vector
     * @param {ReadonlyVec4} a the first operand
     * @param {ReadonlyVec4} b the second operand
     * @returns {Vec4} out
     */
    export function subtract(out: Vec4, a: ReadonlyVec4, b: ReadonlyVec4): Vec4;
    /**
     * Multiplies two vec4's
     *
     * @param {Vec4} out the receiving vector
     * @param {ReadonlyVec4} a the first operand
     * @param {ReadonlyVec4} b the second operand
     * @returns {Vec4} out
     */
    export function multiply(out: Vec4, a: ReadonlyVec4, b: ReadonlyVec4): Vec4;
    /**
     * Divides two vec4's
     *
     * @param {Vec4} out the receiving vector
     * @param {ReadonlyVec4} a the first operand
     * @param {ReadonlyVec4} b the second operand
     * @returns {Vec4} out
     */
    export function divide(out: Vec4, a: ReadonlyVec4, b: ReadonlyVec4): Vec4;
    /**
     * Math.ceil the components of a vec4
     *
     * @param {Vec4} out the receiving vector
     * @param {ReadonlyVec4} a vector to ceil
     * @returns {Vec4} out
     */
    export function ceil(out: Vec4, a: ReadonlyVec4): Vec4;
    /**
     * Math.floor the components of a vec4
     *
     * @param {Vec4} out the receiving vector
     * @param {ReadonlyVec4} a vector to floor
     * @returns {Vec4} out
     */
    export function floor(out: Vec4, a: ReadonlyVec4): Vec4;
    /**
     * Returns the minimum of two vec4's
     *
     * @param {Vec4} out the receiving vector
     * @param {ReadonlyVec4} a the first operand
     * @param {ReadonlyVec4} b the second operand
     * @returns {Vec4} out
     */
    export function min(out: Vec4, a: ReadonlyVec4, b: ReadonlyVec4): Vec4;
    /**
     * Returns the maximum of two vec4's
     *
     * @param {Vec4} out the receiving vector
     * @param {ReadonlyVec4} a the first operand
     * @param {ReadonlyVec4} b the second operand
     * @returns {Vec4} out
     */
    export function max(out: Vec4, a: ReadonlyVec4, b: ReadonlyVec4): Vec4;
    /**
     * Math.round the components of a vec4
     *
     * @param {Vec4} out the receiving vector
     * @param {ReadonlyVec4} a vector to round
     * @returns {Vec4} out
     */
    export function round(out: Vec4, a: ReadonlyVec4): Vec4;
    /**
     * Scales a vec4 by a scalar number
     *
     * @param {Vec4} out the receiving vector
     * @param {ReadonlyVec4} a the vector to scale
     * @param {Number} b amount to scale the vector by
     * @returns {Vec4} out
     */
    export function scale(out: Vec4, a: ReadonlyVec4, b: number): Vec4;
    /**
     * Adds two vec4's after scaling the second operand by a scalar value
     *
     * @param {Vec4} out the receiving vector
     * @param {ReadonlyVec4} a the first operand
     * @param {ReadonlyVec4} b the second operand
     * @param {Number} scale the amount to scale b by before adding
     * @returns {Vec4} out
     */
    export function scaleAndAdd(out: Vec4, a: ReadonlyVec4, b: ReadonlyVec4, scale: number): Vec4;
    /**
     * Calculates the euclidian distance between two vec4's
     *
     * @param {ReadonlyVec4} a the first operand
     * @param {ReadonlyVec4} b the second operand
     * @returns {Number} distance between a and b
     */
    export function distance(a: ReadonlyVec4, b: ReadonlyVec4): number;
    /**
     * Calculates the squared euclidian distance between two vec4's
     *
     * @param {ReadonlyVec4} a the first operand
     * @param {ReadonlyVec4} b the second operand
     * @returns {Number} squared distance between a and b
     */
    export function squaredDistance(a: ReadonlyVec4, b: ReadonlyVec4): number;
    /**
     * Calculates the length of a vec4
     *
     * @param {ReadonlyVec4} a vector to calculate length of
     * @returns {Number} length of a
     */
    export function length(a: ReadonlyVec4): number;
    /**
     * Calculates the squared length of a vec4
     *
     * @param {ReadonlyVec4} a vector to calculate squared length of
     * @returns {Number} squared length of a
     */
    export function squaredLength(a: ReadonlyVec4): number;
    /**
     * Negates the components of a vec4
     *
     * @param {Vec4} out the receiving vector
     * @param {ReadonlyVec4} a vector to negate
     * @returns {Vec4} out
     */
    export function negate(out: Vec4, a: ReadonlyVec4): Vec4;
    /**
     * Returns the inverse of the components of a vec4
     *
     * @param {Vec4} out the receiving vector
     * @param {ReadonlyVec4} a vector to invert
     * @returns {Vec4} out
     */
    export function inverse(out: Vec4, a: ReadonlyVec4): Vec4;
    /**
     * Normalize a vec4
     *
     * @param {Vec4} out the receiving vector
     * @param {ReadonlyVec4} a vector to normalize
     * @returns {Vec4} out
     */
    export function normalize(out: Vec4, a: ReadonlyVec4): Vec4;
    /**
     * Calculates the dot product of two vec4's
     *
     * @param {ReadonlyVec4} a the first operand
     * @param {ReadonlyVec4} b the second operand
     * @returns {Number} dot product of a and b
     */
    export function dot(a: ReadonlyVec4, b: ReadonlyVec4): number;
    /**
     * Returns the cross-product of three vectors in a 4-dimensional space
     *
     * @param {ReadonlyVec4} result the receiving vector
     * @param {ReadonlyVec4} U the first vector
     * @param {ReadonlyVec4} V the second vector
     * @param {ReadonlyVec4} W the third vector
     * @returns {Vec4} result
     */
    export function cross(out: any, u: any, v: any, w: any): Vec4;
    /**
     * Performs a linear interpolation between two vec4's
     *
     * @param {Vec4} out the receiving vector
     * @param {ReadonlyVec4} a the first operand
     * @param {ReadonlyVec4} b the second operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @returns {Vec4} out
     */
    export function lerp(out: Vec4, a: ReadonlyVec4, b: ReadonlyVec4, t: number): Vec4;
    /**
     * Generates a random vector with the given scale
     *
     * @param {Vec4} out the receiving vector
     * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
     * @returns {Vec4} out
     */
    export function random(out: Vec4, scale?: number): Vec4;
    /**
     * Transforms the vec4 with a mat4.
     *
     * @param {Vec4} out the receiving vector
     * @param {ReadonlyVec4} a the vector to transform
     * @param {ReadonlyMat4} m matrix to transform with
     * @returns {Vec4} out
     */
    export function transformMat4(out: Vec4, a: ReadonlyVec4, m: ReadonlyMat4): Vec4;
    /**
     * Transforms the vec4 with a quat
     *
     * @param {Vec4} out the receiving vector
     * @param {ReadonlyVec4} a the vector to transform
     * @param {ReadonlyQuat} q quaternion to transform with
     * @returns {Vec4} out
     */
    export function transformQuat(out: Vec4, a: ReadonlyVec4, q: ReadonlyQuat): Vec4;
    /**
     * Set the components of a vec4 to zero
     *
     * @param {Vec4} out the receiving vector
     * @returns {Vec4} out
     */
    export function zero(out: Vec4): Vec4;
    /**
     * Returns a string representation of a vector
     *
     * @param {ReadonlyVec4} a vector to represent as a string
     * @returns {String} string representation of the vector
     */
    export function str(a: ReadonlyVec4): string;
    /**
     * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
     *
     * @param {ReadonlyVec4} a The first vector.
     * @param {ReadonlyVec4} b The second vector.
     * @returns {Boolean} True if the vectors are equal, false otherwise.
     */
    export function exactEquals(a: ReadonlyVec4, b: ReadonlyVec4): boolean;
    /**
     * Returns whether or not the vectors have approximately the same elements in the same position.
     *
     * @param {ReadonlyVec4} a The first vector.
     * @param {ReadonlyVec4} b The second vector.
     * @returns {Boolean} True if the vectors are equal, false otherwise.
     */
    export function equals(a: ReadonlyVec4, b: ReadonlyVec4): boolean;
    /**
     * Subtracts vector b from vector a
     *
     * @param {Vec4} out the receiving vector
     * @param {ReadonlyVec4} a the first operand
     * @param {ReadonlyVec4} b the second operand
     * @returns {Vec4} out
     */
    export function sub(out: Vec4, a: ReadonlyVec4, b: ReadonlyVec4): Vec4;
    /**
     * Multiplies two vec4's
     *
     * @param {Vec4} out the receiving vector
     * @param {ReadonlyVec4} a the first operand
     * @param {ReadonlyVec4} b the second operand
     * @returns {Vec4} out
     */
    export function mul(out: Vec4, a: ReadonlyVec4, b: ReadonlyVec4): Vec4;
    /**
     * Divides two vec4's
     *
     * @param {Vec4} out the receiving vector
     * @param {ReadonlyVec4} a the first operand
     * @param {ReadonlyVec4} b the second operand
     * @returns {Vec4} out
     */
    export function div(out: Vec4, a: ReadonlyVec4, b: ReadonlyVec4): Vec4;
    /**
     * Calculates the euclidian distance between two vec4's
     *
     * @param {ReadonlyVec4} a the first operand
     * @param {ReadonlyVec4} b the second operand
     * @returns {Number} distance between a and b
     */
    export function dist(a: ReadonlyVec4, b: ReadonlyVec4): number;
    /**
     * Calculates the squared euclidian distance between two vec4's
     *
     * @param {ReadonlyVec4} a the first operand
     * @param {ReadonlyVec4} b the second operand
     * @returns {Number} squared distance between a and b
     */
    export function sqrDist(a: ReadonlyVec4, b: ReadonlyVec4): number;
    /**
     * Calculates the length of a vec4
     *
     * @param {ReadonlyVec4} a vector to calculate length of
     * @returns {Number} length of a
     */
    export function len(a: ReadonlyVec4): number;
    /**
     * Calculates the squared length of a vec4
     *
     * @param {ReadonlyVec4} a vector to calculate squared length of
     * @returns {Number} squared length of a
     */
    export function sqrLen(a: ReadonlyVec4): number;
    export function forEach(a: any, stride: any, offset: any, count: any, fn: any, arg: any): any;
  }
  export module quat {
    /**
     * Quaternion
     * @module quat
     */
    /**
     * Creates a new identity quat
     *
     * @returns {Quat} a new quaternion
     */
    export function create(): Quat;
    /**
     * Set a quat to the identity quaternion
     *
     * @param {Quat} out the receiving quaternion
     * @returns {Quat} out
     */
    export function identity(out: Quat): Quat;
    /**
     * Sets a quat from the given angle and rotation axis,
     * then returns it.
     *
     * @param {Quat} out the receiving quaternion
     * @param {ReadonlyVec3} axis the axis around which to rotate
     * @param {Number} rad the angle in radians
     * @returns {Quat} out
     **/
    export function setAxisAngle(out: Quat, axis: ReadonlyVec3, rad: number): Quat;
    /**
     * Gets the rotation axis and angle for a given
     *  quaternion. If a quaternion is created with
     *  setAxisAngle, this method will return the same
     *  values as providied in the original parameter list
     *  OR functionally equivalent values.
     * Example: The quaternion formed by axis [0, 0, 1] and
     *  angle -90 is the same as the quaternion formed by
     *  [0, 0, 1] and 270. This method favors the latter.
     * @param  {Vec3} out_axis  Vector receiving the axis of rotation
     * @param  {ReadonlyQuat} q     Quaternion to be decomposed
     * @return {Number}     Angle, in radians, of the rotation
     */
    export function getAxisAngle(out_axis: Vec3, q: ReadonlyQuat): number;
    /**
     * Gets the angular distance between two unit quaternions
     *
     * @param  {ReadonlyQuat} a     Origin unit quaternion
     * @param  {ReadonlyQuat} b     Destination unit quaternion
     * @return {Number}     Angle, in radians, between the two quaternions
     */
    export function getAngle(a: ReadonlyQuat, b: ReadonlyQuat): number;
    /**
     * Multiplies two quat's
     *
     * @param {Quat} out the receiving quaternion
     * @param {ReadonlyQuat} a the first operand
     * @param {ReadonlyQuat} b the second operand
     * @returns {Quat} out
     */
    export function multiply(out: Quat, a: ReadonlyQuat, b: ReadonlyQuat): Quat;
    /**
     * Rotates a quaternion by the given angle about the X axis
     *
     * @param {Quat} out quat receiving operation result
     * @param {ReadonlyQuat} a quat to rotate
     * @param {number} rad angle (in radians) to rotate
     * @returns {Quat} out
     */
    export function rotateX(out: Quat, a: ReadonlyQuat, rad: number): Quat;
    /**
     * Rotates a quaternion by the given angle about the Y axis
     *
     * @param {Quat} out quat receiving operation result
     * @param {ReadonlyQuat} a quat to rotate
     * @param {number} rad angle (in radians) to rotate
     * @returns {Quat} out
     */
    export function rotateY(out: Quat, a: ReadonlyQuat, rad: number): Quat;
    /**
     * Rotates a quaternion by the given angle about the Z axis
     *
     * @param {Quat} out quat receiving operation result
     * @param {ReadonlyQuat} a quat to rotate
     * @param {number} rad angle (in radians) to rotate
     * @returns {Quat} out
     */
    export function rotateZ(out: Quat, a: ReadonlyQuat, rad: number): Quat;
    /**
     * Calculates the W component of a quat from the X, Y, and Z components.
     * Assumes that quaternion is 1 unit in length.
     * Any existing W component will be ignored.
     *
     * @param {Quat} out the receiving quaternion
     * @param {ReadonlyQuat} a quat to calculate W component of
     * @returns {Quat} out
     */
    export function calculateW(out: Quat, a: ReadonlyQuat): Quat;
    /**
     * Calculate the exponential of a unit quaternion.
     *
     * @param {Quat} out the receiving quaternion
     * @param {ReadonlyQuat} a quat to calculate the exponential of
     * @returns {Quat} out
     */
    export function exp(out: Quat, a: ReadonlyQuat): Quat;
    /**
     * Calculate the natural logarithm of a unit quaternion.
     *
     * @param {Quat} out the receiving quaternion
     * @param {ReadonlyQuat} a quat to calculate the exponential of
     * @returns {Quat} out
     */
    export function ln(out: Quat, a: ReadonlyQuat): Quat;
    /**
     * Calculate the scalar power of a unit quaternion.
     *
     * @param {Quat} out the receiving quaternion
     * @param {ReadonlyQuat} a quat to calculate the exponential of
     * @param {Number} b amount to scale the quaternion by
     * @returns {Quat} out
     */
    export function pow(out: Quat, a: ReadonlyQuat, b: number): Quat;
    /**
     * Performs a spherical linear interpolation between two quat
     *
     * @param {Quat} out the receiving quaternion
     * @param {ReadonlyQuat} a the first operand
     * @param {ReadonlyQuat} b the second operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @returns {Quat} out
     */
    export function slerp(out: Quat, a: ReadonlyQuat, b: ReadonlyQuat, t: number): Quat;
    /**
     * Generates a random unit quaternion
     *
     * @param {Quat} out the receiving quaternion
     * @returns {Quat} out
     */
    export function random(out: Quat): Quat;
    /**
     * Calculates the inverse of a quat
     *
     * @param {Quat} out the receiving quaternion
     * @param {ReadonlyQuat} a quat to calculate inverse of
     * @returns {Quat} out
     */
    export function invert(out: Quat, a: ReadonlyQuat): Quat;
    /**
     * Calculates the conjugate of a quat
     * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
     *
     * @param {Quat} out the receiving quaternion
     * @param {ReadonlyQuat} a quat to calculate conjugate of
     * @returns {Quat} out
     */
    export function conjugate(out: Quat, a: ReadonlyQuat): Quat;
    /**
     * Creates a quaternion from the given 3x3 rotation matrix.
     *
     * NOTE: The resultant quaternion is not normalized, so you should be sure
     * to renormalize the quaternion yourself where necessary.
     *
     * @param {Quat} out the receiving quaternion
     * @param {ReadonlyMat3} m rotation matrix
     * @returns {Quat} out
     * @function
     */
    export function fromMat3(out: Quat, m: ReadonlyMat3): Quat;
    /**
     * Creates a quaternion from the given euler angle x, y, z.
     *
     * @param {Quat} out the receiving quaternion
     * @param {x} Angle to rotate around X axis in degrees.
     * @param {y} Angle to rotate around Y axis in degrees.
     * @param {z} Angle to rotate around Z axis in degrees.
     * @returns {Quat} out
     * @function
     */
    export function fromEuler(out: Quat, x: any, y: any, z: any): Quat;
    /**
     * Returns a string representation of a quatenion
     *
     * @param {ReadonlyQuat} a vector to represent as a string
     * @returns {String} string representation of the vector
     */
    export function str(a: ReadonlyQuat): string;
    /**
     * Creates a new quat initialized with values from an existing quaternion
     *
     * @param {ReadonlyQuat} a quaternion to clone
     * @returns {Quat} a new quaternion
     * @function
     */
    export const clone: typeof vec4.clone;
    /**
     * Creates a new quat initialized with the given values
     *
     * @param {Number} x X component
     * @param {Number} y Y component
     * @param {Number} z Z component
     * @param {Number} w W component
     * @returns {Quat} a new quaternion
     * @function
     */
    export const fromValues: typeof vec4.fromValues;
    /**
     * Copy the values from one quat to another
     *
     * @param {Quat} out the receiving quaternion
     * @param {ReadonlyQuat} a the source quaternion
     * @returns {Quat} out
     * @function
     */
    export const copy: typeof vec4.copy;
    /**
     * Set the components of a quat to the given values
     *
     * @param {Quat} out the receiving quaternion
     * @param {Number} x X component
     * @param {Number} y Y component
     * @param {Number} z Z component
     * @param {Number} w W component
     * @returns {Quat} out
     * @function
     */
    export const set: typeof vec4.set;
    /**
     * Adds two quat's
     *
     * @param {Quat} out the receiving quaternion
     * @param {ReadonlyQuat} a the first operand
     * @param {ReadonlyQuat} b the second operand
     * @returns {Quat} out
     * @function
     */
    export const add: typeof vec4.add;
    /**
     * Multiplies two quat's
     *
     * @param {Quat} out the receiving quaternion
     * @param {ReadonlyQuat} a the first operand
     * @param {ReadonlyQuat} b the second operand
     * @returns {Quat} out
     */
    export function mul(out: Quat, a: ReadonlyQuat, b: ReadonlyQuat): Quat;
    /**
     * Scales a quat by a scalar number
     *
     * @param {Quat} out the receiving vector
     * @param {ReadonlyQuat} a the vector to scale
     * @param {Number} b amount to scale the vector by
     * @returns {Quat} out
     * @function
     */
    export const scale: typeof vec4.scale;
    /**
     * Calculates the dot product of two quat's
     *
     * @param {ReadonlyQuat} a the first operand
     * @param {ReadonlyQuat} b the second operand
     * @returns {Number} dot product of a and b
     * @function
     */
    export const dot: typeof vec4.dot;
    /**
     * Performs a linear interpolation between two quat's
     *
     * @param {Quat} out the receiving quaternion
     * @param {ReadonlyQuat} a the first operand
     * @param {ReadonlyQuat} b the second operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @returns {Quat} out
     * @function
     */
    export const lerp: typeof vec4.lerp;
    /**
     * Calculates the length of a quat
     *
     * @param {ReadonlyQuat} a vector to calculate length of
     * @returns {Number} length of a
     */
    export const length: typeof vec4.length;
    /**
     * Alias for {@link quat.length}
     * @function
     */
    export const len: typeof vec4.length;
    /**
     * Calculates the squared length of a quat
     *
     * @param {ReadonlyQuat} a vector to calculate squared length of
     * @returns {Number} squared length of a
     * @function
     */
    export const squaredLength: typeof vec4.squaredLength;
    /**
     * Alias for {@link quat.squaredLength}
     * @function
     */
    export const sqrLen: typeof vec4.squaredLength;
    /**
     * Normalize a quat
     *
     * @param {Quat} out the receiving quaternion
     * @param {ReadonlyQuat} a quaternion to normalize
     * @returns {Quat} out
     * @function
     */
    export const normalize: typeof vec4.normalize;
    /**
     * Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)
     *
     * @param {ReadonlyQuat} a The first quaternion.
     * @param {ReadonlyQuat} b The second quaternion.
     * @returns {Boolean} True if the vectors are equal, false otherwise.
     */
    export const exactEquals: typeof vec4.exactEquals;
    /**
     * Returns whether or not the quaternions have approximately the same elements in the same position.
     *
     * @param {ReadonlyQuat} a The first vector.
     * @param {ReadonlyQuat} b The second vector.
     * @returns {Boolean} True if the vectors are equal, false otherwise.
     */
    export const equals: typeof vec4.equals;
    export function rotationTo(out: any, a: any, b: any): any;
    export function sqlerp(out: any, a: any, b: any, c: any, d: any, t: any): any;
    export function setAxes(out: any, view: any, right: any, up: any): Vec4;

  }
  export module quat2 {
    /**
     * Dual Quaternion<br>
     * Format: [real, dual]<br>
     * Quaternion format: XYZW<br>
     * Make sure to have normalized dual quaternions, otherwise the functions may not work as intended.<br>
     * @module quat2
     */
    /**
     * Creates a new identity dual quat
     *
     * @returns {Quat2} a new dual quaternion [real -> rotation, dual -> translation]
     */
    export function create(): Quat2;
    /**
     * Creates a new quat initialized with values from an existing quaternion
     *
     * @param {ReadonlyQuat2} a dual quaternion to clone
     * @returns {Quat2} new dual quaternion
     * @function
     */
    export function clone(a: ReadonlyQuat2): Quat2;
    /**
     * Creates a new dual quat initialized with the given values
     *
     * @param {Number} x1 X component
     * @param {Number} y1 Y component
     * @param {Number} z1 Z component
     * @param {Number} w1 W component
     * @param {Number} x2 X component
     * @param {Number} y2 Y component
     * @param {Number} z2 Z component
     * @param {Number} w2 W component
     * @returns {Quat2} new dual quaternion
     * @function
     */
    export function fromValues(x1: number, y1: number, z1: number, w1: number, x2: number, y2: number, z2: number, w2: number): Quat2;
    /**
     * Creates a new dual quat from the given values (quat and translation)
     *
     * @param {Number} x1 X component
     * @param {Number} y1 Y component
     * @param {Number} z1 Z component
     * @param {Number} w1 W component
     * @param {Number} x2 X component (translation)
     * @param {Number} y2 Y component (translation)
     * @param {Number} z2 Z component (translation)
     * @returns {Quat2} new dual quaternion
     * @function
     */
    export function fromRotationTranslationValues(x1: number, y1: number, z1: number, w1: number, x2: number, y2: number, z2: number): Quat2;
    /**
     * Creates a dual quat from a quaternion and a translation
     *
     * @param {ReadonlyQuat2} dual quaternion receiving operation result
     * @param {ReadonlyQuat} q a normalized quaternion
     * @param {ReadonlyVec3} t tranlation vector
     * @returns {Quat2} dual quaternion receiving operation result
     * @function
     */
    export function fromRotationTranslation(out: any, q: ReadonlyQuat, t: ReadonlyVec3): Quat2;
    /**
     * Creates a dual quat from a translation
     *
     * @param {ReadonlyQuat2} dual quaternion receiving operation result
     * @param {ReadonlyVec3} t translation vector
     * @returns {Quat2} dual quaternion receiving operation result
     * @function
     */
    export function fromTranslation(out: any, t: ReadonlyVec3): Quat2;
    /**
     * Creates a dual quat from a quaternion
     *
     * @param {ReadonlyQuat2} dual quaternion receiving operation result
     * @param {ReadonlyQuat} q the quaternion
     * @returns {Quat2} dual quaternion receiving operation result
     * @function
     */
    export function fromRotation(out: any, q: ReadonlyQuat): Quat2;
    /**
     * Creates a new dual quat from a matrix (4x4)
     *
     * @param {Quat2} out the dual quaternion
     * @param {ReadonlyMat4} a the matrix
     * @returns {Quat2} dual quat receiving operation result
     * @function
     */
    export function fromMat4(out: Quat2, a: ReadonlyMat4): Quat2;
    /**
     * Copy the values from one dual quat to another
     *
     * @param {Quat2} out the receiving dual quaternion
     * @param {ReadonlyQuat2} a the source dual quaternion
     * @returns {Quat2} out
     * @function
     */
    export function copy(out: Quat2, a: ReadonlyQuat2): Quat2;
    /**
     * Set a dual quat to the identity dual quaternion
     *
     * @param {Quat2} out the receiving quaternion
     * @returns {Quat2} out
     */
    export function identity(out: Quat2): Quat2;
    /**
     * Set the components of a dual quat to the given values
     *
     * @param {Quat2} out the receiving quaternion
     * @param {Number} x1 X component
     * @param {Number} y1 Y component
     * @param {Number} z1 Z component
     * @param {Number} w1 W component
     * @param {Number} x2 X component
     * @param {Number} y2 Y component
     * @param {Number} z2 Z component
     * @param {Number} w2 W component
     * @returns {Quat2} out
     * @function
     */
    export function set(out: Quat2, x1: number, y1: number, z1: number, w1: number, x2: number, y2: number, z2: number, w2: number): Quat2;
    /**
     * Gets the dual part of a dual quat
     * @param  {Quat} out dual part
     * @param  {ReadonlyQuat2} a Dual Quaternion
     * @return {Quat} dual part
     */
    export function getDual(out: Quat, a: ReadonlyQuat2): Quat;
    /**
     * Set the dual component of a dual quat to the given quaternion
     *
     * @param {Quat2} out the receiving quaternion
     * @param {ReadonlyQuat} q a quaternion representing the dual part
     * @returns {Quat2} out
     * @function
     */
    export function setDual(out: Quat2, q: ReadonlyQuat): Quat2;
    /**
     * Gets the translation of a normalized dual quat
     * @param  {Vec3} out translation
     * @param  {ReadonlyQuat2} a Dual Quaternion to be decomposed
     * @return {Vec3} translation
     */
    export function getTranslation(out: Vec3, a: ReadonlyQuat2): Vec3;
    /**
     * Translates a dual quat by the given vector
     *
     * @param {Quat2} out the receiving dual quaternion
     * @param {ReadonlyQuat2} a the dual quaternion to translate
     * @param {ReadonlyVec3} v vector to translate by
     * @returns {Quat2} out
     */
    export function translate(out: Quat2, a: ReadonlyQuat2, v: ReadonlyVec3): Quat2;
    /**
     * Rotates a dual quat around the X axis
     *
     * @param {Quat2} out the receiving dual quaternion
     * @param {ReadonlyQuat2} a the dual quaternion to rotate
     * @param {number} rad how far should the rotation be
     * @returns {Quat2} out
     */
    export function rotateX(out: Quat2, a: ReadonlyQuat2, rad: number): Quat2;
    /**
     * Rotates a dual quat around the Y axis
     *
     * @param {Quat2} out the receiving dual quaternion
     * @param {ReadonlyQuat2} a the dual quaternion to rotate
     * @param {number} rad how far should the rotation be
     * @returns {Quat2} out
     */
    export function rotateY(out: Quat2, a: ReadonlyQuat2, rad: number): Quat2;
    /**
     * Rotates a dual quat around the Z axis
     *
     * @param {Quat2} out the receiving dual quaternion
     * @param {ReadonlyQuat2} a the dual quaternion to rotate
     * @param {number} rad how far should the rotation be
     * @returns {Quat2} out
     */
    export function rotateZ(out: Quat2, a: ReadonlyQuat2, rad: number): Quat2;
    /**
     * Rotates a dual quat by a given quaternion (a * q)
     *
     * @param {Quat2} out the receiving dual quaternion
     * @param {ReadonlyQuat2} a the dual quaternion to rotate
     * @param {ReadonlyQuat} q quaternion to rotate by
     * @returns {Quat2} out
     */
    export function rotateByQuatAppend(out: Quat2, a: ReadonlyQuat2, q: ReadonlyQuat): Quat2;
    /**
     * Rotates a dual quat by a given quaternion (q * a)
     *
     * @param {Quat2} out the receiving dual quaternion
     * @param {ReadonlyQuat} q quaternion to rotate by
     * @param {ReadonlyQuat2} a the dual quaternion to rotate
     * @returns {Quat2} out
     */
    export function rotateByQuatPrepend(out: Quat2, q: ReadonlyQuat, a: ReadonlyQuat2): Quat2;
    /**
     * Rotates a dual quat around a given axis. Does the normalisation automatically
     *
     * @param {Quat2} out the receiving dual quaternion
     * @param {ReadonlyQuat2} a the dual quaternion to rotate
     * @param {ReadonlyVec3} axis the axis to rotate around
     * @param {Number} rad how far the rotation should be
     * @returns {Quat2} out
     */
    export function rotateAroundAxis(out: Quat2, a: ReadonlyQuat2, axis: ReadonlyVec3, rad: number): Quat2;
    /**
     * Adds two dual quat's
     *
     * @param {Quat2} out the receiving dual quaternion
     * @param {ReadonlyQuat2} a the first operand
     * @param {ReadonlyQuat2} b the second operand
     * @returns {Quat2} out
     * @function
     */
    export function add(out: Quat2, a: ReadonlyQuat2, b: ReadonlyQuat2): Quat2;
    /**
     * Multiplies two dual quat's
     *
     * @param {Quat2} out the receiving dual quaternion
     * @param {ReadonlyQuat2} a the first operand
     * @param {ReadonlyQuat2} b the second operand
     * @returns {Quat2} out
     */
    export function multiply(out: Quat2, a: ReadonlyQuat2, b: ReadonlyQuat2): Quat2;
    /**
     * Scales a dual quat by a scalar number
     *
     * @param {Quat2} out the receiving dual quat
     * @param {ReadonlyQuat2} a the dual quat to scale
     * @param {Number} b amount to scale the dual quat by
     * @returns {Quat2} out
     * @function
     */
    export function scale(out: Quat2, a: ReadonlyQuat2, b: number): Quat2;
    /**
     * Performs a linear interpolation between two dual quats's
     * NOTE: The resulting dual quaternions won't always be normalized (The error is most noticeable when t = 0.5)
     *
     * @param {Quat2} out the receiving dual quat
     * @param {ReadonlyQuat2} a the first operand
     * @param {ReadonlyQuat2} b the second operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @returns {Quat2} out
     */
    export function lerp(out: Quat2, a: ReadonlyQuat2, b: ReadonlyQuat2, t: number): Quat2;
    /**
     * Calculates the inverse of a dual quat. If they are normalized, conjugate is cheaper
     *
     * @param {Quat2} out the receiving dual quaternion
     * @param {ReadonlyQuat2} a dual quat to calculate inverse of
     * @returns {Quat2} out
     */
    export function invert(out: Quat2, a: ReadonlyQuat2): Quat2;
    /**
     * Calculates the conjugate of a dual quat
     * If the dual quaternion is normalized, this function is faster than quat2.inverse and produces the same result.
     *
     * @param {Quat2} out the receiving quaternion
     * @param {ReadonlyQuat2} a quat to calculate conjugate of
     * @returns {Quat2} out
     */
    export function conjugate(out: Quat2, a: ReadonlyQuat2): Quat2;
    /**
     * Normalize a dual quat
     *
     * @param {Quat2} out the receiving dual quaternion
     * @param {ReadonlyQuat2} a dual quaternion to normalize
     * @returns {Quat2} out
     * @function
     */
    export function normalize(out: Quat2, a: ReadonlyQuat2): Quat2;
    /**
     * Returns a string representation of a dual quatenion
     *
     * @param {ReadonlyQuat2} a dual quaternion to represent as a string
     * @returns {String} string representation of the dual quat
     */
    export function str(a: ReadonlyQuat2): string;
    /**
     * Returns whether or not the dual quaternions have exactly the same elements in the same position (when compared with ===)
     *
     * @param {ReadonlyQuat2} a the first dual quaternion.
     * @param {ReadonlyQuat2} b the second dual quaternion.
     * @returns {Boolean} true if the dual quaternions are equal, false otherwise.
     */
    export function exactEquals(a: ReadonlyQuat2, b: ReadonlyQuat2): boolean;
    /**
     * Returns whether or not the dual quaternions have approximately the same elements in the same position.
     *
     * @param {ReadonlyQuat2} a the first dual quat.
     * @param {ReadonlyQuat2} b the second dual quat.
     * @returns {Boolean} true if the dual quats are equal, false otherwise.
     */
    export function equals(a: ReadonlyQuat2, b: ReadonlyQuat2): boolean;
    /**
     * Gets the real part of a dual quat
     * @param  {Quat} out real part
     * @param  {ReadonlyQuat2} a Dual Quaternion
     * @return {Quat} real part
     */
    export const getReal: typeof vec4.copy;
    /**
     * Set the real component of a dual quat to the given quaternion
     *
     * @param {Quat2} out the receiving quaternion
     * @param {ReadonlyQuat} q a quaternion representing the real part
     * @returns {Quat2} out
     * @function
     */
    export const setReal: typeof vec4.copy;
    /**
     * Multiplies two dual quat's
     *
     * @param {Quat2} out the receiving dual quaternion
     * @param {ReadonlyQuat2} a the first operand
     * @param {ReadonlyQuat2} b the second operand
     * @returns {Quat2} out
     */
    export function mul(out: Quat2, a: ReadonlyQuat2, b: ReadonlyQuat2): Quat2;
    /**
     * Calculates the dot product of two dual quat's (The dot product of the real parts)
     *
     * @param {ReadonlyQuat2} a the first operand
     * @param {ReadonlyQuat2} b the second operand
     * @returns {Number} dot product of a and b
     * @function
     */
    export const dot: typeof vec4.dot;
    /**
     * Calculates the length of a dual quat
     *
     * @param {ReadonlyQuat2} a dual quat to calculate length of
     * @returns {Number} length of a
     * @function
     */
    export const length: typeof vec4.length;
    /**
     * Alias for {@link quat2.length}
     * @function
     */
    export const len: typeof vec4.length;
    /**
     * Calculates the squared length of a dual quat
     *
     * @param {ReadonlyQuat2} a dual quat to calculate squared length of
     * @returns {Number} squared length of a
     * @function
     */
    export const squaredLength: typeof vec4.squaredLength;
    /**
     * Alias for {@link quat2.squaredLength}
     * @function
     */
    export const sqrLen: typeof vec4.squaredLength;
  }
  export module vec2 {
    /**
     * 2 Dimensional Vector
     * @module vec2
     */
    /**
     * Creates a new, empty vec2
     *
     * @returns {Vec2} a new 2D vector
     */
    export function create(): Vec2;
    /**
     * Creates a new vec2 initialized with values from an existing vector
     *
     * @param {ReadonlyVec2} a vector to clone
     * @returns {Vec2} a new 2D vector
     */
    export function clone(a: ReadonlyVec2): Vec2;
    /**
     * Creates a new vec2 initialized with the given values
     *
     * @param {Number} x X component
     * @param {Number} y Y component
     * @returns {Vec2} a new 2D vector
     */
    export function fromValues(x: number, y: number): Vec2;
    /**
     * Copy the values from one vec2 to another
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the source vector
     * @returns {Vec2} out
     */
    export function copy(out: Vec2, a: ReadonlyVec2): Vec2;
    /**
     * Set the components of a vec2 to the given values
     *
     * @param {Vec2} out the receiving vector
     * @param {Number} x X component
     * @param {Number} y Y component
     * @returns {Vec2} out
     */
    export function set(out: Vec2, x: number, y: number): Vec2;
    /**
     * Adds two vec2's
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Vec2} out
     */
    export function add(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2): Vec2;
    /**
     * Subtracts vector b from vector a
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Vec2} out
     */
    export function subtract(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2): Vec2;
    /**
     * Multiplies two vec2's
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Vec2} out
     */
    export function multiply(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2): Vec2;
    /**
     * Divides two vec2's
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Vec2} out
     */
    export function divide(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2): Vec2;
    /**
     * Math.ceil the components of a vec2
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a vector to ceil
     * @returns {Vec2} out
     */
    export function ceil(out: Vec2, a: ReadonlyVec2): Vec2;
    /**
     * Math.floor the components of a vec2
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a vector to floor
     * @returns {Vec2} out
     */
    export function floor(out: Vec2, a: ReadonlyVec2): Vec2;
    /**
     * Returns the minimum of two vec2's
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Vec2} out
     */
    export function min(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2): Vec2;
    /**
     * Returns the maximum of two vec2's
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Vec2} out
     */
    export function max(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2): Vec2;
    /**
     * Math.round the components of a vec2
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a vector to round
     * @returns {Vec2} out
     */
    export function round(out: Vec2, a: ReadonlyVec2): Vec2;
    /**
     * Scales a vec2 by a scalar number
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the vector to scale
     * @param {Number} b amount to scale the vector by
     * @returns {Vec2} out
     */
    export function scale(out: Vec2, a: ReadonlyVec2, b: number): Vec2;
    /**
     * Adds two vec2's after scaling the second operand by a scalar value
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @param {Number} scale the amount to scale b by before adding
     * @returns {Vec2} out
     */
    export function scaleAndAdd(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2, scale: number): Vec2;
    /**
     * Calculates the euclidian distance between two vec2's
     *
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Number} distance between a and b
     */
    export function distance(a: ReadonlyVec2, b: ReadonlyVec2): number;
    /**
     * Calculates the squared euclidian distance between two vec2's
     *
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Number} squared distance between a and b
     */
    export function squaredDistance(a: ReadonlyVec2, b: ReadonlyVec2): number;
    /**
     * Calculates the length of a vec2
     *
     * @param {ReadonlyVec2} a vector to calculate length of
     * @returns {Number} length of a
     */
    export function length(a: ReadonlyVec2): number;
    /**
     * Calculates the squared length of a vec2
     *
     * @param {ReadonlyVec2} a vector to calculate squared length of
     * @returns {Number} squared length of a
     */
    export function squaredLength(a: ReadonlyVec2): number;
    /**
     * Negates the components of a vec2
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a vector to negate
     * @returns {Vec2} out
     */
    export function negate(out: Vec2, a: ReadonlyVec2): Vec2;
    /**
     * Returns the inverse of the components of a vec2
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a vector to invert
     * @returns {Vec2} out
     */
    export function inverse(out: Vec2, a: ReadonlyVec2): Vec2;
    /**
     * Normalize a vec2
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a vector to normalize
     * @returns {Vec2} out
     */
    export function normalize(out: Vec2, a: ReadonlyVec2): Vec2;
    /**
     * Calculates the dot product of two vec2's
     *
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Number} dot product of a and b
     */
    export function dot(a: ReadonlyVec2, b: ReadonlyVec2): number;
    /**
     * Computes the cross product of two vec2's
     * Note that the cross product must by definition produce a 3D vector
     *
     * @param {Vec3} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Vec3} out
     */
    export function cross(out: Vec3, a: ReadonlyVec2, b: ReadonlyVec2): Vec3;
    /**
     * Performs a linear interpolation between two vec2's
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
     * @returns {Vec2} out
     */
    export function lerp(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2, t: number): Vec2;
    /**
     * Generates a random vector with the given scale
     *
     * @param {Vec2} out the receiving vector
     * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
     * @returns {Vec2} out
     */
    export function random(out: Vec2, scale?: number): Vec2;
    /**
     * Transforms the vec2 with a mat2
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the vector to transform
     * @param {ReadonlyMat2} m matrix to transform with
     * @returns {Vec2} out
     */
    export function transformMat2(out: Vec2, a: ReadonlyVec2, m: ReadonlyMat2): Vec2;
    /**
     * Transforms the vec2 with a mat2d
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the vector to transform
     * @param {ReadonlyMat2d} m matrix to transform with
     * @returns {Vec2} out
     */
    export function transformMat2d(out: Vec2, a: ReadonlyVec2, m: ReadonlyMat2d): Vec2;
    /**
     * Transforms the vec2 with a mat3
     * 3rd vector component is implicitly '1'
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the vector to transform
     * @param {ReadonlyMat3} m matrix to transform with
     * @returns {Vec2} out
     */
    export function transformMat3(out: Vec2, a: ReadonlyVec2, m: ReadonlyMat3): Vec2;
    /**
     * Transforms the vec2 with a mat4
     * 3rd vector component is implicitly '0'
     * 4th vector component is implicitly '1'
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the vector to transform
     * @param {ReadonlyMat4} m matrix to transform with
     * @returns {Vec2} out
     */
    export function transformMat4(out: Vec2, a: ReadonlyVec2, m: ReadonlyMat4): Vec2;
    /**
     * Rotate a 2D vector
     * @param {Vec2} out The receiving vec2
     * @param {ReadonlyVec2} a The vec2 point to rotate
     * @param {ReadonlyVec2} b The origin of the rotation
     * @param {Number} rad The angle of rotation in radians
     * @returns {Vec2} out
     */
    export function rotate(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2, rad: number): Vec2;
    /**
     * Get the angle between two 2D vectors
     * @param {ReadonlyVec2} a The first operand
     * @param {ReadonlyVec2} b The second operand
     * @returns {Number} The angle in radians
     */
    export function angle(a: ReadonlyVec2, b: ReadonlyVec2): number;
    /**
     * Set the components of a vec2 to zero
     *
     * @param {Vec2} out the receiving vector
     * @returns {Vec2} out
     */
    export function zero(out: Vec2): Vec2;
    /**
     * Returns a string representation of a vector
     *
     * @param {ReadonlyVec2} a vector to represent as a string
     * @returns {String} string representation of the vector
     */
    export function str(a: ReadonlyVec2): string;
    /**
     * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
     *
     * @param {ReadonlyVec2} a The first vector.
     * @param {ReadonlyVec2} b The second vector.
     * @returns {Boolean} True if the vectors are equal, false otherwise.
     */
    export function exactEquals(a: ReadonlyVec2, b: ReadonlyVec2): boolean;
    /**
     * Returns whether or not the vectors have approximately the same elements in the same position.
     *
     * @param {ReadonlyVec2} a The first vector.
     * @param {ReadonlyVec2} b The second vector.
     * @returns {Boolean} True if the vectors are equal, false otherwise.
     */
    export function equals(a: ReadonlyVec2, b: ReadonlyVec2): boolean;
    /**
     * Calculates the length of a vec2
     *
     * @param {ReadonlyVec2} a vector to calculate length of
     * @returns {Number} length of a
     */
    export function len(a: ReadonlyVec2): number;
    /**
     * Subtracts vector b from vector a
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Vec2} out
     */
    export function sub(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2): Vec2;
    /**
     * Multiplies two vec2's
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Vec2} out
     */
    export function mul(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2): Vec2;
    /**
     * Divides two vec2's
     *
     * @param {Vec2} out the receiving vector
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Vec2} out
     */
    export function div(out: Vec2, a: ReadonlyVec2, b: ReadonlyVec2): Vec2;
    /**
     * Calculates the euclidian distance between two vec2's
     *
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Number} distance between a and b
     */
    export function dist(a: ReadonlyVec2, b: ReadonlyVec2): number;
    /**
     * Calculates the squared euclidian distance between two vec2's
     *
     * @param {ReadonlyVec2} a the first operand
     * @param {ReadonlyVec2} b the second operand
     * @returns {Number} squared distance between a and b
     */
    export function sqrDist(a: ReadonlyVec2, b: ReadonlyVec2): number;
    /**
     * Calculates the squared length of a vec2
     *
     * @param {ReadonlyVec2} a vector to calculate squared length of
     * @returns {Number} squared length of a
     */
    export function sqrLen(a: ReadonlyVec2): number;
    export function forEach(a: any, stride: any, offset: any, count: any, fn: any, arg: any): any;
  }


}

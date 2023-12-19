import { __shl_v, __shr_v } from './bitwise';
import { __BITS, __HALF_BITS, __HALF_RADIX, __HALF_WORD_MASK, __WORD_MASK} from './constants';
import { __Vector } from './vector';

/////   WORD ARITHMETIC   //////

// @ts-ignore: decorator
@global
let __CARRY: u8;

// @ts-ignore: decorator
@inline
export function __add_w_w(x: u64, y: u64): u64 {
    const sum = x + y;

    __CARRY = sum < x ? 1 : 0;

	return sum;
}

// @ts-ignore: decorator
@inline
export function __add_w_w_w(x: u64, y: u64, z: u64): u64 {
    let sum = x + y;
	let carry: u8 = sum < x ? 1 : 0;

    sum += z;

    __CARRY = sum < z ? carry + 1 : carry;

	return sum;
}

// @ts-ignore: decorator
@global
let __BORROW: u8;

// @ts-ignore: decorator
@inline
export function __sub_w_w(x: u64, y: u64): u64 {
    let diff = x - y;

	__BORROW = diff > x ? 1 : 0;

	return diff;
}

// @ts-ignore: decorator
@inline
export function __sub_w_w_w(x: u64, y: u64, z: u64): u64 {
    let diff = x - y;

	__BORROW = diff > x
		? diff < z ? 2 : 1
		: diff < z ? 1 : 0;

	return diff - z;
}

// @ts-ignore: decorator
@global
let __HIGH: u64;

// @ts-ignore: decorator
@inline
export function __mul_hh_w(x1: u64, x0: u64, y: u64): u64 {
	const y1 = y >> __HALF_BITS;
    const y0 = y & __HALF_WORD_MASK;

	const m1 = x0 * y1;
	const m2 = x1 * y0;

	let t = (x0 * y0);
	let l = t + (m1 << __HALF_BITS);

	let k = l < t ? 1 : 0;

	t = m2 << __HALF_BITS;
	l += t;

	__HIGH = (l < t ? k + 1 : k) + (m1 >> __HALF_BITS) + (m2 >> __HALF_BITS) + (x1 * y1);

	return l;
}

// @ts-ignore: decorator
@inline
export function __mulGreaterThan_w_w_ww(x: u64, y: u64, z1: u64, z0: u64): boolean {
    const w0 = __mul_hh_w(x >> __HALF_BITS, x & __HALF_WORD_MASK, y);

    return __HIGH > z1 || (__HIGH == z1 && w0 > z0);
}

// @ts-ignore: decorator
@global
let __REMAINDER: u64;

// @ts-ignore: decorator
@inline
export function __div_ww_w(x1: u64, x0: u64, y: u64): u64 {
	if (y == 0) {
		throw new Error('Division by zero');
	}

	if (y <= x1) {
		throw new Error('Quotient overflow');
	}

	const s = clz(y);

	if (s != 0) {
		x1 = x1 << s | x0 >> (__BITS - s);
		x0 <<= s;
		y <<= s;
	}

	const vn1 = y >> __HALF_BITS;
	const vn0 = y & __HALF_WORD_MASK;
	const un1 = x0 >> __HALF_BITS;
	const un0 = x0 & __HALF_WORD_MASK;

	let q1 = x1 / vn1;
	let rhat = x1 % vn1;

	for (; q1 >= __HALF_RADIX || q1 * vn0 > rhat * __HALF_RADIX + un1;) {
		q1--;
		rhat += vn1;

		if (rhat >= __HALF_RADIX) {
			break;
		}
	}

	const un21 = x1 * __HALF_RADIX + un1 - q1 * y;

	let q0 = un21 / vn1;

	rhat = un21 % vn1;

	for (; q0 >= __HALF_RADIX || q0 * vn0 > rhat * __HALF_RADIX + un0;) {
		q0--;
		rhat += vn1;

		if (rhat >= __HALF_RADIX) {
			break;
		}
	}

    __REMAINDER = (un21 * __HALF_RADIX + un0 - q0 * y) >> s;

	return q1 * __HALF_RADIX + q0;
}


/////   VECTOR-WORD ARITHMETIC   /////

// @ts-ignore
@inline
export function __add_v_w(u: __Vector, v: u64, w: __Vector, n: i32): void {
	for (let j = 0; j < n; j++) {
		w[j] = __add_w_w(u[j], v);
		v = __CARRY;
	}

	w[n] = v;
}

// @ts-ignore: decorator
@inline
export function __sub_v_w(u: __Vector, v: u64, w: __Vector, n: i32): void {
	for (let j = 0; j < n; j++) {
		w[j] = __sub_w_w(u[j], v);
		v = __BORROW
	}

	assert(v == 0, 'Subtraction underflow');
}

// @ts-ignore: decorator
@inline
export function __mul_v_w(u: __Vector, v: u64, w: __Vector, n: i32, k: u64 = 0): u64 {
	const v1: i64 = v >> __HALF_BITS;
	const v0: i64 = v & __HALF_WORD_MASK;

	// @ts-ignore
	for (let j = 0; j < n; j++) {
		const low = __mul_hh_w(v1, v0, u[j]);

		w[j] = __add_w_w(low, k);
		k = __HIGH + __CARRY;

        // const uj = u[j];
		// const uj1 = uj >> __HALF_BITS;
		// const uj0 = uj & __HALF_WORD_MASK;

		// const m1 = uj0 * v1;
		// const m2 = uj1 * v0;

		// let wj = k + (uj0 * v0);
		// let carry = wj < k ? 1 : 0;

		// k = m1 << __HALF_BITS;
		// wj += k;

		// if (wj < k) {
		// 	carry++;
		// }

		// k = m2 << __HALF_BITS;
		// wj += k;

		// k = (wj < k ? carry + 1 : carry) + (m1 >> __HALF_BITS) + (m2 >> __HALF_BITS) + (uj1 * v1);
		// w[j] = wj;
	}

    return k;
}

// @ts-ignore
@inline
export function __div_v_w(u: __Vector, v: u64, w: __Vector, m: i32): u64 {
	if (m == 1) {
		const u0 = u[0];

		w[0] = u0 / v;

		return u0 % v;
	}

	let j = m - 1;

	w[j] = __div_ww_w(0, u[j--], v);

	for (; j >= 0; j--) {
		w[j] = __div_ww_w(__REMAINDER, u[j], v);
	}

	return __REMAINDER;
}


/////   VECTOR ARITHMETIC   /////

/**
 * w = u + v
 * 
 * Expects:
 * 
 * * m >= n >= 1
 * * w.length = m + 1
 * 
 * @param m - The length of vector u
 * @param n - The length of vector v
 */
// @ts-ignore: decorator
@inline
export function __add_v_v(u: __Vector, v: __Vector, w: __Vector, m: i32, n: i32): void {
	let j: i32;

	w[0] = __add_w_w(u[0], v[0]);

	for (j = 1; j < n; j++) {
		w[j] = __add_w_w_w(u[j], v[j], __CARRY);
	}

	for (; j < m; j++) {
		w[j] = __add_w_w(u[j], __CARRY);
	}

	w[j] = __CARRY;
}

/**
 * w = u - v
 * 
 * Expects:
 * 
 * * u >= v > 0
 * * w.length = m
 * 
 * @param m - The length of vector u
 * @param n - The length of vector v
 */
// @ts-ignore: decorator
@inline
export function __sub_v_v(u: __Vector, v: __Vector, w: __Vector, m: i32, n: i32): void {
	let j: i32;

	w[0] = __sub_w_w(u[0], v[0]);

	for (j = 1; j < n; j++) {
		w[j] = __sub_w_w_w(u[j], v[j], __BORROW);
	}

	for (; j < m; j++) {
		w[j] = __sub_w_w(u[j], __BORROW);
	}

	assert(__BORROW == 0, 'Subtraction underflow');
}

// The resulting carry c is either 0 or 1.
// @ts-ignore: decorator
@inline
export function __mul_v_v(u: __Vector, v: __Vector, w: __Vector, m: i32, n: i32): void {
	for (let j = 0; j < n; j++) {
		const vj = v[j];
		const vj1: u64 = vj >> __HALF_BITS;
		const vj0: u64 = vj & __HALF_WORD_MASK;

		let ij = j;
		let k: u64 = 0;

		for (let i = 0; i < m; i++, ij++) {
			const low = __mul_hh_w(vj1, vj0, u[i]);

			w[ij] = __add_w_w_w(w[ij], low, k);
			k = __HIGH + __CARRY;

			// const ui = u[i];
			// const ui1 = ui >> __HALF_BITS;
			// const ui0 = ui & __HALF_WORD_MASK;

			// const m1 = ui0 * vj1;
			// const m2 = ui1 * vj0;

			// let wij = k + (ui0 * vj0);
			// let carry = wij < k ? 1 : 0;

			// k = m1 << __HALF_BITS;
			// wij += k;

			// if (wij < k) {
			// 	carry++;
			// }

			// k = m2 << __HALF_BITS;
			// wij += k;

			// if (wij < k) {
			// 	carry++;
			// }

			// k = w[ij];
			// wij += k;

			// k = (wij < k ? carry + 1 : carry) + (m1 >> __HALF_BITS) + (m2 >> __HALF_BITS) + (ui1 * vj1);
			// w[ij] = wij;
		}

		w[ij] = k;
	}
}

/**
 * q = u / v
 * u = u % v
 * 
 * Expects:
 * 
 * * u and v are normalized
 * * u.length = m + n + 1
 * 
 * @param m - Difference in length of the original u and v
 * @param n - Length of v
 */
// @ts-ignore: decorator
@inline
export function __div_v_v(u: __Vector, v: __Vector, q: __Vector | null, m: i32, n: i32): void {
	const qhatv = __Vector.QHATV;
	const vn1 = v[n - 1];

	// D2: Loop for calculating the words of the quotient
	for (let j = m; j >= 0; j--) {
		// D3: Calculate q̂
		const ujn = u[j + n];

		let qhat: u64;

		if (ujn == vn1) {
			qhat = __WORD_MASK;
		} else {
			qhat = __div_ww_w(ujn, u[j + n - 1], vn1);

			let rhat = __REMAINDER;

			const vn2 = v[n - 2];
			const ujn2 = j + n > 1 ? u[j + n - 2] : 0;

			for (; __mulGreaterThan_w_w_ww(qhat, vn2, rhat, ujn2);) {
				qhat--;
				rhat = __add_w_w(rhat, vn1);

				// r̂ >= b
				if (__CARRY != 0) {
					break;
				}
			}
		}

		// D4: Multiply and subtract
		qhatv[n] = __mul_v_w(v, qhat, qhatv, n);

		const b = __subShift_v_v(u, qhatv, u, n + 1, j);

		// D5: Test remainder
		if (b != 0) {
			// D6. Add back
			u[j + n] += __addShift_v_v(u, v, u, n, j);
			qhat--;
		}

		// Update quotient
		if (q != null) {
			q[j] = qhat;
		}
	}
}

// The resulting carry c is either 0 or 1.
// @ts-ignore: decorator
@inline
function __addShift_v_v(u: __Vector, v: __Vector, w: __Vector, n: i32, ij: i32): u8 {
	w[ij] = __add_w_w(u[ij++], v[0]);

	for (let j = 1; j < n; j++, ij++) {
        w[ij] = __add_w_w_w(u[ij], v[j], __CARRY);
	}

	return __CARRY;
}

// The resulting borrow b is either 0 or 1.
// @ts-ignore: decorator
@inline
function __subShift_v_v(u: __Vector, v: __Vector, w: __Vector, n: i32, ij: i32): u8 {
	w[ij] = __sub_w_w(u[ij++], v[0]);

	for (let j = 1; j < n; j++, ij++) {
        w[ij] = __sub_w_w_w(u[ij], v[j], __BORROW);
	}

	return __BORROW;
}

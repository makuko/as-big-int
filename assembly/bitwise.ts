import { __BITS } from './constants';
import { __Vector } from './vector';

/**
 * w = u << (d * __BITS + b)
 * 
 * Expects:
 * 
 * * w.length = m + d + 1
 * * d >= 0
 * * b > 0
 * 
 * @param m - Length of u
 */
// @ts-ignore
@inline
export function __shl_v(u: __Vector, w: __Vector, d: i32, b: u8, m: i32): void {
    const bhat = __BITS - b;

    let k: u64 = 0;

    for (let i = m - 1, j = m + d; i >= 0; i--, j--) {
        const ui = u[i];

        w[j] = (ui >> bhat) | k;
        k = ui << b;
    }

    w[d] = k;
}

/**
 * w = u >> (d * __BITS + b)
 * 
 * Expects:
 * 
 * * w.length = m - d
 * * d >= 0
 * * b > 0
 * 
 * @param m - Length of u
 */
// @ts-ignore
@inline
export function __shr_v(u: __Vector, w: __Vector, d: i32, b: u8, m: i32): void {
    const bhat = __BITS - b;

    let k = u[d] >> b;
    let j = 0;

    for (let i = d + 1; i < m; i++, j++) {
        const ui = u[i];

        w[j] = (ui << bhat) | k;
        k = ui >> b;
    }

    w[j] = k;
}

/**
 * w = u & v
 * 
 * Expects:
 * 
 * * m = min(u.length, v.length)
 * 
 * @param m - Length of w
 */
// @ts-ignore
@inline
export function __and_v_v(u: __Vector, v: __Vector, w: __Vector, m: i32): void {
    for (let j = 0; j < m; j++) {
        w[j] = u[j] & v[j];
    }
}

/**
 * w = u & ~v
 * 
 * Expects:
 * 
 * * m = min(u.length, v.length)
 * 
 * @param m - Length of w
 * @param n - Length of v
 */
// @ts-ignore
@inline
export function __andNot_v_v(u: __Vector, v: __Vector, w: __Vector, m: i32, n: i32): void {
    for (let j = 0; j < n; j++) {
        w[j] = u[j] & ~v[j];
    }

    memory.copy(
        // @ts-ignore: protected
        w.dataStart + (<usize>n << alignof<u64>()),
        // @ts-ignore: protected
        u.dataStart + (<usize>n << alignof<u64>()),
        <usize>(m - n) << alignof<u64>()
    );
}

/**
 * w = u | v
 * 
 * Expects:
 * 
 * * m <= n
 * 
 * @param m - Length of u
 * @param n - Length of v
 */
// @ts-ignore
@inline
export function __or_v_v(u: __Vector, v: __Vector, w: __Vector, m: i32, n: i32): void {
    for (let j = 0; j < n; j++) {
        w[j] = u[j] | v[j];
    }

    memory.copy(
        // @ts-ignore: protected
        w.dataStart + (<usize>n << alignof<u64>()),
        // @ts-ignore: protected
        u.dataStart + (<usize>n << alignof<u64>()),
        <usize>(m - n) << alignof<u64>()
    );
}

/**
 * w = u ^ v
 * 
 * Expects:
 * 
 * * m <= n
 * 
 * @param m - Length of u
 * @param n - Length of v
 */
// @ts-ignore
@inline
export function __xor_v_v(u: __Vector, v: __Vector, w: __Vector, m: i32, n: i32): void {
    for (let j = 0; j < m; j++) {
        w[j] = u[j] ^ v[j];
    }

    memory.copy(
        // @ts-ignore: protected
        w.dataStart + (<usize>n << alignof<u64>()),
        // @ts-ignore: protected
        u.dataStart + (<usize>n << alignof<u64>()),
        <usize>(m - n) << alignof<u64>()
    );
}

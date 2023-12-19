import benchmark from 'benchmark';
import BN from 'bn.js';

import { shift } from '../build/benchmark.js';



// BigInt

const _7 = BigInt(7);

/**
 * @param {number} n 
 */
function shiftBigInt(n) {
    let x = _7;

    for (let i = n; i > 0; i--) {
        if (i % 2) {
            x >>= BigInt(i * 10);
        } else {
            x <<= BigInt(i * 10);
        }
    }

    // console.log(x.toString(10));

    // throw new Error('End here');
}



// BN.js

const bn7 = new BN(7);

/**
 * @param {number} n 
 */
function shiftBN(n) {
    const x = bn7.clone();

    for (let i = n; i > 0; i--) {
        if (i % 2) {
            x.iushrn(i * 10);
        } else {
            x.ishln(i * 10);
        }
    }
}



// Suite

const suite = new benchmark.Suite('Shift');

const value = 100;

suite
    .add('own', () => {
        shift(value);
    })
    .add('bigint', () => {
        shiftBigInt(value);
    })
    .add('bn.js', () => {
        shiftBN(value);
    })
    .on('cycle', event => {
        console.log(String(event.target));
    })
    .on('complete', () => {
        console.log('Fastest is ' + suite.filter('fastest').map('name'));
    })
    .on('error', event => {
        console.error(event.target.error);
    })
    .run();

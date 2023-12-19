import benchmark from 'benchmark';
import BN from 'bn.js';

import { catalan } from '../build/benchmark.js';



// BigInt

/**
 * @param {number} n 
 */
function catalanBigInt(n) {
    let x = 1n;

    for (let i = 2; i <= n; i++) {
        x *= BigInt(i);
    }

    let y = x;

    for (let i = n + 1; i <= 2 * n; i++) {
        y *= BigInt(i);
    }

    x *= x;
    x *= BigInt(n + 1);
    y /= x;

    // console.log(y.toString());

    // throw new Error('End here');
}



// BN.js

/**
 * @param {number} n 
 */
function catalanBN(n) {
    let x = new BN(1);

    for (let i = 2; i <= n; i++) {
        x = x.mul(new BN(i));
    }

    let y = x;

    for (let i = n + 1; i <= n * 2; i++) {
        y = y.mul(new BN(i));
    }

    x = x.mul(x);
    x = x.mul(new BN(n + 1));
    y = y.div(x);
}



// Suite

const suite = new benchmark.Suite('Catalan');

const value = 200;

suite
    .add('own', () => {
        catalan(value);
    })
    .add('bigint', () => {
        catalanBigInt(value);
    })
    .add('bn.js', () => {
        catalanBN(value);
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

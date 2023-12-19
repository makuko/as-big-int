import benchmark from 'benchmark';
import BN from 'bn.js';

import { multiply } from '../build/benchmark.js';



// BigInt

/**
 * @param {number} n 
 */
function multiplyBigInt(n) {
    let x = 3n;
    let y = 7n;
    let z = 0n;

    for (let i = 0; i <= n; i++) {
        z = x * y;
        x *= 13n;
        y *= 13n;
    }

    // console.log(c.toString(16));

    // throw new Error('End here');
}



// BN.js

/**
 * @param {number} n 
 */
function multiplyBN(n) {
    let x = new BN(3);
    let y = new BN(7);
    let z = new BN();

    for (let i = 0; i <= n; i++) {
        z = x.mul(y);
        x = x.muln(13);
        y = y.muln(13);
    }
}



// Suite

const suite = new benchmark.Suite('Multiply');

const value = 100;

suite
    .add('own', () => {
        multiply(value);
    })
    .add('bigint', () => {
        multiplyBigInt(value);
    })
    .add('bn.js', () => {
        multiplyBN(value);
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

import benchmark from 'benchmark';
import BN from 'bn.js';

import { fibonacci } from '../build/benchmark.js';



// BigInt

/**
 * @param {number} n 
 */
function fibonacciBigInt(n) {
    let x = 1n;
    let y = 1n;
    let z = 0n;

    while(--n) {
        z = x + y;
        y = x;
        x = z;
    }

    // console.log(y.toString());

    // throw new Error('End here');
}



// BN.js

/**
 * @param {number} n 
 */
function fibonacciBN(n) {
    let x = new BN(1);
    let y = new BN(1);
    let z = new BN(0);

    while(--n) {
        z = x.add(y);
        y = x;
        x = z;
    }
}



// Suite

const suite = new benchmark.Suite('Fibonacci');

const value = 1000;

suite
    .add('own', () => {
        fibonacci(value);
    })
    .add('bigint', () => {
        fibonacciBigInt(value);
    })
    .add('bn.js', () => {
        fibonacciBN(value);
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

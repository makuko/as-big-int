import benchmark from 'benchmark';
import BN from 'bn.js';

import { factorial } from '../build/benchmark.js';



// BigInt

/**
 * @param {number} n 
 */
function factorialBigInt(n) {
    let x = BigInt(n);

    while (--n !== 0) {
        x = x * BigInt(n);
    }
    
    // console.log(x.toString());

    // throw new Error('End here');
}



// BN.js

/**
 * @param {number} n 
 */
function factorialBN(n) {
    let x = new BN(n);

    while (--n !== 0) {
        x = x.muln(n);
    }
}



// Suite

const suite = new benchmark.Suite('Factorial');

const value = 100;

suite
    .add('own', () => {
        factorial(value);
    })
    .add('bigint', () => {
        factorialBigInt(value);
    })
    .add('bn.js', () => {
        factorialBN(value);
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

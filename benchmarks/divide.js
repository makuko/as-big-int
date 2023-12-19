import benchmark from 'benchmark';
import BN from 'bn.js';

import { divide } from '../build/benchmark.js';



const gaz = '25925201511471244808909080173171693503203792369882740963446734898884002523813104800367669756166522152575362640568909073840472363732523772357238956623590923956238523554551871888350939347335213210001838328277865758589024604469058963070851547738667825645961804564421445229';
const zil = '253057943210559710436372687529332696597';


// BigInt

const _Gaz = BigInt(gaz);
const _Zil = BigInt(zil);

function divideBigInt() {
    let x = _Gaz;
    let y = _Zil;

    while (x) {
        // console.log('---');
        // console.log('x: ' + x.toString());
        // console.log('y: ' + y.toString());
        x /= y;
        y /= 733n;
    }

    // console.log(y.toString());

    // throw new Error('End here');
}



// BN.js

const __Gaz = new BN(gaz);
const __Zil = new BN(zil);

function divideBN() {
    let x = __Gaz.clone();
    const y = __Zil.clone();

    while (!x.isZero()) {
        x = x.div(y);
        y.idivn(733);
    }
}



// Suite

const suite = new benchmark.Suite('Divide');

suite
    .add('own', () => {
        divide();
    })
    .add('bigint', () => {
        divideBigInt();
    })
    .add('bn.js', () => {
        divideBN();
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

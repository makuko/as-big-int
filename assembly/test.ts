import { bigInt } from '.';
import { BigInt } from './big-int';

export function convertInt(u: i64): string {
    return BigInt.fromInt(u).toString();
}

export function convertString(u: string, radix: u8): string {
    return BigInt.fromString(u, radix).toString(radix);
}

export function add(u: string, v: string): string {
    return bigInt(u).add(bigInt(v)).toString();
}

export function addInt(u: string, v: i64): string {
    return bigInt(u).addInt(v).toString();
}

export function sub(u: string, v: string): string {
    return bigInt(u).sub(bigInt(v)).toString();
}

export function subInt(u: string, v: i64): string {
    return bigInt(u).subInt(v).toString();
}

export function mul(u: string, v: string): string {
    return bigInt(u).mul(bigInt(v)).toString();
}

export function mulInt(u: string, v: i64): string {
    return bigInt(u).mulInt(v).toString();
}

export function div(u: string, v: string): string {
    return bigInt(u).div(bigInt(v)).toString();
}

export function divInt(u: string, v: i64): string {
    return bigInt(u).divInt(v).toString();
}

export function mod(u: string, v: string): string {
    return bigInt(u).mod(bigInt(v)).toString();
}

export function modInt(u: string, v: i64): string {
    return bigInt(u).modInt(v).toString();
}

export function eq(u: string, v: string): boolean {
    return bigInt(u).eq(bigInt(v));
}

export function ne(u: string, v: string): boolean {
    return bigInt(u).ne(bigInt(v));
}

export function gt(u: string, v: string): boolean {
    return bigInt(u).gt(bigInt(v));
}

export function gte(u: string, v: string): boolean {
    return bigInt(u).gte(bigInt(v));
}

export function lt(u: string, v: string): boolean {
    return bigInt(u).lt(bigInt(v));
}

export function lte(u: string, v: string): boolean {
    return bigInt(u).lte(bigInt(v));
}

export function and(u: string, v: string): string {
    return bigInt(u).and(bigInt(v)).toString();
}

export function andNot(u: string, v: string): string {
    return bigInt(u).andNot(bigInt(v)).toString();
}

export function or(u: string, v: string): string {
    return bigInt(u).or(bigInt(v)).toString();
}

export function xor(u: string, v: string): string {
    return bigInt(u).xor(bigInt(v)).toString();
}

export function not(u: string): string {
    return bigInt(u).not().toString();
}

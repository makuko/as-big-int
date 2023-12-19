import { BigInt } from './big-int';

export { BigInt } from './big-int';

// @ts-ignore: decorator
@inline
// @ts-ignore: default
export function bigInt<T>(value: T = 0, radix: u8 = 10): BigInt {
    if (isString(value)) {
        return BigInt.fromString(<string>value, radix);
    }

    if (isInteger(value)) {
        return BigInt.fromInt(value);
    }

    throw new TypeError(`Cannot convert ${ typeof value } to a BigInt`);
}

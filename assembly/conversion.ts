import { __mul_v_w } from './arithmetic';
import { __BITS } from './constants';
import { BigInt } from './big-int';
import { __Vector } from './vector';

// @ts-ignore: decorator
@inline
export function __create(isNegative: boolean = false, length: i32 = 0): BigInt {
    const x = changetype<BigInt>(__new(offsetof<BigInt>(), idof<BigInt>()));

    // @ts-ignore: protected
    x.buffer = new ArrayBuffer(<i32>__byteLength(length));
    // @ts-ignore: protected
    x.length = length;
    x.isNeg = isNegative;

    return x;
}

// @ts-ignore: decorator
@inline
export function __byteLength(length: i32): usize {
    return (length > 1 ? length + 4 : length) << alignof<u64>();
}

const chunkSizes: u8[] = [
    0, 0,
    63, 40, 31, 27, 24,
    22, 21, 20, 19, 18,
    17, 17, 16, 16, 15,
    15, 15, 15, 14, 14,
    14, 14, 13, 13, 13,
    13, 13, 13, 13, 12,
    12, 12, 12, 12, 12
];

const chunkBases: u64[] = [
    0, 0,
    9223372036854775808, 12157665459056928801, 4611686018427387904, 7450580596923828125, 4738381338321616896,
    3909821048582988049, 9223372036854775808, 12157665459056928801, 10000000000000000000, 5559917313492231481,
    2218611106740436992, 8650415919381337933, 2177953337809371136, 6568408355712890625, 1152921504606846976,
    2862423051509815793, 6746640616477458432, 15181127029874798299, 1638400000000000000, 3243919932521508681,
    6221821273427820544, 11592836324538749809, 876488338465357824, 1490116119384765625, 2481152873203736576,
    4052555153018976267, 6502111422497947648, 10260628712958602189, 15943230000000000000, 787662783788549761,
    1152921504606846976, 1667889514952984961, 2386420683693101056, 3379220508056640625, 4738381338321616896
];

const logTwoMap = new Map<u8, u8>();

logTwoMap.set(16, 4);
logTwoMap.set(8, 3);
logTwoMap.set(2, 1);
logTwoMap.set(32, 5);
logTwoMap.set(4, 2);

export function __fromRadix(str: string, radix: u8): BigInt {
    const start = str.charCodeAt(0) == 45 ? 1 : 0;
    const x = __create();

    const cs = chunkSizes[radix];
    const cb = chunkBases[radix];

    let j: u8 = 0;
    let k: u64 = 0;
    let n = 0;

    for (let i = start; i < str.length; i++) {
        k = k * radix + __digitFromCharacter(str, i, radix);

        if (++j == cs) {
            k = __mul_v_w(x, cb, x, n, k);

            if (k != 0) {
                // @ts-ignore: protected
                x.__resize(++n);

                x[n - 1] = k;
                k = 0;
            }

            j = 0;
        }
    }

    if (j > 0) {
        k = __mul_v_w(x, (<u64>radix) ** j, x, n, k);

        if (k != 0) {
            // @ts-ignore: protected
            x.__resize(++n);

            x[n - 1] = k;
        }
    }

    if (start == 1) {
        x.isNeg = true;
    }

    return x;
}

// @ts-ignore: decorator
@inline
export function __toRadix(x: BigInt, radix: u8): string {
    const cs = chunkSizes[radix];
    const cb = chunkBases[radix];
    const y: BigInt = x.copy();
    const codes: i32[] = [];

    for (; !y.isZero;) {
        // @ts-ignore: protected
        let r = y.__divModInt(y, cb);

        for (let i: u8 = 0; i < cs; i++, r /= radix) {
            if (r > 0) {
                codes.push(__digitToCharacter(r % radix));

                continue;
            }

            if (y.isZero) {
                break;
            }

            codes.push(48); // Leading zeros
        }
    }

    if (x.isNeg) {
        codes.push(45); // Minus sign
    }

    return String.fromCharCodes(codes.reverse());
}

// @ts-ignore: decorator
@inline
export function __fromPowerOfTwo(str: string, radix: i8): BigInt {
    const l2 = logTwoMap.get(radix);
    const start = str.charCodeAt(0) == 45 ? 1 : 0;
    const x = __create(start == 1, (str.length / l2) + 1);

    let i = str.length;
    let j = 0;
    let shift: u64 = 0;

    while (--i >= start) {
        const digit = __digitFromCharacter(str, i, radix);

        if (shift == 0) {
            x[j++] = digit;
        } else if (shift + l2 > __BITS) {
            x[j - 1] |= (digit & ((1 << (__BITS - shift)) - 1)) << shift;
            x[j++] = digit >> (__BITS - shift);
        } else {
            x[j - 1] |= digit << shift;
        }

        shift += l2;

        if (shift >= __BITS) {
            shift -= __BITS;
        }
    }

    // @ts-ignore: protected
    x.__trim();

    return x;
}

// @ts-ignore: decorator
@inline
export function __toPowerOfTwo(x: BigInt, radix: i8): string {
    const l2 = logTwoMap.get(radix);
    const mask = radix - 1;
    const codes: i32[] = x.isNeg ? [45] : [];

    // @ts-ignore: protected
    let i = x.length;
    let shift = __BITS - ((<u64>(i--) * __BITS) % l2);
    let d: u64;

    if (shift < __BITS && (d = x[i] >> shift) > 0) {
        codes.push(__digitToCharacter(d));
    }

    while (i >= 0) {
        if (shift < l2) {
            d = (x[i] & ((1 << shift) - 1)) << (l2 - shift);
            shift += __BITS - l2
            d |= x[--i] >> shift;
        } else {
            shift -= l2
            d = (x[i] >> shift) & mask;

            if (shift <= 0) {
                shift += __BITS;
                i--;
            }
        }

        if (d > 0 || codes.length) {
            codes.push(__digitToCharacter(d));
        }
    }

    return String.fromCharCodes(codes);
}

// @ts-ignore: decorator
@inline
function __digitFromCharacter(str: string, i: i32, radix: u8): u64 {
    let d = <u64>str.charCodeAt(i) - 48; // Could be 0-9

    if (d >= 49) {
        d -= 39; // Could be a-z
    } else if (d >= 17) {
        d -= 7; // Could be A-Z
    }

    if (d < 0 || d >= radix) {
        throw new TypeError('fromString() invalid character in string');
    }

    return d;
}

// @ts-ignore: decorator
@inline
function __digitToCharacter(d: u64): i32 {
    if (d < 10) {
        return <i32>d + 48; // 0-9
    }

    return <i32>d + 87; // a-z
}

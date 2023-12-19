import { __BITS, __WORD_MASK } from './constants';
import { __create, __fromPowerOfTwo, __fromRadix, __toPowerOfTwo, __toRadix } from './conversion';
import { __Vector } from './vector';

@final
export class BigInt extends __Vector {

    public isNeg: boolean;

    @inline
    public get isZero(): boolean {
        return this.length == 0;
    }

    @inline
    public get isEven(): boolean {
        return this.length == 0 || (this[0] & 1) == 0;
    }

    @inline
    public get isOdd(): boolean {
        return this.length != 0 && (this[0] & 1) == 1;
    }

    // @ts-ignore: super call
    constructor() {
        throw new TypeError('BigInt is not a constructor');
    }

    @inline
    public static fromInt(a: i64): BigInt {
        if (a == 0) {
            return __create();
        }

        const x = __create(a < 0, 1);

        x[0] = <u64>abs(a);

        return x;
    }

    @inline
    public static fromString(str: string, radix: u8 = 10): BigInt {
        switch (radix) {
            case 16:
            case 8:
            case 2:
            case 32:
            case 4:
                return __fromPowerOfTwo(str, radix);
        }

        return __fromRadix(str, radix);
    }

    @inline
    static fromUint64Array(arr: Uint64Array, isNeg: boolean = false): BigInt {
        const x = changetype<BigInt>(__new(offsetof<BigInt>(), idof<BigInt>()));

        x.isNeg = isNeg;
        x.length = arr.length;
        x.buffer = arr.buffer.slice();

        return x;
    }

    /////   ARITHMETIC   /////

    @inline
    public neg(x: BigInt = this): this {
        this.isNeg = !x.isNeg;

        if (this != x) {
            this.assign(x);
        }

        return this;
    }

    @inline
    public abs(x: BigInt = this): this {
        this.isNeg = false;

        if (this != x) {
            this.assign(x);
        }

        return this;
    }

    @inline
    public addAny<T>(y: T, x: BigInt = this): this {
        if (isInteger(y)) {
            if (x.isNeg != y < 0) {
                return this.__subIntSigned(x, abs(y));
            }

            this.isNeg = x.isNeg;

            return this.__addInt(x, abs(y));
        }

        if (y instanceof BigInt) {
            if (x.isNeg != y.isNeg) {
                return this.__subSigned(x, y);
            }

            this.isNeg = x.isNeg;

            return this.__add(x, y);
        }

        unreachable();
    }

    @inline
    public add(y: BigInt, x: BigInt = this): this {
        if (x.isNeg != y.isNeg) {
            return this.__subSigned(x, y);
        }

        this.__add(x, y);

        this.isNeg = x.isNeg;

        return this;
    }

    @inline
    public addInt(y: i64, x: BigInt = this): this {
        if (x.isNeg != y < 0) {
            return this.__subIntSigned(x, abs(y));
        }

        this.__addInt(x, abs(y));

        this.isNeg = x.isNeg;

        return this;
    }

    @inline
    public sub(y: BigInt, x: BigInt = this): this {
        if (x.isNeg == y.isNeg) {
            return this.__subSigned(x, y);
        }

        this.__add(x, y);

        this.isNeg = x.isNeg;

        return this;
    }

    @inline
    public subInt(y: i64, x: BigInt = this): this {
        if (x.isNeg == y < 0) {
            return this.__subIntSigned(x, abs(y));
        }

        this.__addInt(x, abs(y));

        this.isNeg = x.isNeg;

        return this;
    }

    @inline
    public mul(y: BigInt, x: BigInt = this): this {
        this.__mul(x, y);

        this.isNeg = this.length > 0 && x.isNeg != y.isNeg;

        return this;
    }

    @inline
    public mulInt(y: i64, x: BigInt = this): this {
        this.__mulInt(x, abs(y));

        this.isNeg = this.length > 0 && x.isNeg != y < 0;

        return this;
    }

    @inline
    public div(y: BigInt, x: BigInt = this): this {
        this.__div(x, y);

        this.isNeg = this.length > 0 && x.isNeg != y.isNeg;

        return this;
    }

    @inline
    public divInt(y: i64, x: BigInt = this): this {
        this.__divInt(x, abs(y));
    
        this.isNeg = this.length > 0 && x.isNeg != y < 0;

        return this;
    }

    @inline
    public mod(y: BigInt, x: BigInt = this): this {
        this.__mod(x, y);

        this.isNeg = x.isNeg;

        return this;
    }

    @inline
    public modInt(y: i64, x: BigInt = this): i64 {
        return x.isNeg
            ? -this.__modInt(x, abs(y))
            : this.__modInt(x, abs(y));
    }

    @inline
    public divMod(y: BigInt, r: BigInt, x: BigInt = this): this {
        this.__divMod(x, y, r);

        this.isNeg = this.length > 0 && x.isNeg != y.isNeg;
        r.isNeg = x.isNeg;

        return this;
    }

    @inline
    public divModInt(y: i64, x: BigInt = this): i64 {
        const r = this.__divModInt(x, abs(y));

        this.isNeg = this.length > 0 && x.isNeg != y < 0;

        return x.isNeg ? -r : r;
    }

    /////   COMPARISON   /////

    @inline
    public eq(y: BigInt): boolean {
        return this.isNeg == y.isNeg && this.__eq(y);
    }
    
    @inline
    public ne(y: BigInt): boolean {
        return this.isNeg != y.isNeg || this.__ne(y);
    }

    @inline
    public gt(y: BigInt): boolean {
        return this.isNeg
            ? y.isNeg && this.__gt(y)
            : y.isNeg || this.__gt(y);
    }

    @inline
    public gte(y: BigInt): boolean {
        return this.isNeg
            ? y.isNeg && this.__gte(y)
            : y.isNeg || this.__gte(y);
    }

    @inline
    public lt(y: BigInt): boolean {
        return this.isNeg
            ? !y.isNeg || this.__lt(y)
            : !y.isNeg && this.__lt(y);
    }

    @inline
    public lte(y: BigInt): boolean {
        return this.isNeg
            ? !y.isNeg || this.__lte(y)
            : !y.isNeg && this.__lte(y);
    }

    /////   BITWISE   /////

    @inline
    public shl(b: i32, x: BigInt = this): this {
        if (b == 0 || x.length == 0) {
            if (x != this) {
                this.__resize(x.length).__copy(x);
            }
        } else if (b < 0) {
            this.__shrSigned(x, abs(b));
        } else {
            this.__shl(x, b);
        }

        return this;
    }

    @inline
    public shr(b: i32, x: BigInt = this): this {
        if (b == 0 || x.length == 0) {
            if (x != this) {
                this.__resize(x.length).__copy(x);
            }
        } else if (b < 0) {
            this.__shl(x, abs(b));
        } else {
            this.__shrSigned(x, b);
        }

        return this;
    }

    @inline
    public and(y: BigInt, x: BigInt = this): this {
        const isXNegative = x.isNeg;

        if (isXNegative == y.isNeg) {
            isXNegative
                // -x & -y == ~(x - 1) & ~(y - 1) == ~((x - 1) | (y - 1)) == -(((x - 1) | (y - 1)) + 1)
                // @ts-ignore
                ? this.__or(__Vector.U.__subInt(x, 1), __Vector.V.__subInt(y, 1)).__addInt(this, 1)

                // u & v
                : this.__and(x, y);
            
            this.isNeg = isXNegative;

            return this;
        }

        isXNegative
            // -x & y == y & -x == y & ~(x - 1)
            // @ts-ignore
            ? this.__andNot(y, __Vector.V.__subInt(x, 1))
        
            // x & -y == x & ~(y - 1)
            // @ts-ignore
            : this.__andNot(x, __Vector.V.__subInt(y, 1));

        this.isNeg = false;

        return this;
    }

    @inline
    public andNot(y: BigInt, x: BigInt = this): this {
        const isXNegative = x.isNeg;

        if (isXNegative == y.isNeg) {
            isXNegative
                // -x & ~(-y) == ~(x - 1) & ~(~(y - 1)) == ~(x - 1) & (y - 1) == (y - 1) & ~(x - 1)
                // @ts-ignore
                ? this.__andNot(__Vector.U.__subInt(y, 1), __Vector.V.__subInt(x, 1))

                // x & ~y
                : this.__andNot(x, y);

            this.isNeg = false;

            return this;
        }

        isXNegative
            // (-x) & ~y == ~(x - 1) & ~y == ~((x - 1) | y) == -(((x - 1) | y) + 1)
            // @ts-ignore
            ? this.__or(__Vector.U.__subInt(x, 1), y).__addInt(this, 1)

            // x & ~(-y) == x & ~(~(y - 1)) == x & (y - 1)
            // @ts-ignore
            : this.__and(x, __Vector.V.__subInt(y, 1));

        this.isNeg = isXNegative;

        return this;
    }

    @inline
    public or(y: BigInt, x: BigInt = this): this {
        const isXNegative = x.isNeg;

        if (isXNegative == y.isNeg) {
            isXNegative
                // -x | -y == ~(x - 1) | ~(y - 1) == ~((x - 1) & (y - 1)) == -(((x - 1) & (y - 1)) + 1)
                // @ts-ignore
                ? this.__and(__Vector.U.__subInt(x, 1), __Vector.V.__subInt(y, 1)).__addInt(this, 1)

                // x | y
                : this.__or(x, y);

            this.isNeg = isXNegative;

            return this;
        }

        isXNegative
            // -x | y == ~(x - 1) | y == ~((x - 1) & ~y) == -((x - 1) & ~y) + 1)
            // @ts-ignore
            ? this.__andNot(__Vector.U.__subInt(x, 1), y).__addInt(this, 1)

            // x | -y == x | ~(y - 1) == ~((y - 1) & ~x) == -((y - 1) & ~x) + 1)
            // @ts-ignore
            : this.__andNot(__Vector.U.__subInt(y, 1), x).__addInt(this, 1)

        this.isNeg = true;

        return this;
    }

    @inline
    public xor(y: BigInt, x: BigInt = this): this {
        const isXNegative = x.isNeg;

        if (isXNegative == y.isNeg) {
            isXNegative
                // -x ^ -y == ~(x - 1) ^ ~(y - 1) == (x - 1) ^ (y - 1)
                // @ts-ignore
                ? this.__xor(__Vector.U.__subInt(x, 1), __Vector.V.__subInt(y, 1))

                // x ^ y
                : this.__xor(x, y);

            this.isNeg = false;

            return this;
        }

        isXNegative
            // -x ^ y == y ^ -x == y ^ ~(x - 1) == ~(y ^ (x - 1)) == -((y ^ (x - 1)) + 1)
            // @ts-ignore
            ? this.__xor(y, __Vector.V.__subInt(x, 1)).__addInt(this, 1)

            // x ^ -y == x ^ ~(y - 1) == ~(x ^ (y - 1)) == -((x ^ (y - 1)) + 1)
            // @ts-ignore
            : this.__xor(x, __Vector.V.__subInt(y, 1)).__addInt(this, 1)

        this.isNeg = true;

        return this;
    }

    @inline
    public not(x: BigInt = this): this {
        if (x.isNeg) {
            // ~(-x) == ~(~(x - 1)) == x - 1
            this.__subInt(x, 1);

            this.isNeg = false;
        } else {
            // ~x == -x - 1 == -(x + 1)
            this.__addInt(x, 1);

            this.isNeg = true;
        }

        return this;
    }

    /////   MISC   /////

    @inline
    public assign(y: BigInt): this {
        const m = y.length;

        this.__resize(m);

        if (m != 0) {
            this.__copy(y);
        }

        this.isNeg = y.isNeg;

        return this;
    }

    @inline
    public copy(): BigInt {
        const m = this.length;
        const x = __create(this.isNeg, m);

        if (m != 0) {
            x.__copy(this);
        }

        return x;
    }

    @inline
    public toString(radix: u8 = 10): string {
        if (this.isZero) {
            return '0';
        }

        if (this.length == 1) {
            return this.isNeg ? '-' + this[0].toString(radix) : this[0].toString(radix);
        }

        switch (radix) {
            case 16:
            case 8:
            case 2:
            case 32:
            case 4:
                return __toPowerOfTwo(this, radix);
        }

        if (radix < 2 || radix > 36) {
            throw new RangeError('toString() radix argument must be between 2 and 36');
        }

        return __toRadix(this, radix);
    }

    @inline
    public toUint64Array(): Uint64Array {
        return Uint64Array.wrap(this.buffer.slice(0, this.length << alignof<u64>()));
    }

    /////   HELPERS   /////

    @inline
    private __subSigned(x: BigInt, y: BigInt): this {
        switch (x.__compare(y)) {
            case 0:
                this.isNeg = false;
                this.length = 0;

                return this;

            case 1:
                this.__sub(x, y);

                this.isNeg = this.length > 0 && x.isNeg;

                return this;
        }

        this.__sub(y, x);

        this.isNeg = this.length > 0 && !x.isNeg;

        return this;
    }

    @inline
    private __subIntSigned(x: BigInt, y: u64): this {
        if (y == 0) {
            return <this>this.__copy(x);
        }

        if (x.length == 0) {
            this.__resize(1);

            this[0] = y;

            this.isNeg = true;

            return this;
        }

        if (x.length > 1 || x[0] >= y) {
            this.__subInt(x, y);

            this.isNeg = this.length > 0 && x.isNeg;

            return this;
        }

        this.__resize(1);
        this[0] = y - x[0];

        this.isNeg = !x.isNeg;

        return this;
    }

    @inline
    private __shrSigned(x: BigInt, b: u32): this {
        if (this.isNeg) {
            this.__subInt(x, 1).__shr(this, b).__addInt(this, 1);

            this.isNeg = true;
        } else {
            this.__shr(x, b);
        }

        return this;
    }

}

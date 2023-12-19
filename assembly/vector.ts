import { __add_v_v, __mul_v_w, __sub_v_v, __add_v_w, __sub_v_w, __mul_v_v, __div_v_w, __div_v_v } from './arithmetic';
import { __andNot_v_v, __and_v_v, __or_v_v, __shl_v, __shr_v, __xor_v_v } from './bitwise';
import { __BITS, __WORD_MASK } from './constants';
import { __byteLength } from './conversion';

export class __Vector {

    @lazy
    public static U: __Vector = new __Vector();

    @lazy
    public static V: __Vector = new __Vector();

    @lazy
    public static W: __Vector = new __Vector();

    @lazy
    public static QHATV: __Vector = new __Vector();

    [key: i32]: u64;

    protected buffer: ArrayBuffer;

    protected get dataStart(): usize {
        return changetype<usize>(this.buffer);
    }

    constructor(protected length: i32 = 0) {
        this.buffer = new ArrayBuffer(<i32>__byteLength(length));
    }

    @inline
    protected __add(u: __Vector, v: __Vector): this {
        const m = u.length;

        if (m == 0) {
            return this.__copy(v);
        }

        const n = v.length;

        if (n == 0) {
            return this.__copy(u);
        }

        if (m > n) {
            this.__resize(m + 1);

            __add_v_v(u, v, this, m, n);
        } else {
            this.__resize(n + 1);

            __add_v_v(v, u, this, n, m);
        }

        return this.__trim();
    }

    @inline
    protected __addInt(u: __Vector, v: u64): this {
        const n = u.length;

        this.__resize(n + 1);

        __add_v_w(u, v, this, n);

        return this.__trim();
    }

    @inline
    protected __sub(u: __Vector, v: __Vector): this {
        const m = u.length;
        const n = v.length;

        assert(m >= n, 'Subtraction underflow');

        if (m == 0) {
            return this.__zero();
        }

        if (n == 0) {
            return this.__copy(u);
        }

        this.__resize(m);

        __sub_v_v(u, v, this, m, n);

        return this.__trim();
    }

    @inline
    protected __subInt(u: __Vector, v: u64): this {
        const n = u.length;

        this.__resize(n);

        __sub_v_w(u, v, this, n);

        return this.__trim();
    }

    @inline
    protected __mul(u: __Vector, v: __Vector): this {
        const m = u.length;
        const n = v.length;

        const w = u == this || v == this ? __Vector.W : this;

        w.__resize(m + n).__clear();

        __mul_v_v(u, v, w, m, n);

        return this.__swapBuffer(w).__trim();
    }

    @inline
    protected __mulInt(u: __Vector, v: u64): this {
        const n = u.length;

        if (n == 0) {
            return this;
        }

        if (v == 0) {
            return this.__zero();
        }

        if (this != u) {
            this.__resize(n);
        }

        const k = __mul_v_w(u, v, this, n);

        if (k != 0) {
            this.__resize(n + 1);

            this[n] = k;
        }

        return this;
    }

    @inline
    protected __div(u: __Vector, v: __Vector): this {
        const n = v.length;

        if (n == 0) {
            throw new Error('Division by zero');
        }

        if (u.__lt(v)) {
            return this.__zero();
        }

        if (n == 1) {
            return this.__divInt(u, v[0]);
        }

        this.__divLong(u, v, this);

        return this.__trim();
    }

    @inline
    protected __divInt(u: __Vector, v: u64): this {
        this.__divModInt(u, v);

        return this;
    }

    @inline
    protected __mod(u: __Vector, v: __Vector): this {
        const n = v.length;

        if (n == 0) {
            throw new Error('Division by zero');
        }

        if (u.__lt(v)) {
            return this.__copy(u);
        }

        if (n == 1) {
            const r = this.__modInt(u, v[0]);

            if (r == 0) {
                return this.__zero();
            }

            this.__resize(1);

            this[0] = r;

            return this;
        }

        
        this.__divLong(u, v, null, this);

        return this.__trim();
    }

    @inline
    protected __modInt(u: __Vector, v: u64): u64 {
        return __Vector.W.__divModInt(u, v);
    }

    @inline
    protected __divMod(u: __Vector, v: __Vector, r: __Vector): this {
        const n = v.length;

        if (n == 0) {
            throw new Error('Division by zero');
        }

        if (u.__lt(v)) {
            r.__copy(u);

            return this.__zero();
        }

        if (n == 1) {
            const _r = this.__divModInt(u, v[0]);

            if (_r == 0) {
                r.__zero();
            } else {
                r.__resize(1);

                r[0] = _r;
            }
    
            return this;
        }

        
        this.__divLong(u, v, this, r);
        r.__trim();

        return this.__trim();
    }

    @inline
    protected __divModInt(u: __Vector, v: u64): u64 {
        if (v == 0) {
            throw new Error('Division by zero');
        }

        const m = u.length;

        if (m == 0) {
            this.length = 0;

            return 0;
        }

        this.__resize(m);

        if (v == 1) {
            this.__copy(u);

            return 0;
        }

        let r: u64 = __div_v_w(u, v, this, m);

        this.__trim();

        return r;
    }

    @inline
    protected __shl(u: __Vector, b: u32): this {
        const m = u.length;
        const d = <i32>(b / __BITS);

        b = b % __BITS;

        if (b == 0) {
            this.__resize(m + d);

            memory.copy(
                this.dataStart + (<usize>d << alignof<u64>()),
                u.dataStart,
                <usize>m << alignof<u64>()
            );

            memory.fill(this.dataStart, 0, <usize>d << alignof<u64>());

            return this;
        }

        this.__resize(m + d + 1);
        
        __shl_v(u, this, d, <u8>b, m);

        if (d > 0) {
            memory.fill(this.dataStart, 0, <usize>d << alignof<u64>());
        }

        return this.__trim();
    }

    @inline
    protected __shr(u: __Vector, b: u32): this {
        const m = u.length;
        const d = <i32>(b / __BITS);

        if (d >= m) {
            return this.__zero();
        }

        b = b % __BITS;

        this.__resize(m - d);

        if (b == 0) {
            memory.copy(
                this.dataStart,
                u.dataStart + (<usize>d << alignof<u64>()),
                <usize>(m - d) << alignof<u64>()
            );
        }  else {
            __shr_v(u, this, d, <u8>b, m);
        }

        return this.__trim();
    }

    @inline
    protected __and(u: __Vector, v: __Vector): this {
        const m = min(u.length, v.length);

        this.__resize(m);

        __and_v_v(u, v, this, m);

        return this.__trim();
    }

    @inline
    protected __andNot(u: __Vector, v: __Vector): this {
        let m = u.length;
        let n = v.length;

        if (m > n) {
            this.__resize(m);

            __andNot_v_v(u, v, this, m, n);
        } else {
            this.__resize(n);

            __andNot_v_v(v, u, this, n, m);
        }

        return this.__trim();
    }

    @inline
    protected __or(u: __Vector, v: __Vector): this {
        let m = u.length;
        let n = v.length;

        if (m > n) {
            this.__resize(m);

            __or_v_v(u, v, this, m, n);
        } else {
            this.__resize(n);

            __or_v_v(v, u, this, n, m);
        }

        return this.__trim();
    }

    @inline
    protected __xor(u: __Vector, v: __Vector): this {
        let m = u.length;
        let n = v.length;

        if (m > n) {
            this.__resize(m);

            __xor_v_v(u, v, this, m, n);
        } else {
            this.__resize(n);

            __xor_v_v(v, u, this, n, m);
        }

        return this.__trim();
    }

    @inline
    protected __eq(v: __Vector): boolean {
        return this.__compare(v) == 0;
    }
    
    @inline
    protected __ne(v: __Vector): boolean {
        return this.__compare(v) != 0;
    }

    @inline
    protected __gt(v: __Vector): boolean {
        return this.__compare(v) > 0;
    }

    @inline
    protected __gte(v: __Vector): boolean {
        return this.__compare(v) >= 0;
    }

    @inline
    protected __lt(v: __Vector): boolean {
        return this.__compare(v) < 0;
    }

    @inline
    protected __lte(v: __Vector): boolean {
        return this.__compare(v) <= 0;
    }

    @inline
    protected __compare(v: __Vector): i8 {
        const m = this.length;
        const n = v.length;

        if (m > n) {
            return 1;
        }

        if (m < n) {
            return -1;
        }

        let i: i32;

        for (i = m - 1; i > 0 && this[i] == v[i]; i--);
    
        if (this[i] > v[i]) {
            return 1;
        }

        if (this[i] < v[i]) {
            return -1;
        }

        return 0;
    }

    @inline
    protected __resize(newLength: i32): this {
        const newByteLength = __byteLength(newLength);
        const oldByteLength = <usize>this.buffer.byteLength;

        if (newByteLength > oldByteLength) {
            this.buffer = changetype<ArrayBuffer>(__renew(this.dataStart, newByteLength));

            // TODO: Only fill extra allocation wih zeros
            if (ASC_RUNTIME != 2) {
                memory.fill(this.dataStart + oldByteLength, 0, newByteLength - oldByteLength);
            }
        }

        this.length = newLength;

        return this;
    }

    @inline
    protected __zero(): this {
        this.length = 0;

        return this;
    }

    @inline
    protected __trim(): this {
        let length = this.length;

        while (this[length - 1] == 0) {
            length--;
        }

        this.length = length;

        return this;
    }

    @inline
    protected __clear(): this {
        memory.fill(this.dataStart, 0, <usize>this.length << alignof<u64>());

        return this;
    }

    @inline
    protected __copy(source: __Vector): this {
        memory.copy(this.dataStart, source.dataStart, <usize>source.length << alignof<u64>());

        return this;
    }

    @inline
    protected __swapBuffer(w: __Vector): this {
        if (w == this) {
            return this;
        }

        const buffer = this.buffer;

        this.length = w.length;
        this.buffer = w.buffer;

        w.length = 0;
        w.buffer = buffer;

        return this;
    }

    @inline
    @operator('[]')
    protected __get(index: i32): u64 {
        return load<u64>(this.dataStart + (<usize>index << alignof<u64>()));
    }

    @inline
    @operator('[]=')
    protected __set(index: i32, value: u64): void {
        store<u64>(this.dataStart + (<usize>index << alignof<u64>()), value);
    }

    @inline
    private __divLong(u: __Vector, v: __Vector, q: __Vector | null = null, r: __Vector | null = null): void {
        const l = u.length;
        const n = v.length;
        const m = l - n;

        __Vector.U.__resize(l + 1);
        __Vector.V.__resize(n + 1);
        __Vector.QHATV.__resize(n + 1);

        // D1: Normalize
        const b = <u8>clz(v[n - 1]);

        if (b != 0) {
            __shl_v(u, __Vector.U, 0, b, l);
            __shl_v(v, __Vector.V, 0, b, n);

            u = __Vector.U;
            v = __Vector.V;
        } else {
            u = __Vector.U.__copy(u);
            v = __Vector.V.__copy(v);
        }

        if (q != null) {
            q.__resize(m + 1);
        }

        // D2 ... D7
        __div_v_v(u, v, q, m, n);

        // D8: Unnormalize
        if (r !== null) {
            __shr_v(u, r, 0, b, l);
        }
    }

}

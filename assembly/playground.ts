class Int {

    // @ts-ignore
    @inline
    add<T, U>(x: T, y: U = NaN): this {
        if (isInteger(x)) {
            if (isFloat(y) && isNaN(y)) {
                return this.__addIntI64(this, x);
            }
            
            if (isInteger(y)) {
                return this.__addI64I64(x, y);
            }
            
            if (y instanceof Int) {
                return this.__addIntI64(y, x);
            }
        }

        if (x instanceof Int) {
            if (isFloat(y) && isNaN(y)) {
                return this.__addIntInt(this, x);
            }
            
            if (isInteger(y)) {
                return this.__addIntI64(x, y);
            }
            
            if (y instanceof Int) {
                return this.__addIntInt(x, y);
            }
        }

        throw new TypeError();
    }

    __addIntInt(x: Int, y: Int): this {
        return this;
    }

    __addIntI64(x: Int, y: i64): this {
        return this;
    }

    __addI64I64(x: i64, y: i64): this {
        return this;
    }

}

export function add(): void {
    const a = new Int();
    const b = new Int();
    const c = new Int();
    const d = 47;
    const e = 11;

    a.add(b);
    a.add(b, c);
    a.add(c, d);
    a.add(d, e);
    a.add(e, b);
}

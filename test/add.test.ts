import { expect } from 'chai';

import { add } from '../build/test.js';

describe('Addition', () => {
    const radix = 2n ** 64n;
    const max1Limb = radix - 1n;
    const max2Limbs = max1Limb + max1Limb * radix;
    const max3Limbs = max1Limb + max1Limb * radix + max1Limb * radix ** 2n;

    it('should add integers', () => {
        expect(add('47', '11')).to.equal('58');

        expect(
            add(max1Limb.toString(), max1Limb.toString())
        ).to.equal((max1Limb + max1Limb).toString());

        expect(
            add(max2Limbs.toString(), max2Limbs.toString())
        ).to.equal((max2Limbs + max2Limbs).toString());

        expect(
            add(max3Limbs.toString(), max3Limbs.toString())
        ).to.equal((max3Limbs + max3Limbs).toString());
    });

    it('should add a small and a big integer', () => {
        expect(add('4711', max2Limbs.toString())).to.equal((4711n + max2Limbs).toString());

        expect(
            add(max1Limb.toString(), max2Limbs.toString())
        ).to.equal((max1Limb + max2Limbs).toString());

        expect(
            add(max1Limb.toString(), max3Limbs.toString())
        ).to.equal((max1Limb + max3Limbs).toString());

        expect(
            add(max2Limbs.toString(), max3Limbs.toString())
        ).to.equal((max2Limbs + max3Limbs).toString());
    });

    it('should add a big and a small integer', () => {
        expect(add(max2Limbs.toString(), '4711')).to.equal((max2Limbs + 4711n).toString());

        expect(
            add(max2Limbs.toString(), max1Limb.toString())
        ).to.equal((max2Limbs + max1Limb).toString());

        expect(
            add(max3Limbs.toString(), max1Limb.toString())
        ).to.equal((max3Limbs + max1Limb).toString());

        expect(
            add(max3Limbs.toString(), max2Limbs.toString())
        ).to.equal((max3Limbs + max2Limbs).toString());
    });

    it('should add positive integers', () => {
        expect(add('47', '11')).to.equal('58');
    });

    it('should add a positive and a negative integer', () => {
        expect(add('47', '-11')).to.equal('36');
    });

    it('should add a negative and a positive integer', () => {
        expect(add('-47', '11')).to.equal('-36');
    });

    it('should add negative integers', () => {
        expect(add('-47', '-11')).to.equal('-58');
    });

});

import { expect } from 'chai';

import { mul } from '../build/test.js';

describe('Multiplication', () => {

    it('should multiply numbers', () => {
        const u = '4711';
        const v = '1284';

        expect(mul(u, v)).to.equal('6048924');
    });

});

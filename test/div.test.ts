import { expect } from 'chai';

import { div } from '../build/test.js';

describe('Division', () => {

    it('should divide numbers', () => {
        const u = '4711';
        const v = '1284';

        expect(div(u, v)).to.equal('3');
    });

});

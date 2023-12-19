import { expect } from 'chai';

import { convertString, convertInt } from '../build/test.js';

describe('Conversion', () => {

    it('should convert strings', () => {
        expect(convertString('4711', 10)).to.equal('4711');
        expect(convertString('47836600353962055184629472945104', 10)).to.equal('47836600353962055184629472945104');
        expect(convertString('25bc864621c5355fcec8533e3d0', 16)).to.equal('25bc864621c5355fcec8533e3d0');
    });

    it('should convert integers', () => {
        expect(convertInt(4711n)).to.equal('4711');
    });

});

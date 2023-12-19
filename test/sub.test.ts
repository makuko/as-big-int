import { expect } from 'chai';

import { sub } from '../build/test.js';

describe('Subtraction', () => {

    it('should subtract positive integers', () => {
        expect(sub('47', '11')).to.equal('36');
        expect(sub('11', '47')).to.equal('-36');
        expect(
            sub('47836600353962055184629472945104', '11804871254037294784519034184638')
        ).to.equal('36031729099924760400110438760466');
    });

    it('should subtract a positive and a negative integer', () => {
        expect(sub('47', '-11')).to.equal('58');
        expect(sub('11', '-47')).to.equal('58');
        expect(
            sub('47836600353962055184629472945104', '-11804871254037294784519034184638')
        ).to.equal('59641471607999349969148507129742');
    });

    it('should subtract a negative and a positive integer', () => {
        expect(sub('-47', '11')).to.equal('-58');
        expect(sub('-11', '47')).to.equal('-58');
        expect(
            sub('-47836600353962055184629472945104', '11804871254037294784519034184638')
        ).to.equal('-59641471607999349969148507129742');
    });

    it('should subtract negative integers', () => {
        expect(sub('-47', '-11')).to.equal('-36');
        expect(sub('-11', '-47')).to.equal('36');
        expect(
            sub('-47836600353962055184629472945104', '-11804871254037294784519034184638')
        ).to.equal('-36031729099924760400110438760466');
    });

});

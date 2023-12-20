import * as f from './formatters';

describe('formatters/mw', () => {
    test('should return MW for values < 10,000', () => {
        expect(f.formatters.mw(100)).toBe('100 MW');
        expect(f.formatters.mw(1000)).toBe('1,000 MW');
        expect(f.formatters.mw(10000)).toBe('10,000 MW');
    })
    test('should return GW for values > 10,000', () => {
        expect(f.formatters.mw(100000)).toBe('100 GW');
        expect(f.formatters.mw(1000000)).toBe('1,000 GW');
        expect(f.formatters.mw(10000000)).toBe('10,000 GW');
    })
    test('should return kW for values < 1', () => {
        expect(f.formatters.mw(0.1)).toBe('100 kW');
        expect(f.formatters.mw(0.01)).toBe('10 kW');
        expect(f.formatters.mw(0.001)).toBe('1 kW');
    })
})
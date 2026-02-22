import { calculateBondMetrics } from './bond-engine';

describe('Bond Engine', () => {
    it('should calculate discount bond correctly', () => {
        // Face: 1000, Coupon: 5%, Market: 950, Years: 5, Freq: 2 (Semi-annual)
        const result = calculateBondMetrics(1000, 5, 950, 5, 2);

        expect(result.premiumOrDiscount).toBe('Discount');
        // Current Yield = (50 / 950) * 100 = 5.26%
        expect(result.currentYield).toBeCloseTo(5.26, 1);
        expect(result.currentYield).toBeGreaterThan(5);
        expect(result.ytm).toBeGreaterThan(5);
    });

    it('should calculate premium bond correctly', () => {
        // Face: 1000, Coupon: 8%, Market: 1100, Years: 5, Freq: 2
        const result = calculateBondMetrics(1000, 8, 1100, 5, 2);

        expect(result.premiumOrDiscount).toBe('Premium');
        // Current Yield = (80 / 1100) * 100 = 7.27%
        expect(result.currentYield).toBeLessThan(8);
    });

    it('should handle zero coupon bond', () => {
        // Face: 1000, Coupon: 0%, Market: 800, Years: 5, Freq: 1
        const result = calculateBondMetrics(1000, 0, 800, 5, 1);

        expect(result.currentYield).toBe(0);
        expect(result.ytm).toBeGreaterThan(0);
        // YTM = ((1000/800)^(1/5) - 1) * 100 = 4.56%
        expect(result.ytm).toBeCloseTo(4.56, 1);
    });

    it('should handle bond at par', () => {
        const result = calculateBondMetrics(1000, 5, 1000, 5, 2);

        expect(result.premiumOrDiscount).toBe('Par');
        expect(result.currentYield).toBe(5);
        expect(result.ytm).toBeCloseTo(5, 1);
    });

    it('should generate correct number of cash flows', () => {
        const years = 5;
        const frequency = 2;
        const result = calculateBondMetrics(1000, 5, 950, years, frequency);

        expect(result.cashFlows.length).toBe(years * frequency);
        expect(result.cashFlows[0].couponPayment).toBe(25); // (1000 * 0.05) / 2
        expect(result.cashFlows[result.cashFlows.length - 1].remainingPrincipal).toBe(0);
    });
});

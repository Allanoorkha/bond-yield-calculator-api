export interface BondCalculationsParams {
    faceValue: number;
    couponRate: number;
    marketPrice: number;
    yearsToMaturity: number;
    frequency: number;
}

export interface CashFlow {
    period: number;
    amount: number;
    type: 'coupon' | 'coupon_and_principal';
}

/**
 * Calculates current yield as a percentage
 */
export function calculateCurrentYield(params: BondCalculationsParams): number {
    const { faceValue, couponRate, marketPrice } = params;
    // Assuming coupon rate is provided as a percentage (e.g., 5 for 5%)
    const annualCoupon = faceValue * (couponRate / 100);
    return (annualCoupon / marketPrice) * 100;
}

/**
 * Calculates total interest to be paid over the lifespan of the bond
 */
export function calculateTotalInterest(params: BondCalculationsParams): number {
    const { faceValue, couponRate, yearsToMaturity } = params;
    const annualCoupon = faceValue * (couponRate / 100);
    return annualCoupon * yearsToMaturity;
}

/**
 * Generates an array of cash flows over the period
 */
export function generateCashFlows(params: BondCalculationsParams): CashFlow[] {
    const { faceValue, couponRate, yearsToMaturity, frequency } = params;
    const totalPeriods = yearsToMaturity * frequency;
    const couponPayment = (faceValue * (couponRate / 100)) / frequency;

    const cashFlows: CashFlow[] = [];

    for (let i = 1; i <= totalPeriods; i++) {
        cashFlows.push({
            period: i,
            amount: i === totalPeriods ? couponPayment + faceValue : couponPayment,
            type: i === totalPeriods ? 'coupon_and_principal' : 'coupon',
        });
    }

    return cashFlows;
}

/**
 * Calculates Yield To Maturity (YTM) using binary search. Returns as a percentage.
 */
export function calculateYTM(params: BondCalculationsParams): number {
    const { faceValue, couponRate, marketPrice, yearsToMaturity: years, frequency } = params;
    const periods = years * frequency;
    const coupon = (faceValue * couponRate) / 100 / frequency;

    let low = 0;
    let high = 1; // 100%
    let mid = 0;
    let price = 0;

    const tolerance = 0.00001;

    for (let i = 0; i < 100; i++) {
        mid = (low + high) / 2;
        price = 0;

        for (let t = 1; t <= periods; t++) {
            price += coupon / Math.pow(1 + mid / frequency, t);
        }

        price += faceValue / Math.pow(1 + mid / frequency, periods);

        if (Math.abs(price - marketPrice) < tolerance) {
            break;
        }

        if (price > marketPrice) {
            low = mid;
        } else {
            high = mid;
        }
    }

    return mid * 100; // return as %
}


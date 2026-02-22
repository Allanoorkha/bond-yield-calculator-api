import { addMonths, format } from 'date-fns';
import { calculateYTM } from './ytm';

function round(value: number): number {
    return Number(value.toFixed(2));
}

/**
 * Calculates YTM for a zero-coupon bond
 */
function calculateZeroCouponYTM(
    faceValue: number,
    marketPrice: number,
    years: number,
): number {
    return (Math.pow(faceValue / marketPrice, 1 / years) - 1) * 100;
}


export interface CashFlow {
    period: number;
    paymentDate: Date;
    couponPayment: number;
    cumulativeInterest: number;
    remainingPrincipal: number;
}


/**
 * Generates a detailed schedule of cash flows with dates
 */
function generateCashFlows(
    faceValue: number,
    couponRate: number,
    years: number,
    frequency: number,
): CashFlow[] {
    const periods = years * frequency;
    const coupon = (faceValue * couponRate) / 100 / frequency;

    const monthsPerPeriod = 12 / frequency;
    const today = new Date();

    let cumulativeInterest = 0;
    const flows: CashFlow[] = [];

    for (let period = 1; period <= periods; period++) {
        cumulativeInterest += coupon;

        const paymentDate = addMonths(today, monthsPerPeriod * period);

        flows.push({
            period,
            paymentDate,
            couponPayment: round(coupon),
            cumulativeInterest: round(cumulativeInterest),
            remainingPrincipal: period === periods ? 0 : faceValue,
        });
    }

    return flows;
}



export function calculateBondMetrics(
    faceValue: number,
    couponRate: number,
    marketPrice: number,
    years: number,
    frequency: number,
) {
    const annualCoupon = (faceValue * couponRate) / 100;

    const currentYield =
        annualCoupon === 0 ? 0 : (annualCoupon / marketPrice) * 100;

    const totalInterest = annualCoupon * years;

    const ytm =
        annualCoupon === 0
            ? calculateZeroCouponYTM(faceValue, marketPrice, years)
            : calculateYTM(
                faceValue,
                couponRate,
                marketPrice,
                years,
                frequency,
            );

    const premiumOrDiscount =
        marketPrice > faceValue
            ? 'Premium'
            : marketPrice < faceValue
                ? 'Discount'
                : 'Par';

    const cashFlows = generateCashFlows(
        faceValue,
        couponRate,
        years,
        frequency,
    );

    return {
        currentYield: round(currentYield),
        ytm: round(ytm),
        totalInterest: round(totalInterest),
        premiumOrDiscount,
        cashFlows,
    };
}

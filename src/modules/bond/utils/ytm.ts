export function calculateYTM(
    faceValue: number,
    couponRate: number,
    marketPrice: number,
    years: number,
    frequency: number,
): number {
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


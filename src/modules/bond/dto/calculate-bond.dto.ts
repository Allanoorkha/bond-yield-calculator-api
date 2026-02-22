import { IsNumber, Min } from 'class-validator';

export class CalculateBondDto {
    @IsNumber()
    @Min(1)
    faceValue: number;

    @IsNumber()
    @Min(0)
    couponRate: number;

    @IsNumber()
    @Min(1)
    marketPrice: number;

    @IsNumber()
    @Min(1)
    yearsToMaturity: number;

    @IsNumber()
    frequency: number; // 1 = annual, 2 = semi-annual
}

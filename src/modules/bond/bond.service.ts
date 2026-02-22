import { Injectable } from '@nestjs/common';
import { CalculateBondDto } from './dto/calculate-bond.dto';
import { calculateBondMetrics } from './utils/bond-engine';

@Injectable()
export class BondService {
    calculate(dto: CalculateBondDto) {
        return calculateBondMetrics(
            dto.faceValue,
            dto.couponRate,
            dto.marketPrice,
            dto.yearsToMaturity,
            dto.frequency,
        );
    }
}
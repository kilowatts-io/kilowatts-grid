
import { object, string, number, date, InferType, array } from 'yup';

// Elexon Insights API 


// reusable params

export type ElexonSettlementPeriodParams = {
    settlementDate: string;
    settlementPeriod: number;
}

export type ElexonRangeParams = {
    from: string; // a Date iso string in format YYYY-MM-DD
    to: string; // a Date iso string in format YYYY-MM-DD
    settlementPeriodFrom?: number;
    settlementPeriodTo?: number;
}


let elexonInsightsPNDataRecordSchema = object({
    dataset: string().required().equals(['PN']),
    settlementDate: string().required(),
    settlementPeriod: number().required(),
    timeFrom: string().required(),
    timeTo: string().required(),
    levelFrom: number().required(),
    levelTo: number().required(),
    nationalGridBmUnit: string().required(),
    bmUnit: string().required(),
})

export type ElexonInsightsPNDataRecord = InferType<typeof elexonInsightsPNDataRecordSchema>

type OptionalBmUnitParams = {
    bmUnits?: string[];
}

export type ElexonInsightsPnSpParams = ElexonSettlementPeriodParams & OptionalBmUnitParams

export type ElexonInsightsPnRangeParams = ElexonRangeParams & OptionalBmUnitParams


export type ElexonInsightsPnResponseRaw = {
    data: ElexonInsightsPNDataRecord[];
}

export const elexonInsightsPnResponseRawSchema = object({
    data: array(elexonInsightsPNDataRecordSchema).required()
})

export type ElexonInsightsPnResponseRange = ElexonInsightsPNDataRecord[];

export type BmUnitId = string
export type DateString = string
export type LevelDict = Record<DateString, number>
export type LevelPair = {time: string, level: number}
export type BmUnitValues = Record<BmUnitId, number>
export type BmUnitLevelPairs = Record<BmUnitId, LevelPair[]>

export type ElexonInsightsPnResponseParsed = BmUnitLevelPairs

export type ElexonInsightsAcceptancesDataRecord = {
    settlementDate: string;
    setttlementPeriodFrom: number;
    setttlementPeriodTo: number;
    timeFrom: string;
    timeTo: string;
    levelFrom: number;
    levelTo: number;
    nationalGridBmUnit: string;
    bmUnit: string;
    acceptanceNumber: number;
    acceptanceTime: string;
    deemedBoFlag: boolean;
    soFlag: boolean;
    storFlag: boolean;
    rrFlag: boolean;
}

export type ElexonInsightsAcceptancesSpParams = ElexonInsightsPnSpParams
export type ElexonInsightsAcceptancesRangeParams = ElexonRangeParams & OptionalBmUnitParams

export type ElexonInsightsAcceptancesResponse = {
    data: ElexonInsightsAcceptancesDataRecord[];
}

export type ElexonInsightsAcceptancesRangeResponse = ElexonInsightsAcceptancesDataRecord[];

export type ElexonInsightsAcceptancesParsedNoLevels = {
    bmUnit: string;
    acceptanceNumber: number;
    acceptanceTime: string;
    deemedBoFlag: boolean;
    soFlag: boolean;
    storFlag: boolean;
    rrFlag: boolean;
}

export type ElexonInsightsAcceptancesParsed = ElexonInsightsAcceptancesParsedNoLevels & {
    levels: LevelPair[];
}

export type ElexonInsightsAcceptancesResponseParsed = Record<BmUnitId, ElexonInsightsAcceptancesParsed[]>

export type FuelType = 'gas' | 'coal' | 'nuclear' | 'wind' | 'hydro' | 'biomass' | 'solar' | 'oil' | 'interconnector' | 'unknown' | 'battery'

export type UnitGroupUnit = {
    bmUnit: string;
    name?: string;
}

export type UnitGroupDetails = {
    code?: string;
    name: string; // Pembroke
    coords: {
        lat: number;
        lng: number;
    }
    fuelType: FuelType
}

export type UnitGroup = {
    details: UnitGroupDetails;
    units: UnitGroupUnit[]
}

export type UnitGroupUnitLevel = {
    unit: UnitGroupUnit;
    level: number;
}

export type UnitGroupLevel = {
    details: UnitGroupDetails;
    units: UnitGroupUnitLevel[]
    level: number;
}


export type FuelTypeLevel = {
    name: FuelType
    level: number;
    unitGroupLevels: UnitGroupLevel[]
}

export type UnitGroupsDict = Record<string, UnitGroup>


// Elexon Insights API 

export type ElexonSettlementDateParams = {
    settlementDate: string;
    settlementPeriod: number;
}

export type ElexonSettlementPeriodParams = {
    settlementDate: string;
    settlementPeriod: number;
}

export type ElexonSettlementDateOrPeriodParams = ElexonSettlementDateParams | ElexonSettlementPeriodParams

export type ElexonInsightsPNDataRecord = {
    dataset: 'PN';
    settlementDate: string;
    settlementPeriod: number;
    timeFrom: string;
    timeTo: string;
    levelFrom: number;
    levelTo: number;
    nationalGridBmUnit: string;
    bmUnit: string;
}

export type ElexonInsightsPNAllParams = ElexonSettlementDateOrPeriodParams 

export type ElexonInsightsPnResponseRaw = {
    data: ElexonInsightsPNDataRecord[];
}

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
    acceptanceNumber: number;
    acceptanceTime: string;
    deemedBoFlag: boolean;
    soFlag: boolean;
    storFlag: boolean;
    rrFlag: boolean;
}

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
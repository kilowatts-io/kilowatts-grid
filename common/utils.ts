import * as t from './types'
import log from '../services/log'

const londonTime = (date: Date) => date.toLocaleString('en-GB', { timeZone: 'Europe/London' });

export const getSettlementPeriod = (dateString?: string):t.ElexonSettlementPeriodParams => {
    const date = londonTime(dateString ? new Date(dateString) : new Date())
    // in DD/MM/YYYY, HH:MM:SS format
    const [day, month, year, hour, minute] = date.split(/[\/\s,:]+/)
    const settlementDate = `${year}-${month}-${day}`
    const settlementPeriod = parseInt(hour) * 2 + (parseInt(minute) >= 30 ? 1 : 0) + 1
    log.debug(`getSettlementPeriod: ${settlementDate}:${settlementPeriod} for ${dateString}`)
    return {
        settlementDate,
        settlementPeriod
    }
}
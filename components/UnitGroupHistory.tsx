import React from 'react'
import { UnitGroup } from '../common/types'
import log from '../services/log'
import { Stack } from 'expo-router'

type UnitGroupHistoryProps = {
    ug: UnitGroup
}

export const UnitGroupHistory:React.FC<UnitGroupHistoryProps> = ({ ug }) => {
    log.debug('UnitGroupHistory')
    return (
        <>
        </>
    )
}
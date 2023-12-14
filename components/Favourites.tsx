import React from 'react'
import {Text} from 'react-native'
import {getFavourites} from '../services/state/favourites'
import { useAppSelector } from '../services/state'

export const FavouritesList:React.FC = () => {
    const favourites = useAppSelector(state => getFavourites(state))
    console.log(favourites)
    return (
        <Text>List</Text>
    )
}
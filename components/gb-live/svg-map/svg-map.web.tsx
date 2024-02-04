import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const SvgMapWeb = () => {
    return (
        <View style={styles.container}>
            <Text>Map is not yet available on the web. Try our mobile app</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default SvgMapWeb
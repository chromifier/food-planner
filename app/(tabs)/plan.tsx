import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const PlanScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.textHeader}>Plan Screen</Text>
            <Text style={styles.textContent}>Plan the week based on selected meals</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#25292e',
    },
    textHeader: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    textContent: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginTop: 10,
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    }
});

export default PlanScreen;
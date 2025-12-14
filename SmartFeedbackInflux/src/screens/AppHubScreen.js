import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';

const AppHubScreen = ({ navigation, onLogout }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>SmartFeedback Hub</Text>
            <Text style={styles.subtitle}>Select an Action</Text>

            <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={() => navigation.navigate('BookList')}
            >
                <Text style={styles.buttonText}>📚 Manage Classes (Books)</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('FeedbackLibrary')}
            >
                <Text style={styles.buttonText}>📝 Reusable Feedback Library</Text>
            </TouchableOpacity>
            
            <View style={styles.spacer} />

            <Button
                title="Log Out"
                onPress={() => onLogout(false)}
                color="#cc0000"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#0056b3',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 40,
        color: '#666',
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#0056b3',
        padding: 18,
        borderRadius: 8,
        marginBottom: 15,
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: '#38761d',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    spacer: {
        flex: 1,
        minHeight: 50,
    }
});

export default AppHubScreen;
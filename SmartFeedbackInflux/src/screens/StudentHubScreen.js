import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button } from 'react-native';
import { getFeedbacksByStudentName, getAuthUser } from '../database/storage';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const FeedbackItem = ({ feedback }) => (
    <View style={itemStyles.item}>
        <Text style={itemStyles.title}>{feedback.title}</Text>
        <Text style={itemStyles.content}>{feedback.content}</Text>
        <View style={itemStyles.footer}>
            <Text style={itemStyles.author}>Teacher: {feedback.author}</Text>
            <Text style={itemStyles.date}>Date: {new Date(feedback.created_at).toLocaleDateString('en-US')}</Text>
        </View>
    </View>
);

const StudentHubScreen = ({ onLogout }) => {
    const insets = useSafeAreaInsets();
    const [feedbacks, setFeedbacks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [studentName, setStudentName] = useState('Student');

    const loadData = async () => {
        setIsLoading(true);
        try {
            const user = await getAuthUser();
            const name = user?.fullName || user?.username || 'Student';
            setStudentName(name);

            const data = await getFeedbacksByStudentName(name);
            setFeedbacks(data);
        } catch (error) {
            setFeedbacks([]);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0056b3" />
            </View>
        );
    }
    
    const headerBoxStyle = {
        ...styles.headerBox,
        paddingTop: insets.top + 10,
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <View style={headerBoxStyle}>
                <Text style={styles.welcomeText}>Welcome, {studentName}!</Text>
                <Text style={styles.feedbackTitle}>Your Recorded Feedbacks ({feedbacks.length})</Text>
            </View>

            <FlatList
                data={feedbacks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <FeedbackItem feedback={item} />}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyText}>No feedbacks have been recorded for you yet.</Text>
                )}
                contentContainerStyle={styles.listContent}
            />

            <View style={styles.logoutContainer}>
                <Button
                    title="Log Out"
                    onPress={() => onLogout(false)}
                    color="#cc0000"
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerBox: {
        backgroundColor: '#0056b3',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    feedbackTitle: {
        fontSize: 18,
        color: '#e6f0ff',
        fontWeight: '600',
    },
    listContent: {
        padding: 10,
        paddingBottom: 20,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#888',
    },
    logoutContainer: {
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
    }
});

const itemStyles = StyleSheet.create({
    item: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
        borderLeftWidth: 5,
        borderLeftColor: '#38761d',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    content: {
        fontSize: 14,
        color: '#555',
        marginBottom: 10,
        lineHeight: 20,
    },
    footer: {
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    author: {
        fontSize: 12,
        fontWeight: '600',
        color: '#555',
    },
    date: {
        fontSize: 12,
        color: '#555',
    }
});

export default StudentHubScreen;
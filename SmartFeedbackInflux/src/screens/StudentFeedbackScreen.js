import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { getFeedbacksByStudentId, deleteGivenFeedback } from '../database/storage';
import { useFocusEffect } from '@react-navigation/native';

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

const GivenFeedbackItem = ({ feedback, onDelete, studentName }) => {
    const creationTime = feedback.created_at;
    const expirationTime = creationTime + THREE_DAYS_MS;
    const isDeletable = Date.now() < expirationTime;

    const handleDelete = () => {
        Alert.alert(
            "Confirm Deletion",
            `Are you sure you want to delete this feedback given to ${studentName}? This action is only possible within 3 days.`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => onDelete(feedback.id) }
            ]
        );
    };

    return (
        <View style={givenStyles.item}>
            <Text style={givenStyles.title}>{feedback.title}</Text>
            <Text style={givenStyles.content}>{feedback.content}</Text>
            <View style={givenStyles.footer}>
                <View>
                    <Text style={givenStyles.author}>Author: {feedback.author}</Text>
                    <Text style={givenStyles.date}>Date: {new Date(creationTime).toLocaleDateString('en-US')}</Text>
                </View>
                {isDeletable && (
                    <TouchableOpacity style={givenStyles.deleteButton} onPress={handleDelete}>
                        <Text style={givenStyles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                )}
                {!isDeletable && (
                    <Text style={givenStyles.expiredText}>Deletion window expired</Text>
                )}
            </View>
        </View>
    );
};

const StudentFeedbackScreen = ({ route, navigation }) => {
    const { studentId, studentName, bookName } = route.params;
    
    const [givenFeedbacks, setGivenFeedbacks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const givens = await getFeedbacksByStudentId(studentId);
            setGivenFeedbacks(givens);
        } catch (error) {
            setGivenFeedbacks([]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDeleteGivenFeedback = async (id) => {
        const success = await deleteGivenFeedback(id);
        if (success) {
            Alert.alert("Success", "Recorded feedback successfully deleted.");
            loadData();
        } else {
            Alert.alert("Error", "Could not delete the recorded feedback.");
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [studentId])
    );
    
    const handleGiveFeedback = () => {
        navigation.navigate('GiveFeedback', { 
            studentId: studentId, 
            studentName: studentName, 
            bookName: bookName 
        });
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0056b3" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.studentInfoBox}>
                <Text style={styles.studentName}>{studentName}</Text>
                <Text style={styles.classInfo}>Class: {bookName}</Text>
                
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleGiveFeedback}
                >
                    <Text style={styles.actionButtonText}>+ Give New Feedback</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.givenHeader}>Recorded Feedbacks ({givenFeedbacks.length})</Text>
            
            <FlatList
                data={givenFeedbacks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <GivenFeedbackItem 
                        feedback={item} 
                        onDelete={handleDeleteGivenFeedback}
                        studentName={studentName}
                    />
                )}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyText}>No feedbacks recorded for this student yet.</Text>
                )}
                contentContainerStyle={styles.listContent}
            />
        </View>
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
    listContent: {
        padding: 10,
        paddingBottom: 50,
    },
    studentInfoBox: {
        backgroundColor: '#0056b3',
        padding: 20,
        marginBottom: 0,
    },
    studentName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
    },
    classInfo: {
        fontSize: 16,
        color: '#e6f0ff',
        marginTop: 4,
        marginBottom: 15,
    },
    actionButton: {
        backgroundColor: '#38761d',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    givenHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#eee',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#888',
    }
});

const givenStyles = StyleSheet.create({
    item: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 8,
        borderLeftWidth: 5,
        borderLeftColor: '#38761d',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
    content: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
        lineHeight: 20,
    },
    footer: {
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    author: {
        fontSize: 11,
        color: '#555',
        fontWeight: 'bold',
    },
    date: {
        fontSize: 11,
        color: '#555',
    },
    deleteButton: {
        backgroundColor: '#cc0000',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    expiredText: {
        fontSize: 12,
        color: '#cc0000',
        fontStyle: 'italic',
    }
});

export default StudentFeedbackScreen;
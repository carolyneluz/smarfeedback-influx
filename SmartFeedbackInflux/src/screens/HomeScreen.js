import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Button, FlatList, ActivityIndicator, TouchableOpacity, Alert, Clipboard } from 'react-native';
import { getFeedbacks, deleteFeedback } from '../database/storage';
import { useFocusEffect } from '@react-navigation/native';

const FeedbackItem = ({ feedback, onDelete }) => {
    const handleReuse = () => {
        Clipboard.setString(feedback.content);
        Alert.alert("Copied!", "The feedback content has been copied to the clipboard. You can now paste it.");
    };

    const handleDelete = () => {
        Alert.alert(
            "Confirm Deletion",
            `Are you sure you want to delete the feedback: "${feedback.title}"?`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => onDelete(feedback.id) }
            ]
        );
    };

    return (
        <View style={itemStyles.item}>
            <Text style={itemStyles.title}>{feedback.title}</Text>
            <Text style={itemStyles.content}>{feedback.content}</Text>
            <View style={itemStyles.footer}>
                <TouchableOpacity style={itemStyles.deleteButton} onPress={handleDelete}>
                    <Text style={itemStyles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity style={itemStyles.reuseButton} onPress={handleReuse}>
                    <Text style={itemStyles.reuseButtonText}>Copy Text</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const HomeScreen = ({ navigation }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadFeedbacks = async () => {
        setIsLoading(true);
        try {
            const data = await getFeedbacks();
            setFeedbacks(data);
        } catch (error) {
            setFeedbacks([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteFeedback = async (id) => {
        const success = await deleteFeedback(id);
        if (success) {
            Alert.alert("Success", "Feedback successfully deleted.");
            loadFeedbacks();
        } else {
            Alert.alert("Error", "Could not delete the feedback.");
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadFeedbacks();
        }, [])
    );

    const handleNewFeedback = () => {
        navigation.navigate('NewFeedback');
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
            <FlatList
                data={feedbacks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <FeedbackItem feedback={item} onDelete={handleDeleteFeedback} />}
                ListHeaderComponent={() => (
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>Reusable Feedback Library</Text>
                        <Text style={styles.subtitle}>Total: {feedbacks.length}</Text>
                        <Button 
                            title="Create New Feedback" 
                            onPress={handleNewFeedback}
                            color="#38761d"
                        />
                    </View>
                )}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyText}>No reusable feedbacks found. Click "Create New Feedback" to start.</Text>
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
    listContent: {
        padding: 10,
        paddingBottom: 50,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginBottom: 10,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#0056b3',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 15,
        color: '#666',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#888',
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
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 8,
        marginTop: 5,
    },
    deleteButton: {
        backgroundColor: '#cc0000',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginRight: 10,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    reuseButton: {
        backgroundColor: '#38761d',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    reuseButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    }
});

export default HomeScreen;
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Clipboard, ActivityIndicator, TextInput, ScrollView } from 'react-native';
import { getFeedbacks, addGivenFeedback, getAuthUser } from '../database/storage';
import { useFocusEffect } from '@react-navigation/native';

const ReusableFeedbackItem = ({ feedback, onAssign }) => {
    const handleCopy = () => {
        Clipboard.setString(feedback.content);
        Alert.alert("Copied!", "The content was copied to the clipboard.");
    };

    return (
        <View style={reusableStyles.item}>
            <Text style={reusableStyles.title}>{feedback.title}</Text>
            <Text style={reusableStyles.content}>{feedback.content}</Text>
            
            <View style={reusableStyles.footer}>
                <View style={reusableStyles.actions}>
                    <TouchableOpacity style={reusableStyles.copyButton} onPress={handleCopy}>
                        <Text style={reusableStyles.buttonText}>Copy Text</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={reusableStyles.assignButton} 
                        onPress={() => onAssign(feedback)}
                    >
                        <Text style={reusableStyles.buttonText}>Give Feedback</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const GiveFeedbackScreen = ({ route, navigation }) => {
    const { studentId, studentName, bookName } = route.params;
    
    const [reusableFeedbacks, setReusableFeedbacks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [authorUsername, setAuthorUsername] = useState('Unknown');
    const [customContent, setCustomContent] = useState('');
    const [customTitle, setCustomTitle] = useState('');

    const loadData = async () => {
        setIsLoading(true);
        try {
            const user = await getAuthUser();
            setAuthorUsername(user?.username || 'System User');
            const data = await getFeedbacks();
            setReusableFeedbacks(data);
        } catch (error) {
            setReusableFeedbacks([]);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const recordFeedback = async (title, content) => {
        const newGivenFeedback = {
            studentId: studentId,
            title: title,
            content: content,
            author: authorUsername, 
        };

        const result = await addGivenFeedback(newGivenFeedback);

        if (result) {
            Alert.alert("Success", `Feedback recorded for ${studentName}.`);
            navigation.goBack(); 
        } else {
            Alert.alert("Error", "Could not record the feedback.");
        }
    };

    const handleAssignReusableFeedback = (feedbackToAssign) => {
        recordFeedback(feedbackToAssign.title, feedbackToAssign.content);
    };

    const handleSaveCustomFeedback = () => {
        if (!customContent.trim()) {
            Alert.alert("Error", "Custom content is required.");
            return;
        }
        const title = customTitle.trim() || `Custom Feedback (${new Date().toLocaleDateString('en-US')})`;
        recordFeedback(title, customContent.trim());
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
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.studentInfoBox}>
                    <Text style={styles.studentName}>{studentName}</Text>
                    <Text style={styles.classInfo}>Class: {bookName}</Text>
                </View>

                <Text style={styles.sectionHeader}>Give Personalized Feedback</Text>
                
                <View style={styles.customFeedbackSection}>
                    <TextInput
                        style={styles.customInput}
                        placeholder="Title (Optional)"
                        value={customTitle}
                        onChangeText={setCustomTitle}
                    />
                    <TextInput
                        style={[styles.customInput, styles.customTextArea]}
                        placeholder="Write the personalized feedback here (Required)"
                        value={customContent}
                        onChangeText={setCustomContent}
                        multiline
                        numberOfLines={4}
                    />
                    <TouchableOpacity
                        style={styles.saveCustomButton}
                        onPress={handleSaveCustomFeedback}
                    >
                        <Text style={styles.saveCustomButtonText}>Save Personalized Feedback</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionHeader}>Select Reusable Feedback</Text>
                
                <FlatList
                    data={reusableFeedbacks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <ReusableFeedbackItem 
                            feedback={item} 
                            onAssign={handleAssignReusableFeedback} 
                        />
                    )}
                    ListEmptyComponent={() => (
                        <Text style={styles.emptyText}>No reusable feedbacks found.</Text>
                    )}
                    contentContainerStyle={styles.listContent}
                    scrollEnabled={false} 
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        paddingBottom: 50,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    studentInfoBox: {
        backgroundColor: '#0056b3',
        padding: 20,
        marginBottom: 10,
    },
    studentName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    classInfo: {
        fontSize: 16,
        color: '#e6f0ff',
        marginTop: 4,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#eee',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    customFeedbackSection: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 0,
        borderWidth: 0,
    },
    customInput: {
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 4,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#eee',
        fontSize: 16,
    },
    customTextArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    saveCustomButton: {
        backgroundColor: '#0056b3',
        padding: 12,
        borderRadius: 5,
        marginTop: 5,
        alignItems: 'center',
    },
    saveCustomButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    emptyText: {
        textAlign: 'center',
        padding: 20,
        fontSize: 14,
        color: '#888',
    }
});

const reusableStyles = StyleSheet.create({
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
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 8,
        marginTop: 5,
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    copyButton: {
        backgroundColor: '#cc0000',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    assignButton: {
        backgroundColor: '#38761d',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    }
});

export default GiveFeedbackScreen;
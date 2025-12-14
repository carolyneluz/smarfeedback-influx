import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { addFeedback } from '../database/storage';

const NewFeedbackScreen = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) {
            Alert.alert("Error", "Title and Content are mandatory.");
            return;
        }

        const newFeedback = {
            title: title.trim(),
            content: content.trim(),
            is_reusable: 1, 
        };

        const savedFeedback = await addFeedback(newFeedback);

        if (savedFeedback) {
            Alert.alert("Success", "Feedback saved and ready for reuse!", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } else {
            Alert.alert("Error", "Could not save the feedback.");
        }
    };

    return (
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
            <Text style={styles.header}>Create New Reusable Feedback</Text>

            <Text style={styles.label}>Title (Ex: Great Participation)</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter a short, descriptive title"
            />

            <Text style={styles.label}>Content (Full Bulletin Text)</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                value={content}
                onChangeText={setContent}
                placeholder="Enter the detailed feedback text"
                multiline
                numberOfLines={4}
            />

            <Button
                title="Save Feedback"
                onPress={handleSave}
                color="#0056b3"
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#0056b3',
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
        marginTop: 10,
        color: '#333',
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
});

export default NewFeedbackScreen;
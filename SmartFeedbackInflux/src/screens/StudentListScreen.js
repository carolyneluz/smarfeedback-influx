import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getStudentsByBookId } from '../database/storage';
import { useFocusEffect } from '@react-navigation/native';

const StudentListScreen = ({ route, navigation }) => {
    const { bookId, bookName } = route.params;
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadStudents = async () => {
        setIsLoading(true);
        try {
            const data = await getStudentsByBookId(bookId);
            setStudents(data);
        } catch (error) {
            setStudents([]);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadStudents();
        }, [])
    );

    const renderStudentItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.item}
            onPress={() => navigation.navigate('StudentFeedback', { studentId: item.id, studentName: item.name, bookName })}
        >
            <Text style={styles.studentName}>{item.name}</Text>
            <Text style={styles.detailText}>View Feedbacks →</Text>
        </TouchableOpacity>
    );

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
                data={students}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderStudentItem}
                ListHeaderComponent={() => (
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerTitle}>{bookName} Students</Text>
                        <Text style={styles.headerSubtitle}>Total: {students.length}</Text>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <Text style={styles.emptyText}>No students found in this class.</Text>
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
        padding: 15,
        paddingBottom: 50,
    },
    headerContainer: {
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0056b3',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    item: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
    },
    studentName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    detailText: {
        color: '#0056b3',
        fontWeight: 'bold',
        fontSize: 14,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#888',
    }
});

export default StudentListScreen;
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { setupInitialData, getAuthUser } from './src/database/storage';
import LoginScreen from './src/screens/LoginScreen';
import AppHubScreen from './src/screens/AppHubScreen';
import StudentHubScreen from './src/screens/StudentHubScreen'; // NOVO HUB PARA ALUNO
import BookListScreen from './src/screens/BookListScreen';
import StudentListScreen from './src/screens/StudentListScreen';
import HomeScreen from './src/screens/HomeScreen';
import NewFeedbackScreen from './src/screens/NewFeedbackScreen';
import StudentFeedbackScreen from './src/screens/StudentFeedbackScreen';
import GiveFeedbackScreen from './src/screens/GiveFeedbackScreen'; 

const Stack = createNativeStackNavigator();

export default function App() {
    const [dataLoaded, setDataLoaded] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    const checkAuthStatus = async () => {
        await setupInitialData();
        const user = await getAuthUser();
        if (user && user.username && user.role) {
            setIsAuthenticated(true);
            setUserRole(user.role);
        } else {
            setIsAuthenticated(false);
            setUserRole(null);
        }
        setDataLoaded(true);
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const handleLoginChange = (status) => {
        if (status === false) {
            // Logout path
            setIsAuthenticated(false);
            setUserRole(null);
        } else {
            // Re-check status after successful login
            checkAuthStatus();
        }
    };

    if (!dataLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0056b3" />
                <Text style={{ marginTop: 10 }}>Loading SmartFeedback Influx Data...</Text>
            </View>
        );
    }

    const TeacherScreens = (
        <>
            <Stack.Screen 
                name="AppHub"
                options={{ title: 'Teacher Dashboard' }}
            >
                {props => <AppHubScreen {...props} onLogout={handleLoginChange} />}
            </Stack.Screen>
            <Stack.Screen name="BookList" component={BookListScreen} options={{ title: 'Select Class' }} />
            <Stack.Screen name="StudentList" component={StudentListScreen} options={({ route }) => ({ title: route.params.bookName })} />
            <Stack.Screen name="StudentFeedback" component={StudentFeedbackScreen} options={({ route }) => ({ title: route.params.studentName })} />
            <Stack.Screen name="GiveFeedback" component={GiveFeedbackScreen} options={{ title: 'Give Feedback' }} />
            <Stack.Screen name="FeedbackLibrary" component={HomeScreen} options={{ title: 'Reusable Feedbacks' }} />
            <Stack.Screen name="NewFeedback" component={NewFeedbackScreen} options={{ title: 'New Reusable Feedback' }} />
        </>
    );

    const StudentScreens = (
        <Stack.Screen 
            name="StudentHub" 
            options={{ title: 'My Feedbacks', headerShown: false }}
        >
            {props => <StudentHubScreen {...props} onLogout={handleLoginChange} />}
        </Stack.Screen>
    );

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {isAuthenticated ? (
                    userRole === 'Teacher' ? TeacherScreens : StudentScreens
                ) : (
                    <Stack.Screen 
                        name="Login" 
                        options={{ headerShown: false }}
                    >
                        {props => <LoginScreen {...props} onLogin={handleLoginChange} />}
                    </Stack.Screen>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});
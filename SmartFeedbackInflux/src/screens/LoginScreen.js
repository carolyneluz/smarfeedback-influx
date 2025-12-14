import React, { useState, useEffect } from 'react'; 
import { 
    View, 
    Text, 
    TextInput, 
    Button, 
    StyleSheet, 
    Alert, 
    TouchableOpacity, 
    Image,
    Keyboard,
    TouchableWithoutFeedback,
    Platform
} from 'react-native';
import { simpleLogin } from '../database/storage';

const InfluxLogo = require('../../assets/influx_logo.jpg');

const LoginScreen = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Teacher');

    useEffect(() => {
        setUsername('');
        setPassword('');
    }, [role]);

    const handleSetRole = (newRole) => {
        setRole(newRole);
    };

    const handleLogin = async () => {
        Keyboard.dismiss(); 
        
        const idToLogin = username.trim();
        
        if (!idToLogin) {
            Alert.alert("Error", `${role === 'Student' ? 'Student ID' : 'Username'} is required.`);
            return;
        }

        const success = await simpleLogin(idToLogin, role);

        if (success) {
            onLogin(true);
        } else {
            Alert.alert("Login Failed", 
                role === 'Student' 
                ? "Student not found. Please check your Student ID."
                : "Could not process Teacher login." 
            );
        }
    };

    const getUsernamePlaceholder = () => {
        if (role === 'Teacher') {
            return "Username";
        } else {
            return "Student ID";
        }
    };

    const keyboardType = role === 'Student' ? 'numeric' : 'default';

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <Text style={styles.header}>SmartFeedback</Text>
                
                <Image 
                    source={InfluxLogo} 
                    style={styles.logo} 
                    resizeMode="contain"
                />

                <Text style={styles.subheader}>Login</Text>

                <View style={styles.roleSelector}>
                    <TouchableOpacity
                        style={[styles.roleButton, role === 'Teacher' && styles.roleButtonActive]}
                        onPress={() => handleSetRole('Teacher')}
                    >
                        <Text style={[styles.roleText, role === 'Teacher' && styles.roleTextActive]}>Teacher</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.roleButton, role === 'Student' && styles.roleButtonActive]}
                        onPress={() => handleSetRole('Student')}
                    >
                        <Text style={[styles.roleText, role === 'Student' && styles.roleTextActive]}>Student</Text>
                    </TouchableOpacity>
                </View>

                <TextInput
                    style={styles.input}
                    placeholder={getUsernamePlaceholder()}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    keyboardType={keyboardType}
                    {...Platform.OS === 'android' && { keyboardDismissMode: 'on-drag' }}
                />
                
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                />
                
                <Button
                    title="Log In"
                    onPress={handleLogin}
                    color="#0056b3"
                />
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 30,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#0056b3',
        textAlign: 'center',
        marginBottom: 5,
    },
    logo: {
        width: '80%', 
        height: 80, 
        alignSelf: 'center',
        marginBottom: 20,
    },
    subheader: {
        fontSize: 24,
        color: '#333',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    roleSelector: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 30,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        padding: 5,
    },
    roleButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 6,
        alignItems: 'center',
    },
    roleButtonActive: {
        backgroundColor: '#0056b3',
    },
    roleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
    },
    roleTextActive: {
        color: '#fff',
    },
});

export default LoginScreen;
import AsyncStorage from '@react-native-async-storage/async-storage';

const FEEDBACKS_KEY = 'SmartFeedback:Feedbacks';
const GIVEN_FEEDBACKS_KEY = 'SmartFeedback:GivenFeedbacks';
const STUDENTS_KEY = 'SmartFeedback:Students';
const BOOKS_KEY = 'SmartFeedback:Books';
const AUTH_KEY = 'SmartFeedback:Auth'; 
const TEACHERS_KEY = 'SmartFeedback:Teachers'; 

export const getFeedbacks = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(FEEDBACKS_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        return [];
    }
};

export const saveFeedbacks = async (feedbacks) => {
    try {
        const jsonValue = JSON.stringify(feedbacks);
        await AsyncStorage.setItem(FEEDBACKS_KEY, jsonValue);
    } catch (e) {
    }
};

export const addFeedback = async (newFeedback) => {
    try {
        const feedbacks = await getFeedbacks();
        const id = Date.now();
        const feedbackWithId = { ...newFeedback, id: id, created_at: id };
        
        feedbacks.push(feedbackWithId);
        await saveFeedbacks(feedbacks);
        return feedbackWithId;

    } catch (e) {
        return null;
    }
};

export const deleteFeedback = async (feedbackId) => {
    try {
        let feedbacks = await getFeedbacks();
        const initialLength = feedbacks.length;
        
        feedbacks = feedbacks.filter(fb => fb.id !== feedbackId);
        
        if (feedbacks.length !== initialLength) {
            await saveFeedbacks(feedbacks);
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
};

export const getGivenFeedbacks = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(GIVEN_FEEDBACKS_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        return [];
    }
};

export const addGivenFeedback = async (feedbackData) => {
    try {
        const givenFeedbacks = await getGivenFeedbacks();
        const id = Date.now();
        const feedbackWithId = { ...feedbackData, id: id, created_at: id };
        
        givenFeedbacks.push(feedbackWithId);
        await AsyncStorage.setItem(GIVEN_FEEDBACKS_KEY, JSON.stringify(givenFeedbacks));
        return feedbackWithId;

    } catch (e) {
        return null;
    }
};

export const deleteGivenFeedback = async (feedbackId) => {
    try {
        let givenFeedbacks = await getGivenFeedbacks();
        const initialLength = givenFeedbacks.length;
        
        givenFeedbacks = givenFeedbacks.filter(fb => fb.id !== feedbackId);
        
        if (givenFeedbacks.length !== initialLength) {
            await AsyncStorage.setItem(GIVEN_FEEDBACKS_KEY, JSON.stringify(givenFeedbacks));
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
};

export const getBooks = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(BOOKS_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        return [];
    }
};

export const getStudents = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(STUDENTS_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        return [];
    }
};

export const getTeachers = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(TEACHERS_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        return [];
    }
};

export const getStudentsByBookId = async (bookId) => {
    try {
        const allStudents = await getStudents();
        return allStudents.filter(student => student.bookId === bookId);
    } catch (e) {
        return [];
    }
};

export const getFeedbacksByStudentId = async (studentId) => {
    const allGivenFeedbacks = await getGivenFeedbacks();
    return allGivenFeedbacks.filter(fb => fb.studentId === studentId).sort((a, b) => b.created_at - a.created_at);
};

export const getFeedbacksByStudentName = async (studentName) => {
    const allStudents = await getStudents();
    const student = allStudents.find(s => s.name.toLowerCase() === studentName.toLowerCase());

    if (!student) return [];

    const allGivenFeedbacks = await getGivenFeedbacks();
    return allGivenFeedbacks.filter(fb => fb.studentId === student.id).sort((a, b) => b.created_at - a.created_at);
};

export const simpleLogin = async (id, role) => {
    let fullName = id; 
    let studentId = null;
    const searchId = String(id).trim();

    if (role === 'Student') {
        const students = await getStudents();
        const student = students.find(s => s.matricula === searchId);

        if (!student) {
            return false; 
        }
        
        fullName = student.name;
        studentId = student.id;
        
    } else {
        const teachers = await getTeachers();
        const teacher = teachers.find(t => t.username === searchId);
        if (teacher) {
            fullName = teacher.name;
        }
    }

    const user = { 
        username: searchId, 
        role: role, 
        fullName: fullName,
        studentId: studentId 
    };
    
    await setAuthUser(user);
    return true;
};

export const setAuthUser = async (user) => {
    try {
        const jsonValue = JSON.stringify(user);
        await AsyncStorage.setItem(AUTH_KEY, jsonValue);
    } catch (e) {
    }
};

export const getAuthUser = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(AUTH_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        return null;
    }
};

export const setupInitialData = async () => {
    const initialFeedbacks = [
        { id: 1, title: 'Great Participation', content: 'The student demonstrated great engagement in class, actively participating in all proposed activities.', is_reusable: 1, created_at: 1700000000000, author: 'System' },
        { id: 2, title: 'Needs Focus', content: 'It is essential that the student improves concentration during classes and submits exercises more punctually.', is_reusable: 1, created_at: 1700000000001, author: 'System' },
    ];
    await saveFeedbacks(initialFeedbacks);

    const initialBooks = [];
    for (let i = 1; i <= 10; i++) {
        initialBooks.push({ id: `b${i}`, name: `Book ${i}` });
    }
    await AsyncStorage.setItem(BOOKS_KEY, JSON.stringify(initialBooks));

    const initialTeachers = [
        { username: 'john', name: 'Professor John', password: '123' }
    ];
    await AsyncStorage.setItem(TEACHERS_KEY, JSON.stringify(initialTeachers));

    const initialStudents = [
        { id: 101, name: 'Alice Smith', matricula: '1', password: '123', bookId: 'b1' },
        { id: 102, name: 'Bob Johnson', matricula: '2', password: '123', bookId: 'b1' },
        { id: 103, name: 'Charlie Brown', matricula: '3', password: '123', bookId: 'b2' },
        { id: 104, name: 'Diana Prince', matricula: '4', password: '123', bookId: 'b2' },
        { id: 105, name: 'Evan Peters', matricula: '5', password: '123', bookId: 'b3' },
    ];
    await AsyncStorage.setItem(STUDENTS_KEY, JSON.stringify(initialStudents));
    
    return true;
};
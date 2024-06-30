// public/js/pocketbaseClient.js
import PocketBase from 'https://cdn.skypack.dev/pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090'); // Ensure this URL is correct

const SECRET_EMAIL = 'chahaljas66@gmail.com'; // Replace with your PocketBase admin email
const SECRET_PASSWORD = 'abc123123123'; // Replace with your PocketBase admin password

const authenticate = async () => {
    console.log('Authenticating...');
    try {
        const authData = await pb.admins.authWithPassword(SECRET_EMAIL, SECRET_PASSWORD);
        console.log('Authenticated:', authData);
    } catch (error) {
        console.error('Authentication error:', error);
        throw error;
    }
};

export const createSemester = async (name) => {
    try {
        await authenticate();
        console.log('Creating semester:', name);
        const record = await pb.collection('Semester').create({ Name: name });
        console.log('Semester created:', record);
        return record;
    } catch (error) {
        console.error('Error in createSemester:', error);
        throw error;
    }
};

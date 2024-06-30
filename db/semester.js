// Create export functions for the semester page so it can be used in other .js files 

// Import the required instances/functions from the pocketbase-connection.js file
import { authenticate, pb} from '/db/pocketbase-connection.js';

export const createSemester = async (name) => {
    try {

        // Authenticate before creating the semester record
        await authenticate();
        console.log('Creating semester:', name);

        // Create a new record in the 'Semester' collection with the given name
        const record = await pb.collection('Semester').create({ Name: name });
        console.log('Semester created:', record);
        return record;
    } catch (error) {
        console.error('Error in createSemester:', error);
        throw error;
    }
};
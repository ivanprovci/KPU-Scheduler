//This file is used for contacting the database and creating functions to be used for event listeners etc.

// Import the required instances/functions from the pocketbase-connection.js file
import { authenticate, pb } from '/db/pocketbase-connection.js';

const previousSemestersContainer = document.querySelector("#previousSemesters");

// This function is called to create a new semester in the semester collection
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

//This function is called to retrieve all the current semesters in the semester collection
//and ensuring that it is in an array format
export const getAllSemesters = async () => {
    try {
        // Authenticate before fetching the semesters
        await authenticate();
        console.log('Fetching all semesters');

        // Get all records from the 'Semester' collection
        const records = await pb.collection('Semester').getFullList();
        console.log('Semesters fetched:', records);

        // Return the records as an array if it is not already, otherwise return an empty array
        return Array.isArray(records) ? records : [];
    } catch (error) {
        console.error('Error in getAllSemesters:', error);
        throw error;
    }
};

//This function creates a new button when it is called. This function also ensures to retrieve
//the semesters name from the database and setting the attributes of the button to semester.id
export const createSemesterButton = (semester) => {
    const newButton = document.createElement("button");

    newButton.className = "btn btn-outline-dark";
    newButton.textContent = semester.Name; // Ensure the button has the semester name
    newButton.setAttribute("data-semester-id", semester.id); // Set semester ID

    previousSemestersContainer.appendChild(newButton);

    newButton.addEventListener("click", () => {
        window.location.href = `classes.html?semesterId=${semester.id}`; // Navigate to classes page
    });
};
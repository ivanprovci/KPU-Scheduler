//This page is for event listeners and interactions to the page.

//import the required functions from the semester.js file 
import { createSemester, createSemesterButton, getAllSemesters} from '/db/semester.js';
console.log('Script loaded');

// Select HTML elements related to creating a new semester (HTML ID's are being used here)
const btnCreateNewSemester = document.querySelector("#createNewSemester");
const newSemesterForm = document.querySelector("#semesterForm");
const btnCancel = document.querySelector("#btnCancel");
const inputSemesterName = document.querySelector("#semesterName");

//This function fetches all the semesters in the semesters collection and displays them on the screen
//under previous semesters section
const loadSemesters = async () => {
    try {
        const semesters = await getAllSemesters();
        semesters.forEach(createSemesterButton);
    } catch(e) {
        console.error('Failed to load semesters:', e);
        alert('Failed to load semesters. Please try again later.');
    }
};

//When page is loaded the loadsemesters function is called and executed
document.addEventListener("DOMContentLoaded", loadSemesters);

// Add click event listener to the "Create New Semester" button
btnCreateNewSemester.addEventListener("click", () => {
    console.log('Create New Semester button clicked');
    btnCreateNewSemester.classList.add("hidden");
    newSemesterForm.classList.remove("hidden");
    inputSemesterName.focus();
});

// Add submit event listener to the new semester form
newSemesterForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("Form submitted");

    const semesterName = inputSemesterName.value.trim();
    if (semesterName !== "") {
        try {
            // Call createSemester to create a new semester record
            const record = await createSemester(semesterName);
            console.log('Record created:', record);

            // Create a new button for the newly created semester and add it to the container
            createSemesterButton(record);

            // Reset the form and toggle visibility of the form and button
            newSemesterForm.reset();
            newSemesterForm.classList.add("hidden");
            btnCreateNewSemester.classList.remove("hidden");
            alert('Semester created successfully!');
        } catch (error) {
            console.error('Error creating record:', error);
            alert('Failed to create semester.');
        }
    }
});
// Add click event listener to the cancel button
btnCancel.addEventListener("click", () => {
    console.log('Cancel button clicked');
    btnCreateNewSemester.classList.remove("hidden");
    newSemesterForm.classList.add("hidden");
});
// import the createSemester const from pocketbaseClient.js 
import { createSemester } from '/db/semester.js';
console.log('Script loaded');

// Select HTML elements related to creating a new semester (HTML ID's are being used here)
const btnCreateNewSemester = document.querySelector("#createNewSemester");
const newSemesterForm = document.querySelector("#semesterForm");
const btnCancel = document.querySelector("#btnCancel");
const inputSemesterName = document.querySelector("#semesterName");
const previousSemestersContainer = document.querySelector("#previousSemesters");

// Add click event listener to the "Create New Semester" button
btnCreateNewSemester.addEventListener("click", () => {
    console.log('Create New Semester button clicked');
    btnCreateNewSemester.classList.add("hidden");
    newSemesterForm.classList.remove("hidden");
    inputSemesterName.focus();
});

// Add submit event listener to the new semester form
newSemesterForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    console.log("Form submitted");

    const semesterName = inputSemesterName.value.trim();
    if (semesterName !== "") {
        try {
            // Call createSemester to create a new semester record
            const record = await createSemester(semesterName);
            console.log('Record created:', record);
            
            // Create a new button for the newly created semester and add it to the container
            const newButton = document.createElement("button");
            newButton.className = "btn btn-outline-dark";
            newButton.textContent = semesterName; // Ensure the button has the semester name
            newButton.setAttribute("data-semester-id", record.id); // Set semester ID
            previousSemestersContainer.appendChild(newButton);

            newButton.addEventListener("click", () => {
                window.location.href = `classes.html?semesterId=${record.id}`; // Navigate to classes page
            });

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

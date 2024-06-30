// public/js/create-new-semester.js
import { createSemester } from './pocketbaseClient.js';

console.log('Script loaded');

const btnCreateNewSemester = document.querySelector("#createNewSemester");
const newSemesterForm = document.querySelector("#semesterForm");
const btnCancel = document.querySelector("#btnCancel");
const inputSemesterName = document.querySelector("#semesterName");
const previousSemestersContainer = document.querySelector("#previousSemesters");

console.log('Elements:', btnCreateNewSemester, newSemesterForm, btnCancel, inputSemesterName, previousSemestersContainer);

btnCreateNewSemester.addEventListener("click", () => {
    console.log('Create New Semester button clicked');
    btnCreateNewSemester.classList.add("hidden");
    newSemesterForm.classList.remove("hidden");
    inputSemesterName.focus();
});

newSemesterForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("Form submitted");

    const semesterName = inputSemesterName.value.trim();
    if (semesterName !== "") {
        try {
            const record = await createSemester(semesterName);
            console.log('Record created:', record);

            const newButton = document.createElement("button");
            newButton.className = "btn btn-outline-dark";
            newButton.textContent = semesterName;

            previousSemestersContainer.appendChild(newButton);

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

btnCancel.addEventListener("click", () => {
    console.log('Cancel button clicked');
    btnCreateNewSemester.classList.remove("hidden");
    newSemesterForm.classList.add("hidden");
});

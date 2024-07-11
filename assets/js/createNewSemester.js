const btnCreateNewSemester = document.querySelector("#createNewSemester")
const newSemesterForm = document.querySelector("form")
const btnCancel = document.querySelector("#btnCancel")
const inputSemesterName = document.querySelector("#semesterName");
const previousSemestersContainer = document.querySelector("#previousSemesters");


btnCreateNewSemester.addEventListener("click", () => {
	// hide create new button and display the form when user clicks create new sem
	btnCreateNewSemester.classList.add("hidden")
	newSemesterForm.classList.remove("hidden")
	inputSemesterName.focus()
})


// Event listener for form submission
newSemesterForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent form submission

    const semesterName = inputSemesterName.value.trim();
    if (semesterName !== "") {
        // Create a new button element
        const newButton = document.createElement("button");
        newButton.className = "btn btn-outline-dark";
        newButton.textContent = semesterName;

        // Send the new button to the previous semester container
        previousSemestersContainer.appendChild(newButton);

        // Reset form and hide it
        newSemesterForm.reset();
        newSemesterForm.classList.add("hidden");
        btnCreateNewSemester.classList.remove("hidden");
    }
});


btnCancel.addEventListener("click", () => {
	// hide the form and show the create new sem btn when user clicks cancel
	btnCreateNewSemester.classList.remove("hidden")
	newSemesterForm.classList.add("hidden")
})

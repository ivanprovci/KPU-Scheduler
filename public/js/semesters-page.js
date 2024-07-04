import {
	createSemester,
	createSemesterButton,
	getAllSemesters,
} from "/db/semester.js"

// html element references
const btnCreateNewSemester = document.querySelector("#createNewSemester")
const newSemesterForm = document.querySelector("#semesterForm")
const btnCancel = document.querySelector("#btnCancel")
const inputSemesterName = document.querySelector("#semesterName")
const divLoading = document.querySelector("#loading")

// When page is loaded the loadsemesters function is called and executed
document.addEventListener("DOMContentLoaded", async () => {
	try {
		const semesters = await getAllSemesters()
		semesters.forEach(createSemesterButton)
		divLoading.classList.add("hidden")
	} catch (e) {
		alert("Failed to load semesters. Please try again later.")
	}
})

btnCreateNewSemester.addEventListener("click", () => {
	// hide the button and show the form
	btnCreateNewSemester.classList.add("hidden")
	newSemesterForm.classList.remove("hidden")
	inputSemesterName.focus()
})

newSemesterForm.addEventListener("submit", async (event) => {
	event.preventDefault()

	const inputSemesterNameTrimmed = inputSemesterName.value.trim()
	try {
		// Call createSemester to create a new semester record
		const record = await createSemester(inputSemesterNameTrimmed)

		// Create a new button for the newly created semester and add it to the container
		createSemesterButton(record)

		// Reset the form and toggle visibility of the form and button
		newSemesterForm.reset()
		newSemesterForm.classList.add("hidden")
		btnCreateNewSemester.classList.remove("hidden")
	} catch (error) {
		alert("Failed to create semester.")
	}
})

// when the cancel button is clicked, hide the 'create new semester' form
btnCancel.addEventListener("click", () => {
	btnCreateNewSemester.classList.remove("hidden")
	newSemesterForm.classList.add("hidden")
})

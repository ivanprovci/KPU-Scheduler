// html element references
const btnCreateNewSemester = document.querySelector("#createNewSemester")
const newSemesterForm = document.querySelector("#semesterForm")
const btnCancel = document.querySelector("#btnCancel")
const inputSemesterName = document.querySelector("#semesterName")
const divLoading = document.querySelector("#loading")
const previousSemestersContainer = document.querySelector("#previousSemesters")

// get all semesters when page is loaded
document.addEventListener("DOMContentLoaded", async () => {
	try {
		const data = await fetch("/semesters/semesters")
		const semesters = await data.json()

		semesters.forEach(createSemesterButton)
		divLoading.classList.add("hidden")
	} catch (e) {
		alert("Failed to load semesters. Please try again later.")
	}
})

btnCreateNewSemester.addEventListener("click", () => {
	// hide the 'create new semester' button and show the form
	btnCreateNewSemester.classList.add("hidden")
	newSemesterForm.classList.remove("hidden")
	inputSemesterName.focus()
})

newSemesterForm.addEventListener("submit", async (event) => {
	event.preventDefault()

	const inputSemesterNameTrimmed = inputSemesterName.value.trim()
	try {
		// send a post req to semesters endpoint, which creates a new semester
		const record = await fetch("/semesters/semeters", {
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				createSemester: inputSemesterNameTrimmed,
			}),
		})

		const data = await record.json()

		// log an error message if the http status was anything but 'OK'
		if (record.status === 200) {
			createSemesterButton(data)
			console.log(data)

			// Reset the form and toggle visibility of the form and button
			newSemesterForm.reset()
			newSemesterForm.classList.add("hidden")
			btnCreateNewSemester.classList.remove("hidden")
		} else {
			throw new Error(data.message)
		}
	} catch (error) {
		console.log("Failed to create semester" + error)
	}
})

// when the cancel button is clicked, hide the 'create new semester' form and show the new sem. button
btnCancel.addEventListener("click", () => {
	btnCreateNewSemester.classList.remove("hidden")
	newSemesterForm.classList.add("hidden")
})

// create a new button for the semester param and add it to the list of existing ones
const createSemesterButton = (semester) => {
	const newButton = document.createElement("button")

	newButton.className = "btn btn-outline-dark"
	newButton.textContent = semester.Name // Ensure the button has the semester name
	newButton.setAttribute("data-semester-id", semester.id) // Set semester ID

	previousSemestersContainer.appendChild(newButton)

	newButton.addEventListener("click", () => {
		window.location.href = `classes.html?semesterId=${semester.id}` // Navigate to classes page
	})
}

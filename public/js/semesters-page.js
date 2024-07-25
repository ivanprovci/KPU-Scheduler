// html element references
const btnCreateNewSemester = document.querySelector("#createNewSemester")
const newSemesterForm = document.querySelector("#semesterForm")
const btnCancel = document.querySelector("#btnCancel")
const inputSemesterName = document.querySelector("#semesterName")
const divLoading = document.querySelector("#loading")
const previousSemestersContainer = document.querySelector("#previousSemesters")

const loadAllSemesters = async () => {
	try {
		const data = await fetch("/semesters/semesters")
		const semesters = await data.json()

		semesters.forEach(createSemesterButton)
		divLoading.classList.add("hidden")
	} catch (e) {
		alert("Failed to load semesters. Please try again later.")
	}
}
// get all semesters when page is loaded
document.addEventListener("DOMContentLoaded", loadAllSemesters())

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
		const record = await fetch("/semesters/semesters", {
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

	// create the edit and delete icons to the right of the semester button
	const iconContainer = document.createElement("div")
	iconContainer.className = "edit-delete-icons hide"

	newButton.addEventListener("mouseover", () => {
		iconContainer.classList.remove("hide")
	})
	newButton.addEventListener("mouseout", () => {
		iconContainer.classList.add("hide")
	})
	iconContainer.addEventListener("mouseover", () => {
		iconContainer.classList.remove("hide")
	})
	iconContainer.addEventListener("mouseout", () => {
		iconContainer.classList.add("hide")
	})

	// Create the edit icon button
	const editButton = document.createElement("button")
	editButton.className = "btn btn-sm btn-outline-secondary"
	const editIcon = document.createElement("i")
	editIcon.className = "bi bi-pencil"
	editButton.appendChild(editIcon)
	editButton.addEventListener("click", (e) => {
		e.stopPropagation()
		// Edit button functionality
		console.log(`Edit semester ${semester.id}`)
		//get the button associated with this SemesterID
		const semesterButtonToBeUpdated = document.querySelector(
			`button[data-semester-id="${semester.id}"]`
		)

		// prevent re-rendering the form by checking if one already exists after the button
		if (
			!semesterButtonToBeUpdated.nextElementSibling ||
			semesterButtonToBeUpdated.nextElementSibling.tagName !== "FORM"
		) {
			const updateSemesterNameForm = createUpdateSemesterNameForm(
				semester.id
			)
			semesterButtonToBeUpdated.insertAdjacentElement(
				"afterend",
				updateSemesterNameForm
			)
		}
	})

	// Create the delete icon button
	const deleteButton = document.createElement("button")
	deleteButton.className = "btn btn-sm btn-outline-danger"
	const deleteIcon = document.createElement("i")
	deleteIcon.className = "bi bi-trash"
	deleteButton.appendChild(deleteIcon)
	deleteButton.addEventListener("click", async (e) => {
		e.stopPropagation()
		// Delete button functionality
		try {
			// send a delete request to semesters endpoint
			const record = await fetch("/semesters/semesters", {
				method: "delete",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					semesterId: semester.id,
				}),
			})

			// returns the message from the server
			const data = await record.json()

			// if server responds with OK, delete the element in the semester list with the associated semesterId
			if (record.status === 200) {
				const semesterButtonToBeDeleted = document.querySelector(
					`button[data-semester-id="${semester.id}"]`
				)
				if (semesterButtonToBeDeleted) {
					semesterButtonToBeDeleted.parentNode.removeChild(
						semesterButtonToBeDeleted
					)
				}
			} else {
				throw new Error(data.message)
			}
		} catch (error) {
			console.log("Failed to delete semester: " + error)
		}
	})

	// Append the buttons to the icon container
	iconContainer.appendChild(editButton)
	iconContainer.appendChild(deleteButton)

	// Append the icon container to the main button
	newButton.appendChild(iconContainer)
}

const createUpdateSemesterNameForm = (semesterId) => {
	// Create the form element
	const form = document.createElement("form")
	form.classList.add(
		"w-100",
		"p-3",
		"border",
		"border-top-0",
		"border-dark",
		"bg-light"
	)

	// Create the form group div
	const formGroup = document.createElement("div")
	formGroup.classList.add("form-group")

	// Create and append the label
	const label = document.createElement("label")
	label.setAttribute("for", "semesterName")
	label.textContent = "Change semester name:"
	formGroup.appendChild(label)

	// Create and append the input
	const input = document.createElement("input")
	input.type = "text"
	input.classList.add("form-control")
	input.placeholder = "New semester name"
	input.name = "newSemesterName"
	input.required = true
	formGroup.appendChild(input)

	// Append the form group to the form
	form.appendChild(formGroup)

	// Create the flex container div
	const flexDiv = document.createElement("div")
	flexDiv.classList.add("flex", "justify-between", "pt-2")

	// Create and append the cancel button
	const cancelButton = document.createElement("button")
	cancelButton.classList.add("btn", "btn-outline-dark", "px-4")
	cancelButton.textContent = "Cancel"
	cancelButton.addEventListener("click", (e) => {
		const form = e.target.closest("form")
		if (form) {
			form.remove()
		}
	})
	flexDiv.appendChild(cancelButton)

	// Create and append the submit button
	const submitButton = document.createElement("button")
	submitButton.type = "submit"
	submitButton.classList.add("btn", "btn-primary", "px-4")
	submitButton.textContent = "Submit"
	//submit name change to server
	submitButton.addEventListener("click", async (e) => {
		e.preventDefault()

		try {
			const form = e.target.closest("form")
			const newSemesterName = form.querySelector(
				'input[name="newSemesterName"]'
			).value

			// send an update request to semesters endpoint
			const record = await fetch("/semesters/semesters", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					semesterId: semesterId,
					newSemesterName: newSemesterName,
				}),
			})

			// returns the message from the server
			const data = await record.json()

			// if server doesn't respond with OK, throw an error
			if (record.status !== 200) {
				throw new Error(data.message)
			}

			location.reload()
		} catch (error) {
			alert("Failed to update semester: " + error)
		}
	})
	flexDiv.appendChild(submitButton)

	// Append the flex container to the form
	form.appendChild(flexDiv)

	return form
}

const btnCreateNewSemester = document.querySelector("#createNewSemester")
const newSemesterForm = document.querySelector("form")
const btnCancel = document.querySelector("#btnCancel")
const inputSemesterName = document.querySelector("form input[type='text']")

btnCreateNewSemester.addEventListener("click", () => {
	// hide create new button and display the form when user clicks create new sem
	btnCreateNewSemester.classList.add("hidden")
	newSemesterForm.classList.remove("hidden")
	inputSemesterName.focus()
})

btnCancel.addEventListener("click", () => {
	// hide the form and show the create new sem btn when user clicks cancel
	btnCreateNewSemester.classList.remove("hidden")
	newSemesterForm.classList.add("hidden")
})

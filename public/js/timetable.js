document.addEventListener("DOMContentLoaded", function () {
	const semesterSelect = document.getElementById("semesterSelect")
	const timetableBody = document.getElementById("timetableBody")
	const exportCSVButton = document.getElementById("exportCSV")
	const deleteSelectedButton = document.getElementById("deleteSelected")

	// Add default option to the dropdown
	const defaultOption = document.createElement("option")
	defaultOption.textContent = "Choose a semester"
	defaultOption.value = ""
	defaultOption.disabled = true
	defaultOption.selected = true
	semesterSelect.appendChild(defaultOption)

	// Fetch and populate semester options
	fetch("/timetable/api/semesters")
		.then((response) => {
			if (!response.ok) {
				throw new Error(
					"Network response was not ok " + response.statusText
				)
			}
			return response.json()
		})
		.then((data) => {
			data.forEach((semester) => {
				const option = document.createElement("option")
				option.value = semester.id
				option.textContent = semester.Name
				semesterSelect.appendChild(option)
			})
		})
		.catch((error) => {
			console.error("Error fetching semesters:", error)
		})

	// Event listener for semester selection
	semesterSelect.addEventListener("change", function () {
		const semesterId = this.value
		fetchTimetable(semesterId)
	})

	function fetchTimetable(semesterId) {
		fetch(`/timetable/api/classes?semesterId=${semesterId}`)
			.then((response) => {
				if (!response.ok) {
					throw new Error(
						"Network response was not ok " + response.statusText
					)
				}
				return response.json()
			})
			.then((data) => {
				timetableBody.innerHTML = "" // Clear existing rows

				data.forEach((classData) => {
					// Generate the table row based on actual keys in classData
					const row = document.createElement("tr")
					row.innerHTML = `
                        <td><input type="checkbox" class="class-checkbox" data-id="${classData.id}"></td>
                        <td>${classData.CRN}</td>
                        <td>${classData.Subject}</td>
                        <td>${classData.Course}</td>
                        <td>${classData.Section}</td>
                        <td>${classData.Campus}</td>
                        <td>${classData.Class_Size}</td>
                        <td>${classData.Status}</td>
                        <td>${classData.Instructional_Method}</td>
                        <td>${classData.Matrix_Code}</td>
                        <td>${classData.Banner_Codes}</td>
                        <td>${classData.Exam_Y_N}</td>
                        <td>${classData.Meeting_Type}</td>
                        <td>${classData.Session}</td>
                        <td>${classData.Non_Standard_Start_Date}</td>
                        <td>${classData.Non_Standard_End_Date}</td>
                        <td>${classData.M ? "M" : ""}</td>
                        <td>${classData.T ? "T" : ""}</td>
                        <td>${classData.W ? "W" : ""}</td>
                        <td>${classData.R ? "R" : ""}</td>
                        <td>${classData.F ? "F" : ""}</td>
                        <td>${classData.S ? "S" : ""}</td>
                        <td>${classData.U ? "U" : ""}</td>
                        <td>${classData.Start_Time}</td>
                        <td>${classData.End_Time}</td>
                        <td>${classData.Exam_DateTime}</td>
                        <td>${classData.Room_Type}</td>
                        <td>${classData.Room_Preferences}</td>
                        <td>${classData.Instructor}</td>
                        <td>${classData.Crosslist_Code}</td>
                        <td>${classData.Link_ID}</td>
                        <td>${classData.Additional_Information}</td>
                        <td>${
							classData.Zero_Textbook_Cost_Adobe_Creative_Cloud
						}</td>
                        <td>${classData.Program_Restrictions}</td>
                        <td>${classData.Reserved_Seats}</td>
                        <td>${classData.Overflow_Y_N}</td>
                        <td>${classData.Date_Reserves_Removed}</td>
                        <td>${classData.Fee_Detail_Code}</td>
                        <td>${classData.Addtl_Mandatory_Course_Fee}</td>
                        <td>${classData.Funding_Source}</td>
                    `
					timetableBody.appendChild(row)
				})

				// Show delete button if there are classes
				deleteSelectedButton.style.display = data.length > 0 ? "block" : "none"

				// Add event listeners to checkboxes
				const checkboxes = document.querySelectorAll(".class-checkbox")
				checkboxes.forEach((checkbox) => {
					checkbox.addEventListener("change", updateDeleteButtonVisibility)
				})
			})
			.catch((error) => {
				console.error("Error fetching classes:", error)
			})
	}

	function updateDeleteButtonVisibility() {
		const selectedCheckboxes = document.querySelectorAll(".class-checkbox:checked")
		deleteSelectedButton.style.display = selectedCheckboxes.length > 0 ? "block" : "none"
	}

	deleteSelectedButton.addEventListener("click", function () {
		const selectedCheckboxes = document.querySelectorAll(".class-checkbox:checked")
		const selectedIds = Array.from(selectedCheckboxes).map(checkbox => checkbox.getAttribute("data-id"))

		if (selectedIds.length > 0 && confirm("Are you sure you want to delete the selected classes?")) {
			selectedIds.forEach(classId => {
				fetch(`/timetable/api/classes/${classId}`, {
					method: "DELETE",
				})
					.then((response) => {
						if (!response.ok) {
							throw new Error(
								"Network response was not ok " + response.statusText
							)
						}
						return response.json()
					})
					.then((data) => {
						alert(data.message)
						// Remove the deleted classes from the table
						selectedCheckboxes.forEach(checkbox => {
							const row = checkbox.closest("tr")
							row.parentNode.removeChild(row)
						})
						// Hide the delete button if no classes remain
						if (timetableBody.childElementCount === 0) {
							deleteSelectedButton.style.display = "none"
						}
					})
					.catch((error) => {
						console.error("Error deleting class:", error)
					})
			})
		}
	})

	// Function to download CSV
	function downloadCSV(csvContent, fileName) {
		const encodedUri = encodeURI(csvContent)
		const link = document.createElement("a")
		link.setAttribute("href", encodedUri)
		link.setAttribute("download", fileName)
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

	// Event listener to handle CSV export
	exportCSVButton.addEventListener("click", function () {
		let csvContent = "data:text/csv;charset=utf-8,"
		let csvRow = []
		const headers = [
			"CRN",
			"Subject",
			"Course",
			"Section",
			"Campus",
			"Class Size",
			"Status",
			"Instructional Method",
			"Matrix Code",
			"Banner Codes",
			"Exam Y/N",
			"Meeting Type",
			"Session",
			"Non-Standard Start Date",
			"Non-Standard End Date",
			"M",
			"T",
			"W",
			"R",
			"F",
			"S",
			"U",
			"Start Time",
			"End Time",
			"Exam Date & Time",
			"Room Type",
			"Room Preferences",
			"Instructor (Last Name, First Name)",
			"Crosslist Code",
			"Link ID",
			"Additional Information",
			"Zero Textbook Cost / Adobe Creative Cloud",
			"Program Restrictions",
			"Reserved Seats",
			"Overflow (Y/N)",
			"Date Reserves to be Removed (One Date Only)",
			"Fee Detail Code",
			"Add'tl Mandatory Course Fee",
			"Funding Source",
		]

		// Add headers to csvContent
		csvContent += headers.map((header) => `"${header}"`).join(",") + "\r\n"

		// Fetch rows and each cell into CSV format
		const rows = document.querySelectorAll(".schedule-table tbody tr")
		rows.forEach((row) => {
			csvRow = []
			const cells = row.querySelectorAll("td")

			cells.forEach((cell, index) => {
				if (index > 0) {
					csvRow.push(`"${cell.textContent.replace(/"/g, '""')}"`)
				}
			})
			csvContent += csvRow.join(",") + "\r\n"
		})

		// Use semester name for file name if available
		const selectedSemesterName =
			semesterSelect.options[semesterSelect.selectedIndex].text
		const fileName = selectedSemesterName
			? `${selectedSemesterName.replace(/ /g, "_")}.csv`
			: "timetable.csv"

		// Download CSV file
		downloadCSV(csvContent, fileName)
	})
})

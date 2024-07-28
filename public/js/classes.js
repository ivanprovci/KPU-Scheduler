document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const semesterId = urlParams.get('semesterId');
    document.getElementById('semesterId').value = semesterId;

    // Fetch semester details using the ID
    try {
        const response = await fetch(`/semesters/${semesterId}`);
        const semesterData = await response.json();

        // Display the semester name
        const semesterNameDisplay = document.getElementById('semesterNameDisplay');
        semesterNameDisplay.textContent = semesterData.Name;
    } catch (error) {
        console.error("Error fetching semester details:", error);
        alert("Error loading semester details. Please try again later.");
    }

    const weekDayMap = {
        'M': 'Monday',
        'T': 'Tuesday',
        'W': 'Wednesday',
        'R': 'Thursday',
        'F': 'Friday',
        'S': 'Saturday',
        'U': 'Sunday'
    };

    // Class Numbers for each Subject
    const classNumbers = {
        'Select': [],
        'INFO': ["1100", "1110", "1111", "1112", "1113", "1115", "1130", "1140", "1211", "1212", "1213", "1214", "1230", "2311", "2312", "2313", "2315", "2342", "2411", "2413", "2416", "3033", "3109", "3110", "3135", "3150", "3171", "3180", "3225", "3235", "3240", "3245", "3250", "3280", "3390", "4105", "4110", "4115", "4120", "4125", "4190", "4235", "4260", "4290", "4310", "4330", "4370", "4381"],
        'PHIL': ["1150", "3033", "3109"],
        'BUQU': ["1130", "1230"],
        'MATH': ["1115", "1140"]
    };

    const subjectDropdown = document.querySelector('select[name="Subject"]');
    const classNumberDropdown = document.querySelector('select[name="Class_Number"]');
    const sectionDropdown = document.querySelector('select[name="Section"]');
    const campusDropdown = document.querySelector('select[name="Campus"]');

    // Populate Class Number dropdown based on the selected subject
    subjectDropdown.addEventListener('change', function () {
        const selectedSubject = this.value;

        // Clear the existing options
        classNumberDropdown.innerHTML = '';

        // Populate new options based on selected subject
        if (classNumbers[selectedSubject]) {
            classNumbers[selectedSubject].forEach(number => {
                const option = document.createElement('option');
                option.value = number;
                option.textContent = number;
                classNumberDropdown.appendChild(option);
            });
        }
    });

    // Initial trigger to populate the Class Number dropdown on page load
    subjectDropdown.dispatchEvent(new Event('change'));

    // Filter Campus options based on the selected Section
    sectionDropdown.addEventListener('change', function () {
        const selectedSection = this.value;
        let campusOptions = [];

        if (selectedSection.startsWith('A')) {
            campusOptions = ['Online'];
        } else if (selectedSection.startsWith('R')) {
            campusOptions = ['Richmond'];
        } else if (selectedSection.startsWith('S')) {
            campusOptions = ['Surrey'];
        } else {
            campusOptions = ['Richmond', 'Surrey', 'Langley', 'Online'];
        }

        // Clear the existing options
        campusDropdown.innerHTML = '';

        // Populate new options based on selected section
        campusOptions.forEach(campus => {
            const option = document.createElement('option');
            option.value = campus;
            option.textContent = campus;
            campusDropdown.appendChild(option);
        });
    });

    document.getElementById('addClass').addEventListener('click', function () {
        const form = document.getElementById('classForm');
        const formData = new FormData(form);
        const classData = {};

        // Clear previous error highlights and messages
        form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(el => el.remove());

        formData.forEach((value, key) => {
            if (key === 'Exam_Date_Time') {
                classData[key] = new Date(value).toISOString();
            } else if (key === 'Week_Days') {
                classData[value] = true; // This will set the boolean for the corresponding day to true
            } else {
                classData[key] = value;
            }
        });

        // Ensure all days are set, default to false if not provided
        for (const [key, day] of Object.entries(weekDayMap)) {
            if (!classData.hasOwnProperty(key)) {
                classData[key] = false;
            }
        }

        // Add the Semester_ID to the class data
        classData.Semester_ID = semesterId;

        // Set the Course field with the Class_Number value
        classData.Course = formData.get('Class_Number');

        // Add additional fields
        classData['Crosslist_Code'] = formData.get('Crosslist_Code');
        classData['Link_ID'] = formData.get('Link_ID');
        classData['Additional_Information'] = formData.get('Additional_Information');
        classData['Zero_Textbook_Cost_Adobe_Creative_Cloud'] = formData.get('Zero_Textbook_Cost_Adobe_Creative_Cloud');
        classData['Program_Restrictions'] = formData.get('Program_Restrictions');
        classData['Reserved_Seats'] = formData.get('Reserved_Seats');
        classData['Overflow_Y_N'] = formData.get('Overflow_Y_N');
        classData['Date_Reserves_to_be_Removed'] = formData.get('Date_Reserves_to_be_Removed');
        classData['Fee_Detail_Code'] = formData.get('Fee_Detail_Code');
        classData['Addtl_Mandatory_Course_Fee'] = formData.get('Addtl_Mandatory_Course_Fee');
        classData['Funding_Source'] = formData.get('Funding_Source');

        // Check for duplicate course number and section, and CRN conflicts
        fetch(`/classes/check-duplicate?crn=${classData.CRN}&course=${classData.Course}&section=${classData.Section}`)
            .then(response => response.json())
            .then(data => {
                if (data.exists) {
                    const fieldElement = form.querySelector(`[name="${data.field}"]`);
                    if (fieldElement) {
                        fieldElement.classList.add('is-invalid');
                        const errorMessage = document.createElement('small');
                        errorMessage.className = 'error-message text-danger';
                        errorMessage.textContent = data.field === 'Section' ? "Please enter a different section number" : "Enter a valid CRN number";
                        fieldElement.parentNode.appendChild(errorMessage);
                    }
                    return;
                } else {
                    // Proceed with class creation
                    fetch('/classes', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(classData)
                    }).then(response => {
                        if (response.ok) {
                            alert("Class data saved successfully.");
                            form.reset();
                            document.getElementById('semesterId').value = semesterId;

                            // Re-trigger change event to populate class numbers for the default subject
                            subjectDropdown.dispatchEvent(new Event('change'));
                        } else {
                            response.json().then(data => {
                                if (data.field) {
                                    const fieldElement = form.querySelector(`[name="${data.field}"]`);
                                    if (fieldElement) {
                                        fieldElement.classList.add('is-invalid');
                                        const errorMessage = document.createElement('small');
                                        errorMessage.className = 'error-message text-danger';
                                        errorMessage.textContent = data.field === 'Section' ? "Please enter a different section number" : "Enter a valid CRN number";
                                        fieldElement.parentNode.appendChild(errorMessage);
                                    }
                                }
                                alert(`Error saving class data: ${data.message}`);
                                console.error("Server error response:", data);
                            });
                        }
                    }).catch(error => {
                        alert("Error saving class data.");
                        console.error("Error in saveClassData:", error);
                    });
                }
            }).catch(error => {
                alert("Error checking for duplicates.");
                console.error("Error in check-duplicate:", error);
            });
    });

    document.getElementById('classForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const classEntries = document.querySelectorAll('.class-entry');
        const headers = ["CRN", "Subject", "Class_Number", "Section", "Campus", "Class_Size", "Status", "Instructional_Method", "Matrix_Code", "Banner_Codes", "Exam_Y_N", "Meeting_Type", "Session", "Non_Standard_Start_Date", "Non_Standard_End_Date", "Week_Day", "Start_Time", "End_Time", "Exam_Date_Time", "Room_Type", "Room_Preferences", "Instructor", "Crosslist_Code", "Link_ID", "Additional_Information", "Zero_Textbook_Cost_Adobe_Creative_Cloud", "Program_Restriction", "Reserved_Seats", "Overflow_Y_N", "Date_Reserves_to_be_Removed", "Fee_Detail_Code", "Addtl_Mandatory_Course_Fee", "Funding_Source"];
        const rows = [headers.join(',')];

        classEntries.forEach(entry => {
            const row = headers.map(header => {
                if (header in weekDayMap) {
                    return entry.querySelector(`input[name="Week_Days"][value="${header}"]`).checked ? 'true' : 'false';
                } else if (header === "Exam_Date_Time") {
                    return new Date(entry.querySelector(`input[name="${header}"]`).value).toISOString();
                } else {
                    return entry.querySelector(`input[name="${header}"], select[name="${header}"]`).value;
                }
            });
            rows.push(row.join(','));
        });

        const csvContent = "data:text/csv;charset=utf-8," + rows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "classes_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    document.getElementById('additionalInfoCheck').addEventListener('change', function () {
        const additionalInfo = document.getElementById('additionalInfo');
        if (this.checked) {
            additionalInfo.style.display = 'block';
        } else {
            additionalInfo.style.display = 'none';
        }
    });

    const matrixCodeDropdown = document.querySelector('select[name="Matrix_Code"]');
    const bannerCodesInput = document.querySelector('input[name="Banner_Codes"]');
    const weekDaysInputs = document.querySelectorAll('input[name="Week_Days"]');
    const startTimeInput = document.querySelector('input[name="Start_Time"]');
    const endTimeInput = document.querySelector('input[name="End_Time"]');
    const examDateTimeInput = document.querySelector('input[name="Exam_Date_Time"]');

    // Update the form fields based on the selected Matrix Code
    matrixCodeDropdown.addEventListener('change', function () {
        const selectedMatrixCode = this.value;

        switch (selectedMatrixCode) {
            case 'WDE':
                bannerCodesInput.value = 'W2';
                weekDaysInputs.forEach(input => {
                    input.checked = input.value === 'W';
                });
                startTimeInput.value = '13:00';
                endTimeInput.value = '15:50';
                examDateTimeInput.value = '2023-12-06T12:00';
                break;
            case 'FH':
                bannerCodesInput.value = 'F4';
                weekDaysInputs.forEach(input => {
                    input.checked = input.value === 'F';
                });
                startTimeInput.value = '19:00';
                endTimeInput.value = '21:50';
                examDateTimeInput.value = '2023-12-08T19:00';
                break;

            // Add more cases here
            case '':
                break;

            default:
                // Clear values if no matching case
                bannerCodesInput.value = '';
                weekDaysInputs.forEach(input => {
                    input.checked = false;
                });
                startTimeInput.value = '';
                endTimeInput.value = '';
                examDateTimeInput.value = '';
                break;
        }
    });

    // Initial trigger to populate fields based on the default value
    matrixCodeDropdown.dispatchEvent(new Event('change'));

    const selectElement = document.querySelector('select[name="Matrix_Code"]');

    // Convert options to an array
    const optionsArray = Array.from(selectElement.options);

    // Remove the first option ("Select Matrix Code")
    const firstOption = optionsArray.shift();

    // Sort the remaining options alphabetically
    optionsArray.sort((a, b) => a.text.localeCompare(b.text));

    // Append the first option back to the start
    selectElement.innerHTML = '';
    selectElement.appendChild(firstOption);

    // Append the sorted options
    optionsArray.forEach(option => selectElement.appendChild(option));
});

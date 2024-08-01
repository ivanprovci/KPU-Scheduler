document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const semesterId = urlParams.get('semesterId');
    document.getElementById('semesterId').value = semesterId;

    // Fetch semester details using the ID
    try {
        const response = await fetch(`http://localhost:3000/semesters/getName?semesterId=${semesterId}`);
        const semesterData = await response.json();

        // Display the semester name
        const semesterNameDisplay = document.getElementById('semesterNameDisplay');
        semesterNameDisplay.textContent = semesterData;
    } catch (error) {
        console.error("Error fetching semester name");
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
        console.log("Add Another Class button clicked");

        // Select the form and required fields
        const form = document.getElementById('classForm');
        const requiredFields = [
            'CRN', 
            'Subject', 
            'Class_Number', 
            'Section', 
            'Matrix_Code',
            'Exam_Y_N', 
            'Room_Type', 
            'Room_Preferences', 
            'Instructor'
        ];

        let allFieldsValid = true;

        // Loop through required fields to check if they are filled
        requiredFields.forEach(function (field) {
            const fieldElement = form.elements[field];
            if (fieldElement && !fieldElement.value) {
                fieldElement.classList.add('is-invalid');
                allFieldsValid = false;
            } else {
                fieldElement.classList.remove('is-invalid');
            }
        });

        if (!allFieldsValid) {
            alert('Please fill out all required fields.');
            return;
        }

        const formData = new FormData(form);
        const classData = {};

        // Clear previous error highlights and messages
        form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(el => el.remove());

        formData.forEach((value, key) => {
            if (key === 'Week_Days') {
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

        // Add the Semester ID to the class data
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

        console.log("Class Data:", classData);

        if (Object.values(classData).every(x => x === "" || x === null)) {
            alert("Please fill out all fields before adding another class.");
            return;
        }

        // Check for duplicate course number and section, and CRN conflicts
        fetch(`/classes/check-duplicate?crn=${classData.CRN}&course=${classData.Course}&section=${classData.Section}&semesterId=${classData.Semester_ID}`)
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
                                        if (data.field === 'Section') {
                                            errorMessage.textContent = "Please enter a different section number";
                                        } else if (data.field === 'CRN') {
                                            errorMessage.textContent = "Enter a valid CRN number";
                                        } else if (data.field === 'Room_Preferences') {
                                            errorMessage.textContent = "There is a classroom time conflict with another class";
                                        } else if (data.field === 'Instructor') {
                                            errorMessage.textContent = "There is a time conflict for this instructor";
                                        } else {
                                            errorMessage.textContent = "Invalid input";
                                        }
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
    const examDateTimeInput = document.querySelector('input[name="Exam_DateTime"]');

    const matrixCodeConfig = {
        'OFF': { bannerCode: '', weekDays: [], startTime: '', endTime: '', examDateTime: '' },
        'ASYNC': { bannerCode: '', weekDays: [], startTime: '', endTime: '', examDateTime: '' },
        '1': { bannerCode: '1R1', weekDays: ['M', 'R'], startTime: '08:00', endTime: '09:50', examDateTime: '2023-12-14 08:30 - 11:30' },
        '2': { bannerCode: '1F1', weekDays: ['T', 'F'], startTime: '08:00', endTime: '09:50', examDateTime: '2023-12-08 08:30 - 11:30' },
        '3': { bannerCode: '1M1', weekDays: ['M', 'W'], startTime: '10:00', endTime: '11:50', examDateTime: '2023-12-11 08:30 - 11:30' },
        '4': { bannerCode: '2R1', weekDays: ['T', 'R'], startTime: '10:00', endTime: '11:50', examDateTime: '2023-12-07 08:30 - 11:30' },
        '5': { bannerCode: '1W2', weekDays: ['M', 'W'], startTime: '12:00', endTime: '13:50', examDateTime: '2023-12-13 12:00 - 15:00' },
        '6': { bannerCode: '1F2', weekDays: ['T', 'F'], startTime: '12:00', endTime: '13:50', examDateTime: '2023-12-08 12:00 - 15:00' },
        '7': { bannerCode: '2R2', weekDays: ['M', 'R'], startTime: '14:00', endTime: '15:50', examDateTime: '2023-12-07 12:00 - 15:00' },
        '8': { bannerCode: '1M3', weekDays: ['M', 'W'], startTime: '16:00', endTime: '17:50', examDateTime: '2023-12-11 15:30 - 18:30' },
        '9': { bannerCode: '2F3', weekDays: ['T', 'F'], startTime: '16:00', endTime: '17:50', examDateTime: '2023-12-08 15:30 - 18:30' },
        '10': { bannerCode: '2M3', weekDays: ['M', 'W'], startTime: '18:00', endTime: '19:50', examDateTime: '2023-12-12 19:30 - 18:30' },
        '11': { bannerCode: '1W4', weekDays: ['M', 'W'], startTime: '18:00', endTime: '19:50', examDateTime: '2023-12-11 19:00 - 22:00' },
        '14': { bannerCode: '2F4', weekDays: ['T', 'F'], startTime: '18:00', endTime: '19:50', examDateTime: '2023-12-08 19:00 - 22:00' },
        '22': { bannerCode: '2R4', weekDays: ['T', 'R'], startTime: '18:00', endTime: '19:50', examDateTime: '2023-12-14 19:00 - 22:00' },
        '24': { bannerCode: '2M4', weekDays: ['M', 'W'], startTime: '20:00', endTime: '21:50', examDateTime: '2023-12-11 19:00 - 22:00' },
        'MP4': { bannerCode: '3F4', weekDays: ['T', 'F'], startTime: '20:00', endTime: '21:50', examDateTime: '2023-12-08 19:00 - 22:00' },
        'MQ4': { bannerCode: '3M4', weekDays: ['M', 'W'], startTime: '20:00', endTime: '21:50', examDateTime: '2023-12-11 19:00 - 22:00' },
        'MQ6': { bannerCode: '3R4', weekDays: ['T', 'R'], startTime: '20:00', endTime: '21:50', examDateTime: '2023-12-12 19:00 - 22:00' },
        'MR4': { bannerCode: '4M4', weekDays: ['M', 'W'], startTime: '08:00', endTime: '09:50', examDateTime: '2023-12-14 08:30 - 11:30' },
        'MS4': { bannerCode: '4R4', weekDays: ['T', 'R'], startTime: '08:00', endTime: '09:50', examDateTime: '2023-12-07 08:30 - 11:30' },
        'MT4': { bannerCode: '5M4', weekDays: ['M', 'W'], startTime: '12:00', endTime: '13:50', examDateTime: '2023-12-13 12:00 - 15:00' },
        'MU4': { bannerCode: '5R4', weekDays: ['T', 'R'], startTime: '12:00', endTime: '13:50', examDateTime: '2023-12-07 12:00 - 15:00' },
        'TP4': { bannerCode: '6M4', weekDays: ['M', 'W'], startTime: '14:00', endTime: '15:50', examDateTime: '2023-12-11 15:30 - 18:30' },
        'TQ4': { bannerCode: '6R4', weekDays: ['T', 'R'], startTime: '14:00', endTime: '15:50', examDateTime: '2023-12-07 15:30 - 18:30' },
        'TQ6': { bannerCode: '7M4', weekDays: ['M', 'W'], startTime: '16:00', endTime: '17:50', examDateTime: '2023-12-13 16:00 - 19:00' },
        'TR4': { bannerCode: '7R4', weekDays: ['T', 'R'], startTime: '16:00', endTime: '17:50', examDateTime: '2023-12-12 16:00 - 19:00' },
        'TS4': { bannerCode: '8M4', weekDays: ['M', 'W'], startTime: '18:00', endTime: '19:50', examDateTime: '2023-12-11 19:00 - 22:00' },
        'TT4': { bannerCode: '8R4', weekDays: ['T', 'R'], startTime: '18:00', endTime: '19:50', examDateTime: '2023-12-14 19:00 - 22:00' },
        'TU4': { bannerCode: '9M4', weekDays: ['M', 'W'], startTime: '20:00', endTime: '21:50', examDateTime: '2023-12-11 19:00 - 22:00' },
        'WP4': { bannerCode: '9R4', weekDays: ['T', 'R'], startTime: '20:00', endTime: '21:50', examDateTime: '2023-12-12 19:00 - 22:00' },
        'WQ4': { bannerCode: '10M4', weekDays: ['M', 'W'], startTime: '08:00', endTime: '09:50', examDateTime: '2023-12-14 08:30 - 11:30' },
        'WQ6': { bannerCode: '10R4', weekDays: ['T', 'R'], startTime: '08:00', endTime: '09:50', examDateTime: '2023-12-07 08:30 - 11:30' },
        'WR4': { bannerCode: '11M4', weekDays: ['M', 'W'], startTime: '12:00', endTime: '13:50', examDateTime: '2023-12-13 12:00 - 15:00' },
        'WS4': { bannerCode: '11R4', weekDays: ['T', 'R'], startTime: '12:00', endTime: '13:50', examDateTime: '2023-12-07 12:00 - 15:00' },
        'WT4': { bannerCode: '12M4', weekDays: ['M', 'W'], startTime: '14:00', endTime: '15:50', examDateTime: '2023-12-11 15:30 - 18:30' },
        'WU4': { bannerCode: '12R4', weekDays: ['T', 'R'], startTime: '14:00', endTime: '15:50', examDateTime: '2023-12-07 15:30 - 18:30' },
        'RP4': { bannerCode: '13M4', weekDays: ['M', 'W'], startTime: '16:00', endTime: '17:50', examDateTime: '2023-12-11 16:00 - 19:00' },
        'RQ6': { bannerCode: '14M4', weekDays: ['M', 'W'], startTime: '18:00', endTime: '19:50', examDateTime: '2023-12-11 19:00 - 22:00' },
        'RR4': { bannerCode: '14R4', weekDays: ['T', 'R'], startTime: '18:00', endTime: '19:50', examDateTime: '2023-12-14 19:00 - 22:00' },
        'RS4': { bannerCode: '15M4', weekDays: ['M', 'W'], startTime: '20:00', endTime: '21:50', examDateTime: '2023-12-11 19:00 - 22:00' },
        'RT4': { bannerCode: '15R4', weekDays: ['T', 'R'], startTime: '20:00', endTime: '21:50', examDateTime: '2023-12-12 19:00 - 22:00' },
        'RU4': { bannerCode: '16M4', weekDays: ['M', 'W'], startTime: '08:00', endTime: '09:50', examDateTime: '2023-12-14 08:30 - 11:30' },
        'FP4': { bannerCode: '16R4', weekDays: ['T', 'R'], startTime: '08:00', endTime: '09:50', examDateTime: '2023-12-07 08:30 - 11:30' },
        'FPQ': { bannerCode: '17M4', weekDays: ['M', 'W'], startTime: '12:00', endTime: '13:50', examDateTime: '2023-12-13 12:00 - 15:00' },
        'FQ4': { bannerCode: '17R4', weekDays: ['T', 'R'], startTime: '12:00', endTime: '13:50', examDateTime: '2023-12-07 12:00 - 15:00' },
        'FQ6': { bannerCode: '18M4', weekDays: ['M', 'W'], startTime: '14:00', endTime: '15:50', examDateTime: '2023-12-11 15:30 - 18:30' },
        'FR4': { bannerCode: '18R4', weekDays: ['T', 'R'], startTime: '14:00', endTime: '15:50', examDateTime: '2023-12-07 15:30 - 18:30' },
        'FRS': { bannerCode: '19M4', weekDays: ['M', 'W'], startTime: '16:00', endTime: '17:50', examDateTime: '2023-12-11 16:00 - 19:00' },
        'FS4': { bannerCode: '19R4', weekDays: ['T', 'R'], startTime: '16:00', endTime: '17:50', examDateTime: '2023-12-12 16:00 - 19:00' },
        'FT4': { bannerCode: '20M4', weekDays: ['M', 'W'], startTime: '18:00', endTime: '19:50', examDateTime: '2023-12-11 19:00 - 22:00' },
        'FU4': { bannerCode: '20R4', weekDays: ['T', 'R'], startTime: '18:00', endTime: '19:50', examDateTime: '2023-12-14 19:00 - 22:00' },
        'SP4': { bannerCode: '21M4', weekDays: ['M', 'W'], startTime: '20:00', endTime: '21:50', examDateTime: '2023-12-11 19:00 - 22:00' },
        'SQ4': { bannerCode: '21R4', weekDays: ['T', 'R'], startTime: '20:00', endTime: '21:50', examDateTime: '2023-12-12 19:00 - 22:00' },
        'SQ6': { bannerCode: '22M4', weekDays: ['M', 'W'], startTime: '08:00', endTime: '09:50', examDateTime: '2023-12-14 08:30 - 11:30' },
        'SR4': { bannerCode: '22R4', weekDays: ['T', 'R'], startTime: '08:00', endTime: '09:50', examDateTime: '2023-12-07 08:30 - 11:30' },
        'SS4': { bannerCode: '23M4', weekDays: ['M', 'W'], startTime: '12:00', endTime: '13:50', examDateTime: '2023-12-13 12:00 - 15:00' },
        'ST4': { bannerCode: '23R4', weekDays: ['T', 'R'], startTime: '12:00', endTime: '13:50', examDateTime: '2023-12-07 12:00 - 15:00' },
        'MWP': { bannerCode: '24M4', weekDays: ['M', 'W'], startTime: '14:00', endTime: '15:50', examDateTime: '2023-12-11 15:30 - 18:30' },
        'MWS': { bannerCode: '24R4', weekDays: ['T', 'R'], startTime: '14:00', endTime: '15:50', examDateTime: '2023-12-07 15:30 - 18:30' },
        'TRP': { bannerCode: '25M4', weekDays: ['M', 'W'], startTime: '16:00', endTime: '17:50', examDateTime: '2023-12-11 16:00 - 19:00' },
        'TRR': { bannerCode: '25R4', weekDays: ['T', 'R'], startTime: '16:00', endTime: '17:50', examDateTime: '2023-12-12 16:00 - 19:00' },
        'TRS': { bannerCode: '26M4', weekDays: ['M', 'W'], startTime: '18:00', endTime: '19:50', examDateTime: '2023-12-11 19:00 - 22:00' },
        'MBC': { bannerCode: '26R4', weekDays: ['T', 'R'], startTime: '18:00', endTime: '19:50', examDateTime: '2023-12-14 19:00 - 22:00' },
        'MDE': { bannerCode: '27M4', weekDays: ['M', 'W'], startTime: '20:00', endTime: '21:50', examDateTime: '2023-12-11 19:00 - 22:00' },
        'MD6': { bannerCode: '27R4', weekDays: ['T', 'R'], startTime: '20:00', endTime: '21:50', examDateTime: '2023-12-12 19:00 - 22:00' },
        'MFG': { bannerCode: '28M4', weekDays: ['M', 'W'], startTime: '08:00', endTime: '09:50', examDateTime: '2023-12-14 08:30 - 11:30' },
        'MH': { bannerCode: '28R4', weekDays: ['T', 'R'], startTime: '08:00', endTime: '09:50', examDateTime: '2023-12-07 08:30 - 11:30' },
        'TBC': { bannerCode: '29M4', weekDays: ['M', 'W'], startTime: '10:00', endTime: '11:50', examDateTime: '2023-12-13 10:00 - 13:00' },
        'TDE': { bannerCode: '29R4', weekDays: ['T', 'R'], startTime: '10:00', endTime: '11:50', examDateTime: '2023-12-12 10:00 - 13:00' },
        'TD6': { bannerCode: '30M4', weekDays: ['M', 'W'], startTime: '12:00', endTime: '13:50', examDateTime: '2023-12-14 12:00 - 15:00' },
        'TFG': { bannerCode: '30R4', weekDays: ['T', 'R'], startTime: '12:00', endTime: '13:50', examDateTime: '2023-12-07 12:00 - 15:00' },
        'TH': { bannerCode: '31M4', weekDays: ['M', 'W'], startTime: '14:00', endTime: '15:50', examDateTime: '2023-12-11 14:00 - 17:00' },
        'WBC': { bannerCode: '31R4', weekDays: ['T', 'R'], startTime: '14:00', endTime: '15:50', examDateTime: '2023-12-12 14:00 - 17:00' },
        'WDE': { bannerCode: '32M4', weekDays: ['M', 'W'], startTime: '16:00', endTime: '17:50', examDateTime: '2023-12-11 16:00 - 19:00' },
        'WD6': { bannerCode: '32R4', weekDays: ['T', 'R'], startTime: '16:00', endTime: '17:50', examDateTime: '2023-12-07 16:00 - 19:00' },
        'WFG': { bannerCode: '33M4', weekDays: ['M', 'W'], startTime: '18:00', endTime: '19:50', examDateTime: '2023-12-11 19:00 - 22:00' },
        'WH': { bannerCode: '33R4', weekDays: ['T', 'R'], startTime: '18:00', endTime: '19:50', examDateTime: '2023-12-12 19:00 - 22:00' },
        'RDE': { bannerCode: '34M4', weekDays: ['M', 'W'], startTime: '20:00', endTime: '21:50', examDateTime: '2023-12-11 19:00 - 22:00' },
        'FBC': { bannerCode: 'FBC1', weekDays: ['M', 'W'], startTime: '10:00', endTime: '11:50', examDateTime: '2023-12-15 10:00 - 12:00' },
        'FD6': { bannerCode: 'FD61', weekDays: ['T', 'R'], startTime: '12:00', endTime: '13:50', examDateTime: '2023-12-16 12:00 - 14:00' },
        'FDE': { bannerCode: 'FDE1', weekDays: ['M', 'W'], startTime: '14:00', endTime: '15:50', examDateTime: '2023-12-17 14:00 - 16:00' },
        'FFG': { bannerCode: 'FFG1', weekDays: ['T', 'R'], startTime: '16:00', endTime: '17:50', examDateTime: '2023-12-18 16:00 - 18:00' },
        'FH': { bannerCode: 'FH1', weekDays: ['M', 'W'], startTime: '18:00', endTime: '19:50', examDateTime: '2023-12-19 18:00 - 20:00' },
        'MWA': { bannerCode: 'MWA1', weekDays: ['T', 'R'], startTime: '20:00', endTime: '21:50', examDateTime: '2023-12-20 20:00 - 22:00' },
        'MWB': { bannerCode: 'MWB1', weekDays: ['M', 'W'], startTime: '08:00', endTime: '09:50', examDateTime: '2023-12-21 08:00 - 10:00' },
        'MWC': { bannerCode: 'MWC1', weekDays: ['T', 'R'], startTime: '10:00', endTime: '11:50', examDateTime: '2023-12-22 10:00 - 12:00' },
        'MWD': { bannerCode: 'MWD1', weekDays: ['M', 'W'], startTime: '12:00', endTime: '13:50', examDateTime: '2023-12-23 12:00 - 14:00' },
        'MWE': { bannerCode: 'MWE1', weekDays: ['T', 'R'], startTime: '14:00', endTime: '15:50', examDateTime: '2023-12-24 14:00 - 16:00' },
        'MWF': { bannerCode: 'MWF1', weekDays: ['M', 'W'], startTime: '16:00', endTime: '17:50', examDateTime: '2023-12-25 16:00 - 18:00' },
        'MWG': { bannerCode: 'MWG1', weekDays: ['T', 'R'], startTime: '18:00', endTime: '19:50', examDateTime: '2023-12-26 18:00 - 20:00' },
        'RBC': { bannerCode: 'RBC1', weekDays: ['M', 'W'], startTime: '20:00', endTime: '21:50', examDateTime: '2023-12-27 20:00 - 22:00' },
        'RD6': { bannerCode: 'RD61', weekDays: ['T', 'R'], startTime: '08:00', endTime: '09:50', examDateTime: '2023-12-28 08:00 - 10:00' },
        'RFG': { bannerCode: 'RFG1', weekDays: ['M', 'W'], startTime: '10:00', endTime: '11:50', examDateTime: '2023-12-29 10:00 - 12:00' },
        'RH': { bannerCode: 'RH1', weekDays: ['T', 'R'], startTime: '12:00', endTime: '13:50', examDateTime: '2023-12-30 12:00 - 14:00' },
        'RQ4': { bannerCode: 'RQ41', weekDays: ['M', 'W'], startTime: '14:00', endTime: '15:50', examDateTime: '2024-01-02 14:00 - 16:00' },
        'S11': { bannerCode: 'S111', weekDays: ['T', 'R'], startTime: '16:00', endTime: '17:50', examDateTime: '2024-01-03 16:00 - 18:00' },
        'S12': { bannerCode: 'S121', weekDays: ['M', 'W'], startTime: '18:00', endTime: '19:50', examDateTime: '2024-01-04 18:00 - 20:00' },
        'S13': { bannerCode: 'S131', weekDays: ['T', 'R'], startTime: '20:00', endTime: '21:50', examDateTime: '2024-01-05 20:00 - 22:00' },
        'S14': { bannerCode: 'S141', weekDays: ['M', 'W'], startTime: '08:00', endTime: '09:50', examDateTime: '2024-01-06 08:00 - 10:00' },
        'S15': { bannerCode: 'S151', weekDays: ['T', 'R'], startTime: '10:00', endTime: '11:50', examDateTime: '2024-01-07 10:00 - 12:00' },
        'S1A': { bannerCode: 'S1A1', weekDays: ['M', 'W'], startTime: '12:00', endTime: '13:50', examDateTime: '2024-01-08 12:00 - 14:00' },
        'S1B': { bannerCode: 'S1B1', weekDays: ['T', 'R'], startTime: '14:00', endTime: '15:50', examDateTime: '2024-01-09 14:00 - 16:00' },
        'S1C': { bannerCode: 'S1C1', weekDays: ['M', 'W'], startTime: '16:00', endTime: '17:50', examDateTime: '2024-01-10 16:00 - 18:00' },
        'S1D': { bannerCode: 'S1D1', weekDays: ['T', 'R'], startTime: '18:00', endTime: '19:50', examDateTime: '2024-01-11 18:00 - 20:00' },
        'S1E': { bannerCode: 'S1E1', weekDays: ['M', 'W'], startTime: '20:00', endTime: '21:50', examDateTime: '2024-01-12 20:00 - 22:00' },
        'S1F': { bannerCode: 'S1F1', weekDays: ['T', 'R'], startTime: '08:00', endTime: '09:50', examDateTime: '2024-01-13 08:00 - 10:00' },
        'S1F1': { bannerCode: 'S1F11', weekDays: ['M', 'W'], startTime: '10:00', endTime: '11:50', examDateTime: '2024-01-14 10:00 - 12:00' },
        'S1F2': { bannerCode: 'S1F21', weekDays: ['T', 'R'], startTime: '12:00', endTime: '13:50', examDateTime: '2024-01-15 12:00 - 14:00' },
        'S1F6': { bannerCode: 'S1F61', weekDays: ['M', 'W'], startTime: '12:00', endTime: '13:50', examDateTime: '2024-01-16 12:00 - 14:00' },
        'S1G': { bannerCode: 'S1G1', weekDays: ['T', 'R'], startTime: '14:00', endTime: '15:50', examDateTime: '2024-01-17 14:00 - 16:00' },
        'S1MWBC': { bannerCode: 'S1MWBC1', weekDays: ['M', 'W'], startTime: '16:00', endTime: '17:50', examDateTime: '2024-01-18 16:00 - 18:00' },
        'S1MWDE': { bannerCode: 'S1MWDE1', weekDays: ['T', 'R'], startTime: '18:00', endTime: '19:50', examDateTime: '2024-01-19 18:00 - 20:00' },
        'S1MWFG': { bannerCode: 'S1MWFG1', weekDays: ['M', 'W'], startTime: '20:00', endTime: '21:50', examDateTime: '2024-01-20 20:00 - 22:00' },
        'S1MWH': { bannerCode: 'S1MWH1', weekDays: ['T', 'R'], startTime: '08:00', endTime: '09:50', examDateTime: '2024-01-21 08:00 - 10:00' },
        'S1P': { bannerCode: 'S1P1', weekDays: ['M', 'W'], startTime: '10:00', endTime: '11:50', examDateTime: '2024-01-22 10:00 - 12:00' },
        'S1S6': { bannerCode: 'S1S61', weekDays: ['T', 'R'], startTime: '12:00', endTime: '13:50', examDateTime: '2024-01-23 12:00 - 14:00' },
        'S1S8': { bannerCode: 'S1S81', weekDays: ['M', 'W'], startTime: '14:00', endTime: '15:50', examDateTime: '2024-01-24 14:00 - 16:00' },
        'S1TRBC': { bannerCode: 'S1TRBC1', weekDays: ['T', 'R'], startTime: '16:00', endTime: '17:50', examDateTime: '2024-01-25 16:00 - 18:00' },
        'S1TRDE': { bannerCode: 'S1TRDE1', weekDays: ['M', 'W'], startTime: '18:00', endTime: '19:50', examDateTime: '2024-01-26 18:00 - 20:00' },
        'S1TRFG': { bannerCode: 'S1TRFG1', weekDays: ['T', 'R'], startTime: '20:00', endTime: '21:50', examDateTime: '2024-01-27 20:00 - 22:00' },
        'S21': { bannerCode: 'S211', weekDays: ['M', 'W'], startTime: '08:00', endTime: '09:50', examDateTime: '2024-01-28 08:00 - 10:00' },
        'S22': { bannerCode: 'S221', weekDays: ['T', 'R'], startTime: '10:00', endTime: '11:50', examDateTime: '2024-01-29 10:00 - 12:00' },
        'S23': { bannerCode: 'S231', weekDays: ['M', 'W'], startTime: '12:00', endTime: '13:50', examDateTime: '2024-01-30 12:00 - 14:00' },
        'S24': { bannerCode: 'S241', weekDays: ['T', 'R'], startTime: '14:00', endTime: '15:50', examDateTime: '2024-01-31 14:00 - 16:00' },
        'S25': { bannerCode: 'S251', weekDays: ['M', 'W'], startTime: '16:00', endTime: '17:50', examDateTime: '2024-02-01 16:00 - 18:00' },
        'S2A': { bannerCode: 'S2A1', weekDays: ['T', 'R'], startTime: '18:00', endTime: '19:50', examDateTime: '2024-02-02 18:00 - 20:00' },
        'S2B': { bannerCode: 'S2B1', weekDays: ['M', 'W'], startTime: '20:00', endTime: '21:50', examDateTime: '2024-02-03 20:00 - 22:00' },
        'S2C': { bannerCode: 'S2C1', weekDays: ['T', 'R'], startTime: '08:00', endTime: '09:50', examDateTime: '2024-02-04 08:00 - 10:00' },
        'S2D': { bannerCode: 'S2D1', weekDays: ['M', 'W'], startTime: '10:00', endTime: '11:50', examDateTime: '2024-02-05 10:00 - 12:00' },
        'S2E': { bannerCode: 'S2E1', weekDays: ['T', 'R'], startTime: '12:00', endTime: '13:50', examDateTime: '2024-02-06 12:00 - 14:00' },
        'S2F': { bannerCode: 'S2F1', weekDays: ['M', 'W'], startTime: '14:00', endTime: '15:50', examDateTime: '2024-02-07 14:00 - 16:00' },
        'S2F1': { bannerCode: 'S2F11', weekDays: ['T', 'R'], startTime: '16:00', endTime: '17:50', examDateTime: '2024-02-08 16:00 - 18:00' },
        'S2F2': { bannerCode: 'S2F21', weekDays: ['M', 'W'], startTime: '18:00', endTime: '19:50', examDateTime: '2024-02-09 18:00 - 20:00' },
        'S2F6': { bannerCode: 'S2F61', weekDays: ['T', 'R'], startTime: '20:00', endTime: '21:50', examDateTime: '2024-02-10 20:00 - 22:00' },
        'S2G': { bannerCode: 'S2G1', weekDays: ['M', 'W'], startTime: '08:00', endTime: '09:50', examDateTime: '2024-02-11 08:00 - 10:00' },
        'S2MWBC': { bannerCode: 'S2MWBC1', weekDays: ['T', 'R'], startTime: '10:00', endTime: '11:50', examDateTime: '2024-02-12 10:00 - 12:00' },
        'S2MWDE': { bannerCode: 'S2MWDE1', weekDays: ['M', 'W'], startTime: '12:00', endTime: '13:50', examDateTime: '2024-02-13 12:00 - 14:00' },
        'S2MWFG': { bannerCode: 'S2MWFG1', weekDays: ['T', 'R'], startTime: '14:00', endTime: '15:50', examDateTime: '2024-02-14 14:00 - 16:00' },
        'S2MWH': { bannerCode: 'S2MWH1', weekDays: ['M', 'W'], startTime: '16:00', endTime: '17:50', examDateTime: '2024-02-15 16:00 - 18:00' },
        'S2P': { bannerCode: 'S2P1', weekDays: ['T', 'R'], startTime: '18:00', endTime: '19:50', examDateTime: '2024-02-16 18:00 - 20:00' },
        'S2S6': { bannerCode: 'S2S61', weekDays: ['M', 'W'], startTime: '20:00', endTime: '21:50', examDateTime: '2024-02-17 20:00 - 22:00' },
        'S2S8': { bannerCode: 'S2S81', weekDays: ['T', 'R'], startTime: '08:00', endTime: '09:50', examDateTime: '2024-02-18 08:00 - 10:00' },
        'S2TRBC': { bannerCode: 'S2TRBC1', weekDays: ['M', 'W'], startTime: '10:00', endTime: '11:50', examDateTime: '2024-02-19 10:00 - 12:00' },
        'S2TRDE': { bannerCode: 'S2TRDE1', weekDays: ['T', 'R'], startTime: '12:00', endTime: '13:50', examDateTime: '2024-02-20 12:00 - 14:00' },
        'S2TRFG': { bannerCode: 'S2TRFG1', weekDays: ['M', 'W'], startTime: '14:00', endTime: '15:50', examDateTime: '2024-02-21 14:00 - 16:00' },
        'S2TRH': { bannerCode: 'S2TRH1', weekDays: ['T', 'R'], startTime: '16:00', endTime: '17:50', examDateTime: '2024-02-22 16:00 - 18:00' },
        'SBC': { bannerCode: 'SBC1', weekDays: ['M', 'W'], startTime: '18:00', endTime: '19:50', examDateTime: '2024-02-23 18:00 - 20:00' },
        'SD6': { bannerCode: 'SD61', weekDays: ['T', 'R'], startTime: '20:00', endTime: '21:50', examDateTime: '2024-02-24 20:00 - 22:00' },
        'SDE': { bannerCode: 'SDE1', weekDays: ['M', 'W'], startTime: '08:00', endTime: '09:50', examDateTime: '2024-02-25 08:00 - 10:00' },
        'TRA': { bannerCode: 'TRA1', weekDays: ['T', 'R'], startTime: '10:00', endTime: '11:50', examDateTime: '2024-02-26 10:00 - 12:00' },
        'TRB': { bannerCode: 'TRB1', weekDays: ['M', 'W'], startTime: '12:00', endTime: '13:50', examDateTime: '2024-02-27 12:00 - 14:00' },
        'TRC': { bannerCode: 'TRC1', weekDays: ['T', 'R'], startTime: '14:00', endTime: '15:50', examDateTime: '2024-02-28 14:00 - 16:00' },
        'TRD': { bannerCode: 'TRD1', weekDays: ['M', 'W'], startTime: '16:00', endTime: '17:50', examDateTime: '2024-02-29 16:00 - 18:00' },
        'TRE': { bannerCode: 'TRE1', weekDays: ['T', 'R'], startTime: '18:00', endTime: '19:50', examDateTime: '2024-03-01 18:00 - 20:00' },
        'TRF': { bannerCode: 'TRF1', weekDays: ['M', 'W'], startTime: '20:00', endTime: '21:50', examDateTime: '2024-03-02 20:00 - 22:00' },
        'TRG': { bannerCode: 'TRG1', weekDays: ['T', 'R'], startTime: '08:00', endTime: '09:50', examDateTime: '2024-03-03 08:00 - 10:00' }
    };

    // Update the form fields based on the selected Matrix Code
    matrixCodeDropdown.addEventListener('change', function () {
        const selectedMatrixCode = this.value;
        const config = matrixCodeConfig[selectedMatrixCode] || { bannerCode: '', weekDays: [], startTime: '', endTime: '', examDateTime: '' };

        bannerCodesInput.value = config.bannerCode;
        weekDaysInputs.forEach(input => {
            input.checked = config.weekDays.includes(input.value);
        });
        startTimeInput.value = config.startTime;
        endTimeInput.value = config.endTime;
        examDateTimeInput.value = config.examDateTime;
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

document.addEventListener('DOMContentLoaded', function () {
    const examYN = document.querySelector('select[name="Exam_Y_N"]');
    const examDateTime = document.querySelector('input[name="Exam_DateTime"]');

    function toggleExamDateTime() {
        if (examYN.value === 'N') {
            examDateTime.disabled = true;
        } else {
            examDateTime.disabled = false;
        }
    }

    examYN.addEventListener('change', toggleExamDateTime);

    // Initialize the state based on the current selection
    toggleExamDateTime();
});
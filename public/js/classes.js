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

    document.getElementById('addClass').addEventListener('click', function () {
        const form = document.getElementById('classForm');
        const formData = new FormData(form);
        const classData = {};

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

        if (Object.values(classData).every(x => x === "" || x === null)) {
            alert("Please fill out all fields before adding another class.");
            return;
        }

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
            } else {
                response.json().then(data => {
                    alert(`Error saving class data: ${data.message}`);
                    console.error("Server error response:", data);
                });
            }
        }).catch(error => {
            alert("Error saving class data.");
            console.error("Error in saveClassData:", error);
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
});

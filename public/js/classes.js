document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const semesterId = urlParams.get('semesterId');
    document.getElementById('semesterId').value = semesterId;

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
        const headers = ["CRN", "Subject", "Class_Number", "Section", "Campus", "Class_Size", "Status", "Instructional_Method", "Matrix_Code", "Banner_Codes", "Exam_Y_N", "Meeting_Type", "Session", "Non_Standard_Start_Date", "Non_Standard_End_Date", "Week_Day", "Start_Time", "End_Time", "Exam_Date_Time", "Room_Type", "Room_Preferences", "Instructor"];
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

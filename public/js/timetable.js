document.addEventListener('DOMContentLoaded', function () {
    const semesterSelect = document.getElementById('semesterSelect');
    const timetableBody = document.getElementById('timetableBody');
    const exportCSVButton = document.getElementById('exportCSV');

    // Add default option to the dropdown
    const defaultOption = document.createElement('option');
    defaultOption.textContent = "Choose a semester";
    defaultOption.value = "";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    semesterSelect.appendChild(defaultOption);

    // Fetch and populate semester options
    fetch('/timetable/api/semesters')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("Semesters data:", data); // Log the fetched data
            data.forEach(semester => {
                const option = document.createElement('option');
                option.value = semester.id;
                option.textContent = semester.Name;
                semesterSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching semesters:', error);
        });

    // Event listener for semester selection
    semesterSelect.addEventListener('change', function () {
        const semesterId = this.value;
        fetchTimetable(semesterId);
    });

    function fetchTimetable(semesterId) {
        console.log(`Fetching timetable for semesterId: ${semesterId}`);
        fetch(`/timetable/api/classes?semesterId=${semesterId}`)
            .then(response => {
                console.log('Response:', response); // Log the response
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log("Classes data:", data); // Log the fetched data
                timetableBody.innerHTML = ''; // Clear existing rows

                data.forEach(classData => {
                    console.log('Class Data:', classData); // Log each classData object

                    // Generate the table row based on actual keys in classData
                    const row = document.createElement('tr');
                    row.innerHTML = `
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
                        <td>${classData.M}</td>
                        <td>${classData.T}</td>
                        <td>${classData.W}</td>
                        <td>${classData.R}</td>
                        <td>${classData.F}</td>
                        <td>${classData.S}</td>
                        <td>${classData.U}</td>
                        <td>${classData.Start_Time}</td>
                        <td>${classData.End_Time}</td>
                        <td>${classData.Exam_Date_Time}</td>
                        <td>${classData.Room_Type}</td>
                        <td>${classData.Room_Preferences}</td>
                        <td>${classData.Instructor}</td>
                        <td>${classData.Crosslist_Code}</td>
                        <td>${classData.Link_ID}</td>
                        <td>${classData.Additional_Information}</td>
                        <td>${classData.Zero_Textbook_Cost_Adobe_Creative_Cloud}</td>
                        <td>${classData.Program_Restrictions}</td>
                        <td>${classData.Reserved_Seats}</td>
                        <td>${classData.Overflow_Y_N}</td>
                        <td>${classData.Date_Reserves_Removed}</td>
                        <td>${classData.Fee_Detail_Code}</td>
                        <td>${classData.Addtl_Mandatory_Course_Fee}</td>
                        <td>${classData.Funding_Source}</td>
                    `;
                    timetableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error fetching classes:', error);
            });
    }
    
    // Function to download CSV
    function downloadCSV(csvContent, fileName) {
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Event listener to handle CSV export
    exportCSVButton.addEventListener('click', function () {
        let csvContent = "data:text/csv;charset=utf-8,";
        let csvRow = [];
        const headers = document.querySelectorAll(".schedule-table thead th");
        headers.forEach(header => {
            csvRow.push('"' + header.textContent + '"');
        });
        csvContent += csvRow.join(",") + "\r\n";

        // Fetch rows and each cell into CSV format
        const rows = document.querySelectorAll(".schedule-table tbody tr");
        rows.forEach(row => {
            csvRow = [];
            const cells = row.querySelectorAll("td");
            cells.forEach((cell, index) => {
                // Handle day columns specially
                if (['M', 'T', 'W', 'R', 'F', 'S', 'U'].includes(headers[index].textContent) && cell.textContent === "true") {
                    csvRow.push('"' + headers[index].textContent + '"');  // Use the day letter
                } else if (['M', 'T', 'W', 'R', 'F', 'S', 'U'].includes(headers[index].textContent) && cell.textContent === "false") {
                    csvRow.push('""');  // Leave blank
                } else {
                    csvRow.push('"' + cell.textContent.replace(/"/g, '""') + '"');  // Handle quotes by doubling them
                }
            });
            csvContent += csvRow.join(",") + "\r\n";
        });

        // Use semester name for file name if available
        const selectedSemesterName = semesterSelect.options[semesterSelect.selectedIndex].text;
        const fileName = selectedSemesterName ? `${selectedSemesterName.replace(/ /g, '_')}.csv` : 'timetable.csv';

        // Download CSV file
        downloadCSV(csvContent, fileName);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Fetch data from API (this URL should be replaced with your actual API endpoint)
    fetch('/api/timetable')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('schedule-table-body');

            // Iterate over the data and create rows
            data.forEach(item => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${item.crn}</td>
                    <td>${item.subject}</td>
                    <td>${item.course}</td>
                    <td>${item.section}</td>
                    <td>${item.campus}</td>
                    <td>${item.classSize}</td>
                    <td>${item.status}</td>
                    <td>${item.instructionalMethod}</td>
                    <td>${item.matrixCode}</td>
                    <td>${item.bannerCodes}</td>
                    <td>${item.examYn}</td>
                    <td>${item.meetingType}</td>
                    <td>${item.session}</td>
                    <td>${item.nonStandardStartDate}</td>
                    <td>${item.nonStandardEndDate}</td>
                    <td>${item.m}</td>
                    <td>${item.t}</td>
                    <td>${item.w}</td>
                    <td>${item.r}</td>
                    <td>${item.f}</td>
                    <td>${item.s}</td>
                    <td>${item.u}</td>
                    <td>${item.startTime}</td>
                    <td>${item.endTime}</td>
                    <td>${item.examDateTime}</td>
                    <td>${item.roomType}</td>
                    <td>${item.roomPreferences}</td>
                    <td>${item.instructor}</td>
                    <td>${item.crosslistCode}</td>
                    <td>${item.linkId}</td>
                    <td>${item.additionalInformation}</td>
                    <td>${item.zeroTextbookCost}</td>
                    <td>${item.programRestrictions}</td>
                    <td>${item.reservedSeats}</td>
                    <td>${item.overflowYn}</td>
                    <td>${item.dateReservesRemoved}</td>
                    <td>${item.feeDetailCode}</td>
                    <td>${item.additionalMandatoryCourseFee}</td>
                    <td>${item.fundingSource}</td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});
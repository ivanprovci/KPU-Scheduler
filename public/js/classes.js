 // Extract semesterId from URL and set it in the hidden input field
 const urlParams = new URLSearchParams(window.location.search);
 const semesterId = urlParams.get('semesterId');
 document.getElementById('semesterId').value = semesterId; 

 document.getElementById('addClass').addEventListener('click', function () {
     const classEntryTemplate = `
         <div class="class-entry border p-3 mb-3">
             <div class="form-group">
                 <label for="crn">CRN</label>
                 <input type="number" class="form-control" name="crn" placeholder="Enter CRN" oninput="this.value = this.value.slice(0, 5)">
             </div>
             <div class="form-group">
                 <label for="subject">Subject</label>
                 <select class="form-control" name="subject">
                     <option>INFO</option>
                 </select>
             </div>
             <div class="form-group">
                 <label for="classNumber">Class Number</label>
                 <input type="number" class="form-control" name="classNumber" placeholder="Enter Class Number" oninput="this.value = this.value.slice(0, 4)">
             </div>
             <div class="form-group">
                 <label for="section">Section</label>
                 <input type="text" class="form-control" name="section" placeholder="Enter Section" oninput="this.value = this.value.slice(0, 3)">
             </div>
             <div class="form-group">
                 <label for="campus">Campus</label>
                 <select class="form-control" name="campus">
                     <option>Richmond</option>
                     <option>Surrey</option>
                     <option>Langley</option>
                 </select>
             </div>
             <div class="form-group">
                 <label for="classSize">Class Size</label>
                 <input type="number" class="form-control" name="classSize" placeholder="Enter Class Size" oninput="this.value = this.value.slice(0, 2)">
             </div>
             <div class="form-group">
                 <label for="status">Status</label>
                 <select class="form-control" name="status">
                     <option>Active</option>
                 </select>
             </div>
             <div class="form-group">
                 <label for="instructionalMethod">Instructional Method</label>
                 <select class="form-control" name="instructionalMethod">
                     <option>In-person</option>
                     <option>Online Synchronous</option>
                     <option>Blended Synchronous</option>
                 </select>
             </div>
             <div class="form-group">
                 <label for="matrixCode">Matrix Code</label>
                 <input type="text" class="form-control" name="matrixCode" placeholder="Enter Matrix Code" oninput="this.value = this.value.slice(0, 3)">
             </div>
             <div class="form-group">
                 <label for="bannerCodes">Banner Codes</label>
                 <input type="text" class="form-control" name="bannerCodes" placeholder="Enter Banner Codes" oninput="this.value = this.value.slice(0, 2)">
             </div>
             <div class="form-group">
                 <label for="exam">Exam Y/N</label>
                 <select class="form-control" name="exam">
                     <option>Y</option>
                     <option>N</option>
                 </select>
             </div>
             <div class="form-group">
                 <label for="meetingType">Meeting Type</label>
                 <select class="form-control" name="meetingType">
                     <option>Class</option>
                     <option>Add More</option>
                     <option>Add More</option>
                     <option>Add More</option>
                 </select>
             </div>
             <div class="form-group">
                 <label for="session">Session</label>
                 <select class="form-control" name="session">
                     <option>Full</option>
                     <option>Online</option>
                 </select>
             </div>
             <div class="form-group">
                 <label for="nonStartDate">Non-Standard Start Date</label>
                 <input type="date" class="form-control" name="nonStartDate">
             </div>
             <div class="form-group">
                 <label for="endDate">Non-Standard End Date</label>
                 <input type="date" class="form-control" name="endDate">
             </div>
             <div class="form-group">
                 <label for="weekDay">Week Day</label>
                 <select class="form-control" name="weekDay">
                     <option>Monday</option>
                     <option>Tuesday</option>
                     <option>Wednesday</option>
                     <option>Thursday</option>
                     <option>Friday</option>
                     <option>Saturday</option>
                     <option>Sunday</option>
                 </select>
             </div>
             <div class="form-group">
                 <label for="startTime">Start Time</label>
                 <input type="time" class="form-control" name="startTime">
             </div>
             <div class="form-group">
                 <label for="endTime">End Time</label>
                 <input type="time" class="form-control" name="endTime">
             </div>
             <div class="form-group">
                 <label for="examDateTime">Exam Date & Time</label>
                 <input type="datetime-local" class="form-control" name="examDateTime">
             </div>
             <div class="form-group">
                 <label for="roomType">Room Type</label>
                 <input type="text" class="form-control" name="roomType" placeholder="Enter Room Type">
             </div>
             <div class="form-group">
                 <label for="roomPreferences">Room Preferences</label>
                 <input type="text" class="form-control" name="roomPreferences" placeholder="Enter Room Preferences">
             </div>
             <div class="form-group">
                 <label for="instructor">Instructor</label>
                 <input type="text" class="form-control" name="instructor" placeholder="Enter Instructor Name">
             </div>
         </div>
     `;

     const classesContainer = document.getElementById('classesContainer');
     classesContainer.insertAdjacentHTML('beforeend', classEntryTemplate);
 });

 document.getElementById('classForm').addEventListener('submit', function (event) {
 event.preventDefault();
 const classEntries = document.querySelectorAll('.class-entry');
 const headers = ["CRN", "Subject", "Class Number", "Section", "Campus", "Class Size", "Status", "Instructional Method", "Matrix Code", "Banner Codes", "Exam Y/N", "Meeting Type", "Session", "Non-Standard Start Date", "Non-Standard End Date", "Week Day", "Start Time", "End Time", "Exam Date & Time", "Room Type", "Room Preferences", "Instructor"];
 const rows = [headers.join(',')];

 classEntries.forEach(entry => {
     const crn = entry.querySelector('input[name="crn"]').value;
     const subject = entry.querySelector('select[name="subject"]').value;
     const classNumber = entry.querySelector('input[name="classNumber"]').value;
     const section = entry.querySelector('input[name="section"]').value;
     const campus = entry.querySelector('select[name="campus"]').value;
     const classSize = entry.querySelector('input[name="classSize"]').value;
     const status = entry.querySelector('select[name="status"]').value;
     const instructionalMethod = entry.querySelector('select[name="instructionalMethod"]').value;
     const matrixCode = entry.querySelector('input[name="matrixCode"]').value;
     const bannerCodes = entry.querySelector('input[name="bannerCodes"]').value;
     const exam = entry.querySelector('select[name="exam"]').value;
     const meetingType = entry.querySelector('select[name="meetingType"]').value;
     const session = entry.querySelector('select[name="session"]').value;
     const nonStartDate = entry.querySelector('input[name="nonStartDate"]').value;
     const endDate = entry.querySelector('input[name="endDate"]').value;
     const weekDay = entry.querySelector('select[name="weekDay"]').value;
     const startTime = entry.querySelector('input[name="startTime"]').value;
     const endTime = entry.querySelector('input[name="endTime"]').value;
     const examDateTime = entry.querySelector('input[name="examDateTime"]').value;
     const roomType = entry.querySelector('input[name="roomType"]').value;
     const roomPreferences = entry.querySelector('input[name="roomPreferences"]').value;
     const instructor = entry.querySelector('input[name="instructor"]').value;

     const row = [crn, subject, classNumber, section, campus, classSize, status, instructionalMethod, matrixCode, bannerCodes, exam, meetingType, session, nonStartDate, endDate, weekDay, startTime, endTime, examDateTime, roomType, roomPreferences, instructor].join(',');
     rows.push(row);
 });

 let csvContent = "data:text/csv;charset=utf-8," + rows.join("\n");
 const encodedUri = encodeURI(csvContent);
 const link = document.createElement("a");
 link.setAttribute("href", encodedUri);
 link.setAttribute("download", "classes_data.csv");
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
});
const { pb } = require("./pocketbase-connection.js");

const createClass = async (classData) => {
	try {
		// Check if a class with the same CRN already exists
		const existingCrnClasses = await pb.collection("Courses").getFullList({
			filter: `CRN = "${classData.CRN}" && Semester_ID = "${classData.Semester_ID}"`,
		});

		if (existingCrnClasses.length > 0) {
			const error = new Error(
				"A class with this CRN already exists. Please use another CRN number."
			);
			error.field = "CRN";
			throw error;
		}

		// Check if a class with the same Course and Section already exists
		const existingCourseClasses = await pb.collection("Courses").getFullList({
			filter: `Course = "${classData.Course}" && Section = "${classData.Section}" && Semester_ID = "${classData.Semester_ID}"`,
		});

		if (existingCourseClasses.length > 0) {
			const error = new Error(
				"A class with this course number and section already exists. Each class must have a unique section number."
			);
			error.field = "Section";
			throw error;
		}

		// Construct the query to check for overlapping time and matching days
		const days = ['M', 'T', 'W', 'R', 'F', 'S', 'U'];
		const daysFilterParts = days.filter(day => classData[day]).map(day => `${day} = true`);
		const daysFilter = daysFilterParts.length > 0 ? `(${daysFilterParts.join(' || ')})` : '';

		// Construct the instructor filter
		const instructorFilterParts = [
			`Instructor = "${classData.Instructor}"`,
			`Start_Time <= "${classData.Start_Time}"`,
			`End_Time >= "${classData.End_Time}"`,
			`Semester_ID = "${classData.Semester_ID}"`,
			daysFilter
		].filter(part => part !== '');

		const instructorFilter = instructorFilterParts.join(' && ');

		console.log("Generated instructor filter: ", instructorFilter);

		const existingInstructorClasses = await pb.collection("Courses").getFullList({
			filter: instructorFilter,
		});

		console.log(existingInstructorClasses);

		if (existingInstructorClasses.length > 0) {
			const error = new Error(
				"This instructor is already teaching another class at the same time. Please use another instructor."
			);
			error.field = "Instructor";
			throw error;
		}

		// ClassRoom Conflict Check if not online
		if (classData.Room_Type !== "ONLINE") {
			const days1 = ['M', 'T', 'W', 'R', 'F', 'S', 'U'];
			const daysFilterParts1 = days1.filter(day => classData[day]).map(day => `${day} = true`);
			const daysFilter1 = daysFilterParts1.length > 0 ? `(${daysFilterParts1.join(' || ')})` : '';

			const roomPreferencesFilterParts = [
				`Room_Preferences = "${classData.Room_Preferences}"`,
				`Start_Time <= "${classData.Start_Time}"`,
				`End_Time >= "${classData.End_Time}"`,
				`Semester_ID = "${classData.Semester_ID}"`,
				daysFilter1
			].filter(part => part !== '');

			const roomPreferencesFilter = roomPreferencesFilterParts.join(' && ');

			console.log("Generated room preferences filter: ", roomPreferencesFilter);

			const roomConflict = await pb.collection("Courses").getFullList({
				filter: roomPreferencesFilter,
			});

			console.log(roomConflict);

			if (roomConflict.length > 0) {
				const error = new Error(
					"Room is booked by another class"
				);
				error.field = "Room_Preferences";
				throw error;
			}
		}

		const record = await pb.collection("Courses").create(classData);
		return record;
	} catch (error) {
		console.error("Error in createClass:", error.message);
		error.field = error.field || null;
		throw error;
	}
}

// Retrieve all classes for a given semester
const getClassesBySemester = async (semesterId) => {
	try {
		console.log("Fetching classes for semester:", semesterId);

		const records = await pb.collection("Courses").getFullList({
			filter: `semesterId = "${semesterId}"`,
		});
		console.log("Classes fetched:", records);
		return Array.isArray(records) ? records : [];
	} catch (error) {
		console.error("Error in getClassesBySemester:", error.message);
		throw error;
	}
}

// Update an existing class
const updateClass = async (classId, classData) => {
	try {
		const record = await pb.collection("Courses").update(classId, classData);
		console.log("Class updated:", record);
		return record;
	} catch (error) {
		console.error("Error in updateClass:", error.message);
		throw error;
	}
}

module.exports = { createClass, getClassesBySemester, updateClass };

//This file is used for contacting the database

const { pb } = require("./pocketbase-connection.js")

// create a new semester in the semester table
const createSemester = async (name) => {
	try {
		// Create a new record in the 'Semester' collection with the given name
		const record = await pb.collection("Semester").create({ Name: name })
		console.log("Semester created:", record)
		return record
	} catch (error) {
		console.error("Error in createSemester:", error)
		throw error
	}
}

// retrieve all the current semesters from the semester table as an array
const getAllSemesters = async () => {
	try {
		console.log("Fetching all semesters")

		// Get all records from the 'Semester' collection
		const records = await pb.collection("Semester").getFullList()
		console.log("Semesters fetched:", records)

		// Return the records as an array if it is not already, otherwise return an empty array
		return Array.isArray(records) ? records : []
	} catch (error) {
		console.error("Error in getAllSemesters:", error)
		throw error
	}
}

const deleteSemesterByID = async (semesterID) => {
	try {
		await pb.collection("Semester").delete(semesterID)
	} catch (error) {
		console.error("Error in deleting semester with id: " + semesterID)
		throw error
	}
}

const updateSemesterByID = async (semesterId, newSemesterName) => {
	try {
		await pb.collection("Semester").update(semesterId, newSemesterName)
	} catch (error) {
		console.error("Error in updating semester with id: " + semesterID)
		throw error
	}
}

module.exports = {
	createSemester,
	getAllSemesters,
	deleteSemesterByID,
	updateSemesterByID,
}

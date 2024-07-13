//This file is used for contacting the database

const { pb, authenticate } = require("./pocketbase-connection.js")

// create a new semester in the semester table
const createSemester = async (name) => {
	try {
		await authenticate()
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
		await authenticate()
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

module.exports = { createSemester, getAllSemesters }

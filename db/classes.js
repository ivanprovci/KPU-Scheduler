const { pb } = require("./pocketbase-connection.js")

// Create a new class in the Courses collection
const createClass = async (classData) => {
	try {
		console.log("Attempting to create class with data:", classData)
		const record = await pb.collection("Courses").create(classData)
		console.log("Class created:", record)
		return record
	} catch (error) {
		console.error("Error in createClass:", error.message)
		throw error
	}
}

// Retrieve all classes for a given semester
const getClassesBySemester = async (semesterId) => {
	try {
		console.log("Fetching classes for semester:", semesterId)

		const records = await pb.collection("Courses").getFullList({
			filter: `semesterId = "${semesterId}"`,
		})
		console.log("Classes fetched:", records)
		return Array.isArray(records) ? records : []
	} catch (error) {
		console.error("Error in getClassesBySemester:", error.message)
		throw error
	}
}

// Update an existing class
const updateClass = async (classId, classData) => {
	try {
		const record = await pb.collection("Courses").update(classId, classData)
		console.log("Class updated:", record)
		return record
	} catch (error) {
		console.error("Error in updateClass:", error.message)
		throw error
	}
}

module.exports = { createClass, getClassesBySemester, updateClass }

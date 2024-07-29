const { pb } = require("./pocketbase-connection.js")

const createClass = async (classData) => {
	try {
		// Check if a class with the same CRN already exists
		const existingCrnClasses = await pb.collection("Courses").getFullList({
			filter: `CRN = "${classData.CRN}"`,
		})

		if (existingCrnClasses.length > 0) {
			const error = new Error(
				"A class with this CRN already exists. Please use another CRN number."
			)
			error.field = "CRN"
			throw error
		}

		// Check if a class with the same Course and Section already exists
		const existingCourseClasses = await pb
			.collection("Courses")
			.getFullList({
				filter: `Course = "${classData.Course}" && Section = "${classData.Section}"`,
			})

		if (existingCourseClasses.length > 0) {
			const error = new Error(
				"A class with this course number and section already exists. Each class must have a unique section number."
			)
			error.field = "Section"
			throw error
		}

		const record = await pb.collection("Courses").create(classData)
		return record
	} catch (error) {
		console.error("Error in createClass:", error.message)
		error.field = error.field || null
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

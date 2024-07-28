const { pb, authenticate } = require("./pocketbase-connection.js")


const createClass = async (classData) => {
    try {
        await authenticate();

        // Check if a class with the same CRN already exists
        const existingClasses = await pb.collection("Courses").getFullList({
            filter: `CRN = "${classData.CRN}"`
        });

        if (existingClasses.length > 0) {
            const error = new Error("A class with this CRN already exists.");
            error.field = "CRN"; // Ensure this field is set
            throw error;
        }

        const record = await pb.collection("Courses").create(classData);
        return record;
    } catch (error) {
        console.error("Error in createClass:", error.message);
        error.field = error.field || null; // Ensure field is part of error
        throw error;
    }
};

// Retrieve all classes for a given semester
const getClassesBySemester = async (semesterId) => {
    try {
        await authenticate()
        console.log("Fetching classes for semester:", semesterId)

        const records = await pb.collection("Courses").getFullList({
            filter: `semesterId = "${semesterId}"`
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
        await authenticate()
        const record = await pb.collection("Courses").update(classId, classData)
        console.log("Class updated:", record)
        return record
    } catch (error) {
        console.error("Error in updateClass:", error.message)
        throw error
    }
}

module.exports = { createClass, getClassesBySemester, updateClass }

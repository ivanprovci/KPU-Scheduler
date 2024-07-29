const express = require("express")
const { createClass, getClassesBySemester, updateClass } = require("../db/classes")
const router = express.Router()

// Get all classes for a given semester
router.get("/:semesterId", async (req, res) => {
    const semesterId = req.params.semesterId;
    try {
        const classes = await getClassesBySemester(semesterId);
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching classes for semester.", error: error.message });
    }
});

// Create a new class
router.post("/", async (req, res) => {
    const classData = req.body;

    if (!classData.semesterId) {
        return res.status(400).json({ message: "Semester ID is required." });
    }

    try {
        const newClass = await createClass(classData);
        res.status(201).json({
            message: "Class was created successfully.",
            classData: newClass,
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating class.", error: error.message, field: error.field });
    }
});

// Update an existing class. This has not been used yet.
router.put("/:id", async (req, res) => {
    const classId = req.params.id;
    const classData = req.body;

    try {
        const updatedClass = await updateClass(classId, classData);
        res.status(200).json({
            message: "Class was updated successfully.",
            classData: updatedClass,
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating class.", error: error.message });
    }
});

module.exports = router

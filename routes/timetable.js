const express = require("express");
const path = require("path");
const router = express.Router();
const { pb } = require('../db/pocketbase-connection');
const { getAllSemesters} = require("../db/semester.js")

// Fetch all semesters
router.get('/api/semesters', async (req, res) => {
    try {
        console.log("Fetching semesters...");
        const semesters = await getAllSemesters();
        console.log("Semesters fetched successfully:", semesters);
        res.json(semesters);
    } catch (err) {
        console.error("Error fetching semesters:", err);
        res.status(500).send(err.message);
    }
});

// Fetch classes for a given semester
router.get('/api/classes', async (req, res) => {
    const semesterId = req.query.semesterId;
    try {
        console.log(`Fetching classes for semesterId: ${semesterId}`);
        const filter = `Semester_ID="${semesterId}"`;
        console.log(`Using filter: ${filter}`);
        const classes = await pb.collection('Courses').getFullList({
            filter: filter,
        });
        console.log("Classes fetched successfully:", classes);
        res.json(classes);
    } catch (err) {
        console.error("Error fetching classes:", err.message); 
        console.error(err.stack); 
        res.status(500).json({ error: err.message, stack: err.stack }); 
    }
});

// Delete a class by ID
router.delete('/api/classes/:id', async (req, res) => {
    const classId = req.params.id;
    try {
        console.log(`Deleting class with ID: ${classId}`);
        await pb.collection('Courses').delete(classId);
        res.json({ message: "Class deleted successfully." });
    } catch (err) {
        console.error("Error deleting class:", err.message); 
        console.error(err.stack); 
        res.status(500).json({ error: err.message, stack: err.stack }); 
    }
});

module.exports = router;

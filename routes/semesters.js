const {
	getAllSemesters,
	createSemester,
	deleteSemesterByID,
	updateSemesterByID,
	getSemesterFromId,
} = require("../db/semester.js")

const express = require("express")
const router = express.Router()


// get all semesters
router.get("/semesters", async (req, res) => {
	const allSemesters = await getAllSemesters()
	res.status(200).json(allSemesters)
})

// create a new semester
router.post("/semesters", async (req, res) => {
	const semesterName = req.body.createSemester

	if (!semesterName || semesterName.trim() === "") {
		return res
			.status(400)
			.json({ message: "Semester name cannot be empty." })
	}

	try {
		const newSemester = await createSemester(semesterName)
		res.status(200).json({
			message: "Semester was created successfully.",
			Name: newSemester.Name,
			id: newSemester.id,
		})
	} catch (error) {
		if (error.message === "Semester already exists.") {
			res.status(409).json({ message: error.message })
		} else {
			res.status(500).json({ message: "Error creating semester." })
		}
	}
})

// delete a semester
router.delete("/semesters", async (req, res) => {
	const semesterId = req.body.semesterId

	if (!semesterId || semesterId.trim() === "") {
		return res.status(400).json({ message: "Semester ID cannot be empty." })
	}

	try {
		await deleteSemesterByID(semesterId)
		res.status(200).json({
			message: "Semester was deleted successfully.",
		})
	} catch (error) {
		res.status(500).json({ message: "Error deleting semester." })
	}
})

// update semester name
router.patch("/semesters", async (req, res) => {
	const semesterId = req.body.semesterId
	const newSemesterName = req.body.newSemesterName

	if (!semesterId || semesterId.trim() === "") {
		return res.status(400).json({ message: "Semester ID cannot be empty." })
	}
	if (!newSemesterName || newSemesterName.trim() === "") {
		return res
			.status(400)
			.json({ message: "Semester name cannot be empty." })
	}

	try {
		await updateSemesterByID(semesterId, { Name: newSemesterName })
		res.status(200).json({
			message: "Semester name was updated successfully.",
		})
	} catch (error) {
		res.status(500).json({ message: "Error updating semester name." })
	}
})

router.get("/getName", async (req, res) => {
	const semesterId = req.query.semesterId
	try {
		const semesterData = await getSemesterFromId(semesterId)
		res.status(200).json(semesterData.Name)
	} catch (error) {
		res.sendStatus(500)
	}
})

module.exports = router

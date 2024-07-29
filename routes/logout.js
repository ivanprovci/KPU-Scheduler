const express = require("express")
const router = express.Router()
const { pb } = require("../db/pocketbase-connection.js")

router.get("/", (req, res) => {
	try {
		pb.authStore.clear()

		// Clear the token from cookies
		res.clearCookie("token", { httpOnly: true })
		return res.redirect("/login")
	} catch (error) {
		console.error("ERROR LOGGING OUT:", error)
		return res.status(500).send({ message: "Internal server error" })
	}
})

module.exports = router

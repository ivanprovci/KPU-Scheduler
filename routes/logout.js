const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
	try {
		// Clear the token from cookies
		res.clearCookie("token", { httpOnly: true })
		return res.redirect("/login")
	} catch (error) {
		console.error("ERROR LOGGING OUT:", error)
		return res.status(500).send({ message: "Internal server error" })
	}
})

module.exports = router

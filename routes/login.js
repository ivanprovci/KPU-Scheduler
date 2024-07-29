const express = require("express")
const router = express.Router()
const { authenticateUser } = require("../db/users.js")

// login endpoint
router.post("/", async (req, res) => {
	const { email, password } = req.body

	try {
		const auth = await authenticateUser(email, password)

		// send the requesting user a jwt token in the user's cookies
		res.cookie("token", auth.token, { httpOnly: true })
		return res.status(200).send({ message: "Login successful" })
	} catch (error) {
		res.status(400).send({ message: "Incorrect credentials" })
	}
})

router.get("/", (req, res) => {
	res.redirect("login")
})

module.exports = router

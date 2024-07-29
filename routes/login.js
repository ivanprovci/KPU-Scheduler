const express = require("express")
const router = express.Router()
const { authenticateUser } = require("../db/users.js")
const { pb } = require("../db/pocketbase-connection.js")

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

// check if the user is logged in
router.get("/check-auth", async (req, res) => {
	try {
		// Verify the token from the HttpOnly cookie
		if (pb.authStore.isValid) {
			// User is logged in
			res.status(200).send({ loggedIn: true })
		} else {
			// User is not logged in
			res.status(200).send({ loggedIn: false })
		}
	} catch (error) {
		res.status(500).send({ message: "Error checking authentication" })
	}
})

router.get("/", (req, res) => {
	res.redirect("login")
})

module.exports = router

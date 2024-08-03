const { pb } = require("../db/pocketbase-connection.js")

// Middleware to authenticate requests
const authenticateToken = (req, res, next) => {
	const token = req.cookies.token // Extract the token from the cookies

	if (!token) {
		return res.status(401).render("401")
	}

	try {
		// Load the token into PocketBase auth store to validate it
		pb.authStore.save(token, null)

		if (!pb.authStore.isValid) {
			return res.status(401).render("401")
		}

		// Optionally, you can fetch the user information
		const user = pb.authStore.model
		req.user = user // Attach the user info to the request object

		next()
	} catch (error) {
		console.error("Token verification failed:", error)
		return res.status(500).send({ message: "Failed to authenticate token" })
	}
}

module.exports = authenticateToken

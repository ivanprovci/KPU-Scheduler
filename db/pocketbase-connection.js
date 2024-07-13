const PocketBase = require("pocketbase/cjs")

const pb = new PocketBase("http://127.0.0.1:8090")

// PocketBase admin credentials
const SECRET_EMAIL = "TestAdmin@gmail.com"
const SECRET_PASSWORD = "abc123123123"

// Function to authenticate with PocketBase using admin credentials
const authenticate = async () => {
	console.log("Authenticating...")
	try {
		const authData = await pb.admins.authWithPassword(
			SECRET_EMAIL,
			SECRET_PASSWORD
		)
		console.log("Authenticated:", authData)
	} catch (error) {
		console.error("Authentication error:", error)
		throw error
	}
}

module.exports = {
	pb,
	authenticate,
}

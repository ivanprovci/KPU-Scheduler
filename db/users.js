const { pb } = require("./pocketbase-connection.js")

const authenticateUser = async (email, password) => {
	return await pb.collection("users").authWithPassword(email, password)
}

module.exports = {
	authenticateUser,
}

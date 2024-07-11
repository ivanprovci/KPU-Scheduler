const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
	res.redirect("login")
})

//Handle login form submission
router.post("/", async (req, res) => {
    const { email, password } = req.body;

    try {
        const authData = await pb.collection('users').authWithPassword(email, password);
        // Set user session or token as needed, example:
        req.session.user = authData.user;

        res.status(200).send({ message: 'Login successful' });
    } catch (error) {
        res.status(401).send({ message: 'Invalid email or password' });
    }
});
module.exports = router

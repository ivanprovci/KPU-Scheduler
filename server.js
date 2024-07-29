const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const authenticateToken = require("./middleware/authMiddleware.js")
const app = express()
const port = 3000

// Define where all your static files are (in this case, the public folder)
app.use(
	express.static("public", {
		// when a user types the url into the search bar with no file extension at the end,
		// append '.html' to the end of the url to serve the html file for that route
		//
		// website.com/products.html    will work without the 'extensions' option below
		// website.com/products         will NOT work without the extensions option below

		extensions: ["html", "htm"],
	})
)

// Serve static files from the "db" directory.
app.use("/db", express.static(path.join(__dirname, "db")))

// Middleware for getting data from forms
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// middleware for processing cookies sent in the request header
app.use(cookieParser())

// EJS setup
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "pages"))

// Routes
const classesRouter = require("./routes/classes")
const semestersRouter = require("./routes/semesters")
const timetableRouter = require("./routes/timetable")
const loginRouter = require("./routes/login")
const logoutRouter = require("./routes/logout")

// add authenticateToken middleware to all routes, except login. so everytime the request will go through the middleware first
// if the user has a valid token, it will allow them to continue to the other pages and interact w the database (semesters, classes, etc)
app.use("/classes", authenticateToken, classesRouter)
app.use("/semesters", authenticateToken, semestersRouter)
app.use("/timetable", authenticateToken, timetableRouter)
app.use("/login", loginRouter)
app.use("/logout", logoutRouter)

// The 404 (error) Route (ALWAYS Keep this as the last route)
app.get("*", (req, res) => {
	res.status(404).render("404")
})

app.listen(port, () => {
	console.log(`http://localhost:${port}`)
})

const express = require("express")
const app = express()
const port = 3000

// define where all your static files are (in this case, the public folder)
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

// middleware for getting data from forms
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// ejs setup
app.set("view engine", "ejs")
app.set("views", __dirname + "/pages")

// routes
const classesRouter = require("./routes/classes")
const semestersRouter = require("./routes/semesters")
const timetableRouter = require("./routes/timetable")
const loginRouter = require("./routes/login")
app.use("/classes", classesRouter)
app.use("/semesters", semestersRouter)
app.use("/timetable", timetableRouter)
app.use("/login", loginRouter)

// The 404 (error) Route (ALWAYS Keep this as the last route)
app.get("*", (req, res) => {
	res.status(404).render("404")
})

app.listen(port, () => console.log(`http://localhost:${port}`))

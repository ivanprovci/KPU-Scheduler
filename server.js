const express = require("express");
const { spawn } = require("child_process")
const path = require("path");
const { authenticate } = require("./db/pocketbase-connection");
const app = express();
const port = 3000;

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
);

// Serve static files from the "db" directory.
app.use("/db", express.static(path.join(__dirname, "db")));

// Middleware for getting data from forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "pages"));

// Routes
const authMiddleware = require('./middleware/authMiddleware'); // for auth middleware
const classesRouter = require("./routes/classes");
const semestersRouter = require("./routes/semesters");
const timetableRouter = require("./routes/timetable");
const loginRouter = require("./routes/login");
const authRouter = require('./routes/auth');

// add authmiddleware to all route. so everytime the request will go through the middleware first
// if the user got the token, it will keep going to the class or etc.
app.use("/api/auth", authRouter);
app.use("/classes", authMiddleware, classesRouter);
app.use("/semesters", authMiddleware, semestersRouter);
app.use("/timetable", authMiddleware, timetableRouter);
app.use("/login", loginRouter);

// The 404 (error) Route (ALWAYS Keep this as the last route)
app.get("*", (req, res) => {
    res.status(404).render("404");
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});

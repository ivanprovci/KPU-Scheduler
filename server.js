const express = require("express")
const {spawn} = require("child_process")
const path = require("path")
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

// Serve static files from the "db" directory.
app.use('/db', express.static(path.join(__dirname, 'db')));

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

app.listen(port, () => {
	console.log(`http://localhost:${port}`);
	startPocketBase();
});


//Function to start pocket base!
function startPocketBase() {
    const pocketBasePath = path.join(__dirname, "pocketbase.exe");
    const pocketBaseProcess = spawn(pocketBasePath);

    pocketBaseProcess.stdout.on("data", (data) => {
        console.log(`PocketBase stdout: ${data}`);
    });

    pocketBaseProcess.stderr.on("data", (data) => {
        console.error(`PocketBase stderr: ${data}`);
    });

    pocketBaseProcess.on("close", (code) => {
        if (code === 0) {
            console.log("PocketBase started successfully");
        } else {
            console.error(`PocketBase failed to start with code ${code}`);
        }
    });
}
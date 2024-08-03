document.addEventListener("DOMContentLoaded", async () => {
	const nav = document.querySelector("#navbarNavAltMarkup .navbar-nav")
	const response = await fetch("http://localhost:3000/login/check-auth")
	const data = await response.json()

	// User is logged in, add semester, timetable, logout links to nav
	if (data.loggedIn) {
		const links = [
			{ href: "semesters", text: "Semesters" },
			{ href: "timetable", text: "Timetable" },
			{ href: "logout", text: "Logout" },
		]

		links.forEach((linkData) => {
			const a = document.createElement("a")
			a.className = "nav-item nav-link text-white"
			a.href = linkData.href
			a.textContent = linkData.text
			nav.appendChild(a)
		})
	} else {
		// User is not logged in, so add login link to nav
		const a = document.createElement("a")
		a.className = "nav-item nav-link text-white"
		a.href = "login"
		a.textContent = "Login"
		nav.appendChild(a)
	}
})

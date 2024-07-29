document.addEventListener("DOMContentLoaded", function () {
	document
		.getElementById("login-form")
		.addEventListener("submit", async (e) => {
			e.preventDefault()
			const email = document.getElementById("email").value
			const password = document.getElementById("password").value

			const login = await fetch("http://localhost:3000/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email: email, password: password }),
			})

			// display error message if response is not 200, otherwise redirect the user
			if (!login.ok) {
				const errorMessageContainer =
					document.querySelector("#errorContainer")
				errorMessageContainer.classList.remove("hidden")
			} else {
				window.location.href = "/"
			}
		})
})

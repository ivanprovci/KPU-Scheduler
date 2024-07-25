document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: email, password: password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            // Redirect to the protected timetable page
            window.location.href = '/timetable';
        } else {
            alert(data.message);
        }
    });
});

document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    const errorMessage = document.getElementById('error-message');

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
00
        const data = await response.json();
        
        if (response.ok) {
            alert(data.message);
            window.location.href = 'index'; // Redirect to the homepage or dashboard
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.style.color = 'red';
    }
});

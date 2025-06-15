document.getElementById('user-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    const full_name = document.getElementById('full_name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const url = 'http://localhost:3000/signup';
    const data = { full_name, email, password };

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        const message = document.getElementById('login-message');
        message.style.color = data.success ? 'green' : 'red';
        message.textContent = data.message;
        if (data.success) {
            // Optionally clear the form or redirect after a delay
            setTimeout(() => {
                document.getElementById('user-form').reset();
                window.location.href = 'login.html';
            }, 1000);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('login-message').textContent = 'Error signing up. Please try again.';
    });
});
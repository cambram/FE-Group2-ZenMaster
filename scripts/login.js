window.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('https://be-group2-zenmaster.onrender.com/auth/check-session', {
        method: 'GET',
        credentials: 'include',  // This is important to send cookies with the request
    });

    const data = await response.json();

    // If the user is already logged in, redirect to the home page
    if (data.loggedIn) {
        window.location.href = 'home.html';
    }
});

const usernameInputTag = document.getElementById('username');
const passwordInputTag = document.getElementById('password');

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username == null || password == null || username == "" || password == "") {
        incorrectLoginCSS();
    } else {
        const response = await fetch('https://be-group2-zenmaster.onrender.com/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include' // Ensures cookies (session cookie) are included
        });

        if (response.ok) {
            window.location.href = 'home.html'; // Redirect to home page after successful login
        } else {
            const data = await response.json();
            incorrectLoginCSS()
            //alert('Login failed: ' + data.message);
        }
    }
});

function incorrectLoginCSS() {
    usernameInputTag.style.border = '2px solid #da3d3d';
    passwordInputTag.style.border = '2px solid #da3d3d';
    usernameInputTag.value = '';
    passwordInputTag.value = '';
}
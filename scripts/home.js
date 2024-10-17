document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('https://be-group2-zenmaster.onrender.com/auth/auth-status', {
        method: 'GET',
        credentials: 'include' // Send session cookie with the request
    });

    const data = await response.json();

    if (data.loggedIn) {
        document.getElementById('username').textContent = `Hello, ${data.username}!`;

        // Fetch the user's achievements from MongoDB
        const userAchievementsResponse = await fetch('https://be-group2-zenmaster.onrender.com/achievements', {
            method: 'GET',
            credentials: 'include'
        });

        const userAchievements = await userAchievementsResponse.json();
        document.getElementById('achievement-count').textContent = `${userAchievements.length}/10`;
    } else {
        window.location.href = 'index.html'; // Redirect to login if not logged in
    }
});

document.getElementById('logout-btn').addEventListener('click', async () => {
    const response = await fetch('https://be-group2-zenmaster.onrender.com/auth/logout', {
        method: 'POST',
        credentials: 'include', // Send session cookie with the request
    });

    if (response.ok) {
        window.location.href = 'index.html'; // Redirect to login after successful logout
    } else {
        alert('Logout failed. Please try again.');
    }
});

document.getElementById('btn-start-five-senses').addEventListener('click', async () => {
    window.location.href = 'mindful-activities/five-senses.html';
});

document.getElementById('btn-start-mindful-meditation').addEventListener('click', async () => {
    window.location.href = 'mindful-activities/mindful-meditation.html';
});

document.getElementById('btn-start-body-scan').addEventListener('click', async () => {
    window.location.href = 'mindful-activities/body-scan.html';
});
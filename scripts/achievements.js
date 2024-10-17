const achievementsCards = [
    { id: 'ach_001', achievement: `<div class="achievement-item" id="ach_001"><img src="images/mindful-beginnings.png" alt="mindful-beginnings"><p class="achievement-description">Complete your first Mindful Meditation session.</p></div>` },
    { id: 'ach_002', achievement: `<div class="achievement-item" id="ach_002"><img src="images/body-awareness.png" alt="body-awareness"><p class="achievement-description">Perform your first Body Scan exercise.</p></div>` },
    { id: 'ach_003', achievement: `<div class="achievement-item" id="ach_003"><img src="images/calm-continuity.png" alt="calm-continuity"><p class="achievement-description">Perform a Mindful Meditation session each day for 3 consecutive days.</p></div>` },
    { id: 'ach_004', achievement: `<div class="achievement-item" id="ach_004"><img src="images/commited-scanner.png" alt="commited-scanner"><p class="achievement-description">Perform a Body Scan session each day for 3 consecutive days.</p></div>` },
    { id: 'ach_005', achievement: `<div class="achievement-item" id="ach_005"><img src="images/deep-dive.png" alt="deep-dive"><p class="achievement-description">Perform a Mindful Meditation session for at least 15 minutes.</p></div>` },
    { id: 'ach_006', achievement: `<div class="achievement-item" id="ach_006"><img src="images/fully-aware.png" alt="fully-aware"><p class="achievement-description">Complete your first Five Senses exercise.</p></div>` },
    { id: 'ach_007', achievement: `<div class="achievement-item" id="ach_007"><img src="images/mind-body-connection.png" alt="mind-body-connection"><p class="achievement-description">Perform a Body Scan exercise for at least 10 minutes.</p></div>` },
    { id: 'ach_008', achievement: `<div class="achievement-item" id="ach_008"><img src="images/mindful-week.png" alt="mindful-week"><p class="achievement-description">Perform at least 1 of any mindful exercise each day for 7 consecutive days.</p></div>` },
    { id: 'ach_009', achievement: `<div class="achievement-item" id="ach_009"><img src="images/senses-in-sync.png" alt="senses-in-sync"><p class="achievement-description">Perform a Five Senses session each day for 3 consecutive days.</p></div>` },
    { id: 'ach_010', achievement: `<div class="achievement-item" id="ach_010"><img src="images/week-of-balance.png" alt="week-of-balance"><p class="achievement-description">Complete all three exercises within the same week.</p></div>` }
];

const achievementsContainer = document.getElementById('achievements-card-layout');
let achievementsHTML = '';

const awardAchievements = async () => {
    const response = await fetch('https://be-group2-zenmaster.onrender.com/achievements/award-achievements', {
        method: 'POST',
        credentials: 'include'
    });

    const data = await response.json();
    if (data.achievementsAwarded.length > 0) {
        console.log('New achievements awarded:', data.achievementsAwarded);
        // Update the UI to reflect newly awarded achievements
    }
};


// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('https://be-group2-zenmaster.onrender.com/auth/auth-status', {
        method: 'GET',
        credentials: 'include'
    });

    const data = await response.json();

    if (data.loggedIn) {
        //Check for new achievements based on exercises
        awardAchievements();

        // Build the achievements HTML
        achievementsCards.forEach(element => {
            achievementsHTML += element.achievement;
        });
        achievementsContainer.innerHTML = achievementsHTML;

        // Fetch the user's achievements from MongoDB
        const userAchievementsResponse = await fetch('https://be-group2-zenmaster.onrender.com/achievements', {
            method: 'GET',
            credentials: 'include'
        });

        const userAchievements = await userAchievementsResponse.json();

        // Grayscale logic
        achievementsCards.forEach(card => {
            const achievementElement = document.getElementById(card.id);
            const isAchieved = userAchievements.some(achievement => achievement.achievement_id === card.id);

            if (!isAchieved) {
                // User has not earned this achievement, so apply grayscale
                achievementElement.classList.add('toggle-grayscale');
            }
        });
    } else {
        window.location.href = 'index.html';
    }
});

// Logout logic
document.getElementById('logout-btn').addEventListener('click', async () => {
    const response = await fetch('https://be-group2-zenmaster.onrender.com/auth/logout', {
        method: 'POST',
        credentials: 'include',
    });

    if (response.ok) {
        window.location.href = 'index.html';
    } else {
        alert('Logout failed. Please try again.');
    }
});

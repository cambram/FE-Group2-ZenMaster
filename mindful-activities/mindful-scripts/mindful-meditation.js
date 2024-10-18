document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('https://be-group2-zenmaster.onrender.com/auth/auth-status', {
        method: 'GET',
        credentials: 'include' // Send session cookie with the request
    });

    const data = await response.json();

    if (!data.loggedIn) {
        window.location.href = '../home.html'; // Redirect to login if not logged in
    }

    checkMeditationStatus();
});

const backArrow = document.getElementById('back-arrow');
const continueButton = document.getElementById('btn-continue-mindful-meditation');
const pleaseWait = document.getElementById('please-wait');
const fiveMinutesButton = document.getElementById('btn-begin-mindful-meditation-5min');
const fifteenMinutesButton = document.getElementById('btn-begin-mindful-meditation-15min');
const initialInstructionContainer = document.getElementById('initial-instruction-container');
const timeDisplay = document.getElementById('time-display');
const exerciseInstructions = document.getElementById('mindful-meditation-instructions');
const exerciseHeading = document.getElementById('exercise-heading');
timeDisplay.style.display = 'none';

let endAudio = new Audio("./audio/end-exercise.mp3");
let startAudio = new Audio("./audio/start-exercise.mp3");

let startTime;
let duration;

// Hide the continue button initially
continueButton.style.display = 'none';
pleaseWait.style.display = 'none';

// Helper function to format time (optional, for console logging)
function formatTime(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`; // `${minutes}m ${seconds}s`
}

// Cancel the meditation session
function cancelMeditationSession() {
    console.log('Meditation session cancelled');
    // Clear localStorage related to the session
    localStorage.removeItem('meditationStartTime');
    localStorage.removeItem('meditationDuration');
    // Hide the continue button
    continueButton.style.display = 'none';
    // Reset the time display to the default
    timeDisplay.textContent = '00:00';
}

async function logExerciseInDB() {
    const durationOfSession = localStorage.getItem('meditationDuration') / 60000;
    const exerciseData = {
        exercise_name: 'Mindful Meditation',
        date_completed: new Date(), // Current date and time
        session_duration: durationOfSession
    };

    try {
        const response = await fetch('https://be-group2-zenmaster.onrender.com/exercises/complete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Send session cookie with the request
            body: JSON.stringify(exerciseData)
        });

        if (response.ok) {
            console.log('Exercise successfully logged');
            pleaseWait.style.display = 'none';
            continueButton.style.display = 'inline-block';
        } else {
            console.error('Failed to log exercise');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Start the meditation and store the start time in localStorage
function startMeditation(durationInMinutes) {
    startAudio.play();

    const startTime = Date.now(); // Get the current time (in ms)
    const durationInMilliseconds = durationInMinutes * 60000;

    // Store start time and duration in localStorage
    localStorage.setItem('meditationStartTime', startTime);
    localStorage.setItem('meditationDuration', durationInMilliseconds);

    // Button visibility
    fiveMinutesButton.style.display = 'none';
    fifteenMinutesButton.style.display = 'none';
    initialInstructionContainer.style.display = 'none';
    timeDisplay.style.display = 'block';
    exerciseInstructions.innerHTML = '<p>Gently close your eyes and focus on your breath...<br>The rising and falling of your chest</p>';

    checkMeditationStatus(); // Immediately check status
}

// Check meditation status by comparing current time with stored start time
function checkMeditationStatus() {
    startTime = localStorage.getItem('meditationStartTime');
    duration = localStorage.getItem('meditationDuration');

    if (startTime && duration) {
        const elapsedTime = Date.now() - parseInt(startTime);

        // If the session is COMPLETE
        if (elapsedTime >= parseInt(duration)) {
            pleaseWait.style.display = 'inline-block';
            exerciseInstructions.innerHTML = '<p class="instructional-statement"><b>Congratulations!!</b><br>You have successfully completed this exercise</p>';
            exerciseHeading.style.marginTop = '60px';

            logExerciseInDB(); // log the exercise in the DB
            endAudio.play();

            // Show the continue button
            backArrow.style.display = 'none';
            localStorage.removeItem('meditationStartTime'); // Clear local storage
            localStorage.removeItem('meditationDuration');
            timeDisplay.textContent = "00:00";
        } else {
            // Session is still ongoing
            const remainingTime = parseInt(duration) - elapsedTime; // Calculate remaining time
            timeDisplay.textContent = formatTime(remainingTime); // Update the time display dynamically

            // Check again after 1 second
            setTimeout(() => {
                checkMeditationStatus();
            }, 1000);
        }
    }
}

// Event listener to go back to home screen
backArrow.addEventListener('click', () => {
    cancelMeditationSession()
    window.location.href = '../home.html';
});

// Event listener for continuing past the completion screen
continueButton.addEventListener('click', async () => {
    window.location.href = '../home.html';
});

// Event listener for 5-minute meditation session
fiveMinutesButton.addEventListener('click', () => {
    startMeditation(5); //change to 5
});

// Event listener for 15-minute meditation session
fifteenMinutesButton.addEventListener('click', () => {
    startMeditation(15);
});

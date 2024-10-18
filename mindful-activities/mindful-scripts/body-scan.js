document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('https://be-group2-zenmaster.onrender.com/auth/auth-status', {
        method: 'GET',
        credentials: 'include' // Send session cookie with the request
    });

    const data = await response.json();

    if (!data.loggedIn) {
        window.location.href = '../home.html'; // Redirect to login if not logged in
    }

    checkBodyScanStatus(); // Check the body scan status on load
});

const backArrow = document.getElementById('back-arrow');
const continueButton = document.getElementById('btn-continue-body-scan');
const pleaseWait = document.getElementById('please-wait');
const threeMinutesButton = document.getElementById('btn-begin-body-scan-3min');
const tenMinutesButton = document.getElementById('btn-begin-body-scan-10min');
const initialInstructionContainer = document.getElementById('initial-instruction-container');
const timeDisplay = document.getElementById('time-display');
const exerciseInstructions = document.getElementById('body-scan-instructions');
const exerciseHeading = document.getElementById('exercise-heading');
timeDisplay.style.display = 'none';

let startTime;
let duration;

let endAudio = new Audio("./audio/end-exercise.mp3");
let startAudio = new Audio("./audio/start-exercise.mp3");

// Hide the continue button initially
continueButton.style.display = 'none';
pleaseWait.style.display = 'none';

// Helper function to format time (optional, for console logging)
function formatTime(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`; // `${minutes}m ${seconds}s`
}

// Cancel the body scan session
function cancelBodyScanSession() {
    console.log('Body scan session cancelled');
    // Clear localStorage related to the session
    localStorage.removeItem('bodyScanStartTime');
    localStorage.removeItem('bodyScanDuration');
    // Hide the continue button
    continueButton.style.display = 'none';
    // Reset the time display to the default or blank
    timeDisplay.textContent = '00:00';
}

async function logExerciseInDB() {
    const durationOfSession = localStorage.getItem('bodyScanDuration') / 60000;
    const exerciseData = {
        exercise_name: 'Body Scan',
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

// Start the Body scan and store the start time in localStorage
function startBodyScan(durationInMinutes) {
    const startTime = Date.now(); // Get the current time (in ms)
    const durationInMilliseconds = durationInMinutes * 60000;

    // Store start time and duration in localStorage
    localStorage.setItem('bodyScanStartTime', startTime);
    localStorage.setItem('bodyScanDuration', durationInMilliseconds);

    startAudio.play();

    // Button visibility
    threeMinutesButton.style.display = 'none';
    tenMinutesButton.style.display = 'none';
    initialInstructionContainer.style.display = 'none';
    timeDisplay.style.display = 'block';
    exerciseInstructions.innerHTML = '<p>Focus on your breath...<br>And bring awareness to how your body feels</p>';

    checkBodyScanStatus(); // Immediately check status
}

// Check Body scan status by comparing current time with stored start time
function checkBodyScanStatus() {
    startTime = localStorage.getItem('bodyScanStartTime');
    duration = localStorage.getItem('bodyScanDuration');

    if (startTime && duration) {
        const elapsedTime = Date.now() - parseInt(startTime);
        //console.log(`Elapsed time: ${formatTime(elapsedTime)}`);

        // If the session is COMPLETE
        if (elapsedTime >= parseInt(duration)) {
            pleaseWait.style.display = 'inline-block';
            exerciseInstructions.innerHTML = '<p class="instructional-statement"><b>Congratulations!!</b><br>You have successfully completed this exercise</p>';
            exerciseHeading.style.marginTop = '60px';

            logExerciseInDB();
            endAudio.play();

            // Show the continue button
            backArrow.style.display = 'none';
            localStorage.removeItem('bodyScanStartTime'); // Clear local storage
            localStorage.removeItem('bodyScanDuration');
            timeDisplay.textContent = "00:00"; // Update time display to 0:00 (or any other format for completion)
        } else {
            // Session is still ongoing
            //console.log('Body scan session is still ongoing');
            const remainingTime = parseInt(duration) - elapsedTime; // Calculate remaining time
            timeDisplay.textContent = formatTime(remainingTime); // Update the time display dynamically

            // Check again after 1 second
            setTimeout(() => {
                checkBodyScanStatus();
            }, 1000);
        }
    }
}

// Event listener to go back to home screen
backArrow.addEventListener('click', () => {
    cancelBodyScanSession()
    window.location.href = '../home.html';
});

// Event listener for continuing past the completion screen
continueButton.addEventListener('click', () => {
    // Add code to add achievement
    window.location.href = '../home.html';
});

// Event listener for 5-minute Body scan session
threeMinutesButton.addEventListener('click', () => {
    startBodyScan(3);
});

// Event listener for 15-minute Body scan session
tenMinutesButton.addEventListener('click', () => {
    startBodyScan(10);
});

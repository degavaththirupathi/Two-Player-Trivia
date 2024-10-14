console.log("end.js loaded");

const inpUser = document.getElementById("username");
const btnSaveScore = document.getElementById("save-score");
const player1ScoreElement = document.getElementById("player1-score");
const player2ScoreElement = document.getElementById("player2-score");
const player1NameElement = document.getElementById("player1-name");
const player2NameElement = document.getElementById("player2-name");
const winnerElement = document.getElementById("winner");
const notification = document.getElementById("notification"); // Notification element

// Retrieve player names and scores from localStorage
const player1 = localStorage.getItem('player1');
const player2 = localStorage.getItem('player2');
const scorePlayer1 = localStorage.getItem('scorePlayer1') || 0;
const scorePlayer2 = localStorage.getItem('scorePlayer2') || 0;

// Display player names and scores
player1NameElement.innerText = player1;
player2NameElement.innerText = player2;
player1ScoreElement.innerText = scorePlayer1;
player2ScoreElement.innerText = scorePlayer2;

// Determine the winner
let winnerText;
let notificationMessage;
if (scorePlayer1 > scorePlayer2) {
    winnerText = `${player1} Wins!`;
    notificationMessage = `${player1} has won with a score of ${scorePlayer1}`;
} else if (scorePlayer2 > scorePlayer1) {
    winnerText = `${player2} Wins!`;
    notificationMessage = `${player2} has won with a score of ${scorePlayer2}`;
} else {
    winnerText = `It's a Tie!`;
    notificationMessage = `It's a tie with both players scoring equally.`;
}
winnerElement.innerText = winnerText;

// Display the notification message
showNotification(notificationMessage);

// Enable the Save button when username is typed
username.addEventListener("keyup", () => {
    btnSaveScore.disabled = !username.value;
});

saveHighScore = e => {
    e.preventDefault();

    const score = {
        score: Math.max(scorePlayer1, scorePlayer2),
        name: username.value,
    };

    let HIGH_SCORES = JSON.parse(localStorage.getItem("high-scores")) || [];
    const MAX_HIGH_SCORES = 5;

    HIGH_SCORES.push(score);

    HIGH_SCORES.sort((a, b) => b.score - a.score);
    HIGH_SCORES.splice(MAX_HIGH_SCORES);

    localStorage.setItem("high-scores", JSON.stringify(HIGH_SCORES));
    window.location.href = "../index.html";
};

// Handle the Play Again button to pass player names
document.getElementById('play-again-btn').addEventListener('click', () => {
    window.location.href = `../pages/game.html?player1=${player1}&player2=${player2}`;
});

// Function to show notification
function showNotification(message) {
    notification.innerText = message;
    notification.classList.add("show");

    setTimeout(() => {
        notification.classList.remove("show");
    }, 5000); // Hide after 5 seconds
}

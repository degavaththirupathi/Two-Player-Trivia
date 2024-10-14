// script for handling form and navigation
document.getElementById('start-game').addEventListener('click', function(event) {
    event.preventDefault();

    const player1 = document.getElementById('player1').value;
    const player2 = document.getElementById('player2').value;

    if (player1.trim() && player2.trim()) {
        const gameUrl = `../pages/game.html?player1=${encodeURIComponent(player1)}&player2=${encodeURIComponent(player2)}`;
        window.location.href = gameUrl;
    } else {
        alert("Please enter names for both players.");
    }
});

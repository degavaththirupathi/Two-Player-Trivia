console.log("game.js loaded");

// DOM Elements
const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const txtScore = document.getElementById("score");
const txtProgress = document.getElementById("progress-text");
const elProgressFill = document.getElementById("progress-fill");
const elLoader = document.getElementById("loader");
const elGame = document.getElementById("game");

// Constants
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 6; // 6 questions: 2 easy, 2 medium, 2 hard
const FEEDBACK_DELAY = 500; 

// Variables
let currentQuestion = {};
let acceptingAnswers = false;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];

// Get players from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const player1 = urlParams.get('player1');
const player2 = urlParams.get('player2');

// Store player names in localStorage for reuse
localStorage.setItem('player1', player1);
localStorage.setItem('player2', player2);

// Initialize scores
let scorePlayer1 = 0;
let scorePlayer2 = 0;
let currentPlayerTurn = player1;

// Fetch questions from Trivia API
fetch(`https://the-trivia-api.com/v2/questions?limit=${MAX_QUESTIONS}`).then(res => {
    return res.json();
}).then(loadedQuestions => {
    
    questions = loadedQuestions.map(loadedQuestion => {
        const formattedQuestion = {
            question: loadedQuestion.question.text
        };
        const answerChoices = [...loadedQuestion.incorrectAnswers];
        formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
        answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correctAnswer);

        answerChoices.forEach((choice, index) => {
            formattedQuestion["choice" + (index + 1)] = choice;
        });

        return formattedQuestion;
    });

    startGame();
});

startGame = () => {
    questionCounter = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    elGame.classList.remove('hidden');
    elLoader.classList.add('hidden');
}

getNewQuestion = () => {
    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('scorePlayer1', scorePlayer1);
        localStorage.setItem('scorePlayer2', scorePlayer2);
        return window.location.href = `../pages/end.html`;
    }

    questionCounter++;
    txtProgress.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    elProgressFill.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    
    question.innerHTML = `${currentPlayerTurn}'s turn: ${currentQuestion.question}`;

    choices.forEach(choice => {
        const option_id = choice.dataset['oid'];
        choice.innerText = currentQuestion["choice" + option_id];
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
}

choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if (!acceptingAnswers) return;
        acceptingAnswers = false;

        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["oid"];
        const isCorrect = selectedAnswer == currentQuestion.answer;

        if (isCorrect) {
            if (currentPlayerTurn === player1) {
                scorePlayer1 += CORRECT_BONUS;
            } else {
                scorePlayer2 += CORRECT_BONUS;
            }
        }

        setTimeout(() => {
            toggleTurn();
            getNewQuestion();
        }, FEEDBACK_DELAY);
    });
});

// Function to toggle between player turns
function toggleTurn() {
    currentPlayerTurn = currentPlayerTurn === player1 ? player2 : player1;
}

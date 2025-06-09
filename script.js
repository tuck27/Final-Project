const wordDisplay = document.querySelector(".word-display");
const keyboardDiv = document.querySelector(".keyboard");
const guessesText = document.querySelector(".guesses-text b");
const wrongLettersDisplay = document.querySelector("#wrong-letters-list");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = document.querySelector(".play-again");
const timerDisplay = document.querySelector(".timer");
const gameContainer = document.querySelector(".game-container");

const codingQuiz = [
    { word: "variable", hint: "A placeholder for a value." },
    { word: "function", hint: "A block of code that performs a specific task." },
    { word: "loop", hint: "Repeats a sequence of instructions." },
    { word: "array", hint: "A collection of elements." },
    { word: "boolean", hint: "True or false value." },
    { word: "conditional", hint: "Executes code based on a condition." },
    { word: "parameter", hint: "A variable in a method definition." },
    { word: "algorithm", hint: "A step-by-step procedure." },
    { word: "debugging", hint: "Finding and fixing code errors." },
    { word: "syntax", hint: "Rules of a programming language." }
];

let currentWord, correctLetters, wrongLetters, wrongGuessCount, timerInterval;

const maxGuesses = 6;

const gameTimeLimit = 30;

const resetGame = () => {
    correctLetters = [];
    wrongLetters = [];
    wrongGuessCount = 0;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    wrongLettersDisplay.innerText = "";
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    clearInterval(timerInterval);
    startTimer();
    gameModal.classList.remove("show");
};

const getRandomWord = () => {
    const { word, hint } = codingQuiz[Math.floor(Math.random() * codingQuiz.length)];
    currentWord = word;
    document.querySelector(".hint-text b").innerText = hint;
    resetGame();
};

const startTimer = () => {
    let timeLeft = gameTimeLimit;
    timerDisplay.innerText = `Time left: 0:${timeLeft < 10 ? "0" : ""}${timeLeft}`;
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = `Time left: 0:${timeLeft < 10 ? "0" : ""}${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            gameOver(false);
        }
    }, 1000);
};

const gameOver = (isVictory) => {
    setTimeout(() => {
        clearInterval(timerInterval);
        const modalText = isVictory ? `Yay! You found the word:` : `You Lost! The correct word was:`;
        gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
        gameModal.classList.add("show");
    }, 300);
};

const initGame = (button, clickedLetter) => {
    button.disabled = true;
    if (currentWord.includes(clickedLetter)) {
        [...currentWord].forEach((letter, index) => {
            if (letter === clickedLetter) {
                if (!correctLetters.includes(letter)) {
                    correctLetters.push(letter);
                }
                const letterEls = wordDisplay.querySelectorAll("li");
                letterEls[index].innerText = letter;
                letterEls[index].classList.add("guessed");
            }
        });
    } else {
        wrongGuessCount++;
        if (!wrongLetters.includes(clickedLetter)) {
            wrongLetters.push(clickedLetter);
            wrongLettersDisplay.innerText = wrongLetters.join(", ");
        }
        guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
        // Shake animation
        gameContainer.classList.add("shake");
        setTimeout(() => gameContainer.classList.remove("shake"), 400);
    }
    // Loss
    if (wrongGuessCount === maxGuesses) return gameOver(false);
    // Win check using Set
    const uniqueLetters = new Set(currentWord);
    const guessedLettersSet = new Set(correctLetters);
    if ([...uniqueLetters].every(l => guessedLettersSet.has(l))) return gameOver(true);
};

// Generate keyboard
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", (e) => {
        initGame(e.target, String.fromCharCode(i));
    });
}
getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);
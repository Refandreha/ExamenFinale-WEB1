/**
 * Point culture (en Français car je suis un peu obligé): 
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces. 
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 * 
 * Sur ce... Amusez-vous bien ! 
 */
let startTime = null, previousEndTime = null;
let currentWordIndex = 0;
const wordsToType = [];
let timeLeft = 60;
let countdownInterval;

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const timerDisplay = document.getElementById("timer");
const results = document.getElementById("results");
const wpm_html = document.getElementById("wpm");
const accuracy_html = document.getElementById("accuracy");
const correct = document.getElementById("correct");
const incorrect = document.getElementById("incorrect");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");

const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception"]
};

// Generate a random word from the selected mode
const getRandomWord = (mode) => {
    const wordList = words[mode];
    return wordList[Math.floor(Math.random() * wordList.length)];
};

//
function generateWords(count, mode) {
    const generateWords = [];
    for (let i = 0; i < count; i++) {
        generateWords.push(getRandomWord(mode));
    }
    return generateWords;
}
//

// Highlight the current word
const highlightNextWord = () => {
    const wordElements = wordDisplay.children;
    if (currentWordIndex < wordElements.length) {
            wordElements[currentWordIndex].classList.add("current-highlight");
            previousEndTime = currentWordIndex;
        }
    if (previousEndTime > 0) {
        if (previousEndTime !== null && wordElements[previousEndTime]) {
            wordElements[previousEndTime].classList.remove("current-highlight");
    }
    }
};

// Move to the next word and update stats only on spacebar press
const updateWord = (event) => {
    wordDisplay.innerHTML = "";
    currentWords.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        wordDisplay.appendChild(span);
        let wordCorrect = 0;
        if (typedWords[index] && typedWords[index === word]) {
            typedWords.style.color = "yellow";
            wordCorrect++;
            correct.textContent = wordCorrect
        } else if (typedWords[index]) {
            span.classList.add("incorrect");
        }
        wordDisplay.appendChild(span);
    });
    highlightNextWord();
}
//calculate accuracy
function calculateAccuracy() {
    let correctCount = 0;
    for (let i = 0; i < typedWords.length && i < currentWords.length; i++) {
        if (typedWords[i] === currentWordIndex[i]) {
            correctCount++;
        }
    }
    return currentWords.length > 0 ? Math.round((correctCount / currentWords.length) * 100) : 0;
}
function updateResults() {
    const accuracy = calculateAccuracy();
    accuracy_html.textContent = `${accuracy}%`;
}

//
// Initialize the typing test
const startTest = () => {
    start = true;
    currentWords = generateWords(10, modeSelect.value);
    typedWords = [];
    updateWord();
    inputField.value = "";
    inputField.focus();
    results.classList.add("hidden");
    timeLeft = 60;
    timerDisplay.textContent = timeLeft;
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft === 0) {
            clearInterval(countdownInterval);
            endTest();
        }
        if (timeLeft <= 10) {
            timerDisplay.style.color = "red";
        } else {
            timerDisplay.style.color = "";
        }
    }, 1000);
}

function endTest() {
    start = false;
    clearInterval(countdownInterval);
    inputField.disabled = true;

    const wordsPerMinute = Math.round((typedWords.length / (60 - timeLeft)) * 60) || 0;
    wpm_html.textContent = wordsPerMinute;
    updateResults();
    results.classList.remove("hidden");
}

inputField.addEventListener("input", () => {
    if (!start) return;
    typedWords = inputField.value.trim().split(/\s+/);
    updateWord();
    updateResults();

    const inputValue = inputField.value;
    const currentWord = currentWords[currentWordIndex];
    const currentWordSpan = wordDisplay.children[currentWordIndex];
    if (currentWordSpan) {
        currentWordSpan.innerHTML = "";
        for (let i = 0; i < currentWord.length; i++) {
            const charSpan = document.createElement("span");
            charSpan.textContent = currentWord[i];
            if (i < inputValue.length && inputValue[i] === currentWord[i]) {
                charSpan.classList.add("correct");
            } else if (i < inputValue.length) {
                charSpan.classList.add("incorrect");
            }
            currentWordSpan.appendChild(charSpan);
        }
    }

    if(typedWords.length === currentWords.length) {
        endTest();
    }
})

inputField.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        if (typedWords.length > 0 && typedWords[typedWords.length - 1] === currentWords[currentWordIndex]) {
            inputField.value = "";
            currentWordIndex++;
            if (currentWordIndex < currentWords.length) {
                typedWords.push("");
                updateWord();
            } else {
                endTest();
            }
        }
    }
});

modeSelect.addEventListener("change", () => {
    if (start) {
        clearInterval(countdownInterval);
        start = false;
        results.classList.add("hidden");
    }
    startTest();
});

startButton.addEventListener("click", startTest);
restartButton.addEventListener("click", startTest);

if (localStorage.getItem("mode")) {
    modeSelect.value = localStorage.getItem("mode");
}

modeSelect.addEventListener("change", () => {
    localStorage.setItem("mode", modeSelect.value);
});

startTest();

//Code of keyboard
const keyboard = document.querySelector(".keyboard");
const keys = keyboard.querySelectorAll("button");

document.addEventListener("keydown", (event) => {
const keyPressed = event.key.toLowerCase();

    keys.forEach(keyElement => {
        const dataKey = keyElement.dataset.key.toLowerCase();
    
        if (keyPressed === dataKey) {
            keyElement.classList.add("active");
            setTimeout(() => {
                keyElement.classList.remove("active");
            }, 100);
        }
    });
})
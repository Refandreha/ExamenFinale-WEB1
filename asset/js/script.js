let startTime = null, previousEndTime = null;
let endTime;
let totalTypedCharacters = 0;
let currentWordIndex = 0;
let currentTextArray = [];
let timeLeft = 60;
let countdownInterval;
let correctWord = 0;
let incorrectWord = 0;
let started = false;

const modeSelect = document.getElementById("mode");
const languageSelect = document.getElementById("language");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const timerDisplay = document.getElementById("timer");
const resultsDiv = document.getElementById("results");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const correctCountDisplay = document.getElementById("correct");
const incorrectCountDisplay = document.getElementById("incorrect");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const languageText = {
    english: {
        easyMode: [
            "the sun is bright",
            "a bird sings sweetly",
            "the dog barks loudly",
            "she reads a book",
            "flowers bloom in spring"
        ],
        mediumMode: [
            "the old house stands on a hill overLooking the town",
            "a gentle breeze rusled the leaves on the tall oak trees",
            "the chef prepared a delicious meal with fresh ingredients",
            "children playes happily in the park under the watchful eyes of their parents",
            "the scientist conducted an experiment in the well-equipped laboratory",
            "music filled the air as the band played their favorite song"
        ],
        hardMode: [
            "the juxtaposition of constrasting elements created a visually stunning effect",
            "unforeseen circumstances necessitated a reevaluation of the initial strategy",
            "the complexities of quantum physics often challenge conventional understanding",
            "her perspicacity allowed her to quickly grasp the nuances of the situation",
            "the ephemeral nature of beauty underscores the importance of cherishing the present moment",
            "his eloquent articulation of intricate ideas captivated the audience"
        ]
    },
    french: {
        easyMode: [
            "le soleil est brillant",
            "lesoleil est chaud",
            "tu es belle",
        ],
        mediumMode: [
            "the old house stands on a hill overLooking the town fr",
            "a gentle breeze rusled the leaves on the tall oak trees fr",
            "the chef prepared a delicious meal with fresh ingredients fr",
            "children playes happily in the park under the watchful eyes of their parents fr",
            "the scientist conducted an experiment in the well-equipped laboratory fr",
            "music filled the air as the band played their favorite song fr"
        ],
        hardMode: [
            "the old house stands on a hill overLooking the town frh",
            "a gentle breeze rusled the leaves on the tall oak trees frh",
            "the chef prepared a delicious meal with fresh ingredients frh",
            "children playes happily in the park under the watchful eyes of their parents frh",
            "the scientist conducted an experiment in the well-equipped laboratory frh",
            "music filled the air as the band played their favorite song frh"
        ]
    },
    spanish: {
        easyMode: [
            "te quiro",
            "te amo",
            "a mi me duelo"
        ],
        mediumMode: [
            "the old house stands on a hill overLooking the town frh esp",
            "a gentle breeze rusled the leaves on the tall oak trees frh esp",
            "the chef prepared a delicious meal with fresh ingredients frh esp",
            "children playes happily in the park under the watchful eyes of their parents frh esp",
            "the scientist conducted an experiment in the well-equipped laboratory frh esp",
            "music filled the air as the band played their favorite song frh esp"
        ],
        hardMode: [
            "the old house stands on a hill overLooking the town esp",
            "a gentle breeze rusled the leaves on the tall oak trees esp",
            "the chef prepared a delicious meal with fresh ingredients esp",
            "children playes happily in the park under the watchful eyes of their parents esp",
            "the scientist conducted an experiment in the well-equipped laboratory esp",
            "music filled the air as the band played their favorite song esp"
        ]
    }
}

// Generate a random word from the selected mode
const getRandomText = (texts) => {
    const randomText = Math.floor(Math.random() * texts.length);
    return texts[randomText];
};

function setTextForMode (language, mode) {
    const texts = languageText[language][mode];
    const textRandom = getRandomText(texts);
    currentTextArray = textRandom.split(" ");
    currentWordIndex = 0;
    //resetGame();
    displayWords();
}
languageSelect.addEventListener("change", () => {
    changerText();
});
modeSelect.addEventListener("change", () => {
    changerText();
});

function changerText() {
    const currentLanguage = languageSelect.value;
    const currentMode = modeSelect.value;
    setTextForMode(currentLanguage, currentMode);
}
function displayWords() {
    wordDisplay.innerHTML = "";
    currentTextArray.forEach((word, index) => {
        const wordSpan = document.createElement("span");
        for (let i = 0; i < word.length; i++) {
            const charSpan = document.createElement("span");
            charSpan.textContent = word[i];
            wordSpan.appendChild(charSpan);
        }
        wordDisplay.appendChild(wordSpan);
        wordDisplay.appendChild(document.createTextNode(" "));
        if (index < currentTextArray.length - 1) {
            wordDisplay.innerHTML += " ";
        }
    });
    highlightNextWord();
}
function generateWords(count, mode) {
    const generateWords = [];
    for(let i = 0; i < count; i++) {
        generateWords.push(getRandomText(mode));
    }
    return generateWords;
}

// Highlight the current word
const highlightNextWord = () => {
    const currentWordSpan = document.getElementById(`word-${currentWordIndex}`);
    if (currentWordSpan) {
        if (previousEndTime !== null) {
            const previousWordSpan = document.getElementById(`word-${previousEndTime}`);
            if (previousWordSpan) {
                previousWordSpan.classList.remove("current-highlight");
            }
        }
        currentWordSpan.classList.add("current-highlight");
        previousEndTime = currentWordIndex;
    }
};

// Move to the next word and update stats only on spacebar press
function updateWord(isCorrect) {
    const wordSpan = document.getElementById(`word-${currentWordIndex}`);
    if (wordSpan) {
        wordSpan.classList.add(isCorrect ? "correct" : "incorrect")
    }
}

function updateTimer() {
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 10) {
        timerDisplay.style.color = "red";
    } else {
        timerDisplay.style.color = "";
    }
}
// Initialize the typing test
const startTest = () => {
    wordDisplay.classList.add("word-display-active");
    restartButton.classList.add("restart-button-active");
    started = true;
    startTime = new Date().getTime();
    resetGame();
    setTextForMode(modeSelect.value);
    inputField.value = "";
    inputField.focus();
    timeLeft = 60;
    updateTimer();
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            endTest();
        }
    }, 1000);
    startButton.disabled = true;
};
function endTest() {
    started = false;
    endTime = new Date().getTime();
    clearInterval(countdownInterval);
    inputField.disabled = true;
    calculateResults();
    resultsDiv.classList.add("results-active");
    startButton.disabled = false;
}
function calculateWpm(timeElapsed) {
    if (!timeElapsed) return 0;
    const wordsTyped = totalTypedCharacters / 5;
    return Math.round((wordsTyped / timeElapsed) * 60);
}   
function calculateResults() {
    let timeElapsed = (endTime - startTime) / 60000;
    const wordsPerMinute = calculateWpm(timeElapsed);
    wpmDisplay.textContent = wordsPerMinute;
    accuracyDisplay.textContent = calculateAccuracy() + "%";
    correctCountDisplay.textContent = correctWord;
    incorrectCountDisplay.textContent = incorrectWord;
}
function calculateAccuracy() {
    return totalTypedCharacters > 0 ? Math.round((((totalTypedCharacters - incorrectWord) > 0 ? (totalTypedCharacters - incorrectWord) : 0) / totalTypedCharacters) * 100) : 0;
}

inputField.addEventListener("input", (event) => {
    if (!started) return;
    const typedValue = inputField.value;
    const currentWord = currentTextArray[currentWordIndex];
    const currentWordSpan = wordDisplay.children[currentWordIndex];

    if (!currentWordSpan) return;
    let correctCharsInWord = 0;
    currentWordSpan.innerHTML = "";
    let isCorrect = false;
    for (let i = 0; i < currentWord.length; i++) {
        const charSpan = document.createElement("span");
        charSpan.textContent = currentWord[i];
        if (i < typedValue.length) {
            if (typedValue[i] === currentWord[i]) {
                charSpan.classList.add("correct");
                correctCharsInWord++;
            } else {
                charSpan.classList.add("incorrect");
            }
        }
        currentWordSpan.appendChild(charSpan);
    }
    if (typedValue.length === currentWord.length && typedValue === currentWord) {
        isCorrect = true;
    }
    if (typedValue.endsWith(" ") || isCorrect) {
        if (typedValue.trim() === currentWord) {
            correctWord++;
            } else {
                incorrectWord++;
            }
            totalTypedCharacters += typedValue.trim().length;
            inputField.value = "";
            currentWordIndex++;
            if (currentWordIndex < currentTextArray.length) {
                highlightNextWord();
            } else {
                endTest();
            }
    }
    updateResultsDisplay();
});


function updateResultsDisplay() {
    correctCountDisplay.textContent = correctWord;
    incorrectCountDisplay.textContent = incorrectWord;
    accuracyDisplay.textContent = calculateAccuracy() + "%";
}

function resetGame() {
    clearInterval(countdownInterval);
    startTime= null;
    endTime = null;
    totalTypedCharacters = 0;
    currentWordIndex = 0;
    timeLeft = 60;
    correctWord = 0;
    incorrectWord = 0;
    inputField.value = "";
    wordDisplay.innerHTML = "";
    timerDisplay.style.color = "";
    updateTimer();
    resultsDiv.classList.remove("results-active");
    inputField.disabled = false;
    startButton.disabled = false;
}

    restartButton.addEventListener("click", () => {
        startTest();
    });


    modeSelect.addEventListener("change", (event) => {
        if (started) {
            clearInterval(correctCountDisplay);
            started = false;
        }
        setTextForMode(event.target.value);
    });


document.addEventListener("DOMContentLoaded", () => {
    setTextForMode(modeSelect.value);
    inputField.focus();
})


//Maintain mode after page refresh
modeSelect.addEventListener("change", () => {
    if (started) {
        clearInterval(countdownInterval);
        started = false;
    }
    localStorage.setItem("mode", modeSelect.value);
});

startButton.addEventListener("click", startTest);
restartButton.addEventListener("click", () => {
    startTest();
    results.classList.remove("results-active");
});

if (localStorage.getItem("mode")) {
    modeSelect.value = localStorage.getItem("mode");
}

modeSelect.addEventListener("change", () => {
    localStorage.setItem("mode", modeSelect.value);
});

startButton.addEventListener("click", () => {
    startTest;
    startButton.classList.add("buttonStart-active")
});

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
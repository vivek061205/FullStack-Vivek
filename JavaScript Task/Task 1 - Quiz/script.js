/* Question bank: the correct answer is always the first option. */
const questions = [
    { question: "What is the capital city of Australia?", options: ["Canberra", "Sydney", "Melbourne", "Perth"], explanation: "Canberra became Australia's capital in 1913." },
    { question: "Which planet is known as the Red Planet?", options: ["Mars", "Venus", "Jupiter", "Mercury"], explanation: "Iron-rich dust on Mars gives its surface a reddish appearance." },
    { question: "Who painted the Mona Lisa?", options: ["Leonardo da Vinci", "Vincent van Gogh", "Pablo Picasso", "Claude Monet"], explanation: "Leonardo da Vinci painted the Mona Lisa in the early 16th century." },
    { question: "What is the largest ocean on Earth?", options: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"], explanation: "The Pacific Ocean covers more area than all of Earth's land combined." },
    { question: "How many sides does a hexagon have?", options: ["Six", "Five", "Seven", "Eight"], explanation: "The prefix 'hex-' means six, so a hexagon has six sides." },
    { question: "Which gas do plants absorb from the atmosphere?", options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"], explanation: "Plants use carbon dioxide during photosynthesis to make food." },
    { question: "What is the hardest natural substance?", options: ["Diamond", "Quartz", "Granite", "Titanium"], explanation: "Diamond ranks at the top of the Mohs scale of mineral hardness." },
    { question: "Which country gifted the Statue of Liberty to the United States?", options: ["France", "Canada", "Spain", "Italy"], explanation: "France presented the statue to the United States in 1886." },
    { question: "What is the smallest prime number?", options: ["2", "1", "3", "0"], explanation: "Two is the only even prime number and the smallest prime." },
    { question: "Which instrument has keys, pedals, and strings?", options: ["Piano", "Violin", "Flute", "Trumpet"], explanation: "A piano creates sound when its keys make hammers strike strings." },
    { question: "In which game would you find the Champion's League?", options: ["League of Legends", "Minecraft", "Tetris", "The Sims"], explanation: "The Champion's League is a major tournament in League of Legends." },
    { question: "What is the name of Mario's brother?", options: ["Luigi", "Wario", "Toad", "Yoshi"], explanation: "Luigi is Mario's younger twin brother in Nintendo's games." },
    { question: "Which gaming company created the PlayStation?", options: ["Sony", "Microsoft", "Nintendo", "Sega"], explanation: "Sony launched the original PlayStation in 1994." },
    { question: "What is the main resource used to craft tools in Minecraft?", options: ["Wood", "Wool", "Glass", "Sand"], explanation: "Wood is one of the first materials players commonly collect and craft." },
    { question: "What is the name of the hero in The Legend of Zelda?", options: ["Link", "Zelda", "Ganon", "Epona"], explanation: "Link is the protagonist, while Zelda is the princess he often rescues." },
    { question: "Which game features the battle royale map called Erangel?", options: ["PUBG", "Fortnite", "Apex Legends", "Overwatch"], explanation: "Erangel is the original large island map in PlayerUnknown's Battlegrounds." },
    { question: "What type of Pokémon is Pikachu?", options: ["Electric", "Fire", "Water", "Psychic"], explanation: "Pikachu is an Electric-type Pokémon that stores power in its cheeks." },
    { question: "In chess, which piece can move in an L shape?", options: ["Knight", "Bishop", "Rook", "Queen"], explanation: "The knight moves two squares in one direction and one perpendicular square." },
    { question: "What is the currency used in Animal Crossing?", options: ["Bells", "Coins", "Gil", "Rupees"], explanation: "Bells are the main currency used throughout the Animal Crossing series." },
    { question: "Which game series includes the character Master Chief?", options: ["Halo", "Destiny", "Doom", "Warcraft"], explanation: "Master Chief Petty Officer John-117 is the protagonist of Halo." },
    { question: "What is the chemical symbol for gold?", options: ["Au", "Ag", "Go", "Gd"], explanation: "Au comes from the Latin word 'aurum', meaning gold." },
    { question: "Which continent is the Sahara Desert located on?", options: ["Africa", "Asia", "South America", "Australia"], explanation: "The Sahara stretches across much of northern Africa." },
    { question: "How many bones are in the adult human body?", options: ["206", "201", "212", "220"], explanation: "Most adults have 206 bones, though the count can vary slightly." },
    { question: "What is the fastest land animal?", options: ["Cheetah", "Lion", "Pronghorn", "Leopard"], explanation: "A cheetah can reach speeds of about 60 to 70 miles per hour in short bursts." },
    { question: "Which language has the most native speakers worldwide?", options: ["Mandarin Chinese", "English", "Spanish", "Hindi"], explanation: "Mandarin Chinese has the largest number of native speakers." }
];

/* Game state and DOM references */
const TOTAL_TIME = 30;
let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = TOTAL_TIME;
let timerId = null;
let answered = false;
let missedQuestions = [];

const quizScreen = document.querySelector("#quiz-screen");
const resultsScreen = document.querySelector("#results-screen");
const reviewScreen = document.querySelector("#review-screen");
const progressLabel = document.querySelector("#progress-label");
const progressFill = document.querySelector("#progress-fill");
const scoreLabel = document.querySelector("#score-label");
const questionNumber = document.querySelector("#question-number");
const questionText = document.querySelector("#question-text");
const optionsContainer = document.querySelector("#options");
const timerLabel = document.querySelector("#timer-label");
const feedback = document.querySelector("#feedback");
const feedbackTitle = document.querySelector("#feedback-title");
const feedbackExplanation = document.querySelector("#feedback-explanation");
const nextButton = document.querySelector("#next-button");
const finalScore = document.querySelector("#final-score");
const finalPercentage = document.querySelector("#final-percentage");
const ratingMessage = document.querySelector("#rating-message");
const scoreRing = document.querySelector("#score-ring");
const reviewList = document.querySelector("#review-list");
const reviewCount = document.querySelector("#review-count");
const emptyReview = document.querySelector("#empty-review");

/* Small utility helpers */
function shuffle(items) {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }
    return shuffled;
}

function clearTimer() {
    if (timerId !== null) {
        window.clearInterval(timerId);
        timerId = null;
    }
}

function setScreen(screenToShow) {
    clearTimer();
    quizScreen.hidden = screenToShow !== quizScreen;
    resultsScreen.hidden = screenToShow !== resultsScreen;
    reviewScreen.hidden = screenToShow !== reviewScreen;
}

/* Question rendering and countdown */
function updateTimerDisplay() {
    timerLabel.textContent = `${timeLeft}s`;
}

function startTimer() {
    clearTimer();
    timeLeft = TOTAL_TIME;
    updateTimerDisplay();
    timerId = window.setInterval(() => {
        timeLeft -= 1;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearTimer();
            lockQuestion(null);
        }
    }, 1000);
}

function renderQuestion() {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    answered = false;
    questionNumber.textContent = String(currentQuestionIndex + 1).padStart(2, "0");
    questionText.textContent = currentQuestion.question;
    progressLabel.textContent = `Q${currentQuestionIndex + 1}/${quizQuestions.length}`;
    progressFill.style.width = `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`;
    scoreLabel.textContent = String(score);
    nextButton.disabled = true;
    nextButton.textContent = currentQuestionIndex === quizQuestions.length - 1 ? "Finish" : "Next question";
    feedback.hidden = true;
    feedbackTitle.textContent = "";
    feedbackExplanation.textContent = "";
    optionsContainer.replaceChildren();

    shuffle(currentQuestion.options).forEach((optionText) => {
        const optionButton = document.createElement("button");
        optionButton.className = "option";
        optionButton.type = "button";
        optionButton.textContent = optionText;
        optionButton.addEventListener("click", () => lockQuestion(optionButton));
        optionsContainer.append(optionButton);
    });
    startTimer();
}

/* Answer handling and scoring */
function lockQuestion(selectedButton) {
    if (answered) {
        return;
    }
    answered = true;
    clearTimer();
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const correctAnswer = currentQuestion.options[0];
    const optionButtons = [...optionsContainer.querySelectorAll(".option")];
    const selectedAnswer = selectedButton ? selectedButton.textContent : null;
    const isCorrect = selectedAnswer === correctAnswer;

    optionButtons.forEach((button) => {
        button.disabled = true;
        if (button.textContent === correctAnswer) {
            button.classList.add("correct");
        }
    });

    if (isCorrect) {
        score += 1;
        scoreLabel.textContent = String(score);
        feedbackTitle.textContent = "Correct!";
    } else {
        if (selectedButton) {
            selectedButton.classList.add("incorrect");
        }
        missedQuestions.push({
            question: currentQuestion.question,
            playerAnswer: selectedAnswer,
            correctAnswer,
            explanation: currentQuestion.explanation
        });
        feedbackTitle.textContent = selectedAnswer ? "Not quite!" : "Time ran out!";
    }

    feedbackExplanation.textContent = currentQuestion.explanation;
    feedback.hidden = false;
    nextButton.disabled = false;
}

function showResults() {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    finalScore.textContent = `${score}/${quizQuestions.length}`;
    finalPercentage.textContent = `${percentage}%`;
    scoreRing.style.setProperty("--score-angle", `${percentage * 3.6}deg`);
    ratingMessage.textContent = percentage === 100
        ? "Champion status unlocked!"
        : percentage >= 80
            ? "Excellent run - you know your stuff!"
            : percentage >= 60
                ? "Good game - a little more practice will make you unstoppable."
                : "Keep practising - every round is a chance to level up!";
    setScreen(resultsScreen);
}

/* Results review */
function renderReview() {
    reviewList.replaceChildren();
    reviewCount.textContent = `${missedQuestions.length} missed`;
    emptyReview.hidden = missedQuestions.length !== 0;

    missedQuestions.forEach((missedQuestion, index) => {
        const item = document.createElement("article");
        item.className = "review-item";
        const title = document.createElement("h3");
        title.textContent = `${index + 1}. ${missedQuestion.question}`;
        const playerAnswer = document.createElement("p");
        playerAnswer.textContent = `Your answer: ${missedQuestion.playerAnswer || "No answer, time ran out"}`;
        const correctAnswer = document.createElement("p");
        correctAnswer.className = "correct-answer";
        correctAnswer.textContent = `Correct answer: ${missedQuestion.correctAnswer}`;
        const explanation = document.createElement("p");
        explanation.textContent = `Why: ${missedQuestion.explanation}`;
        item.append(title, playerAnswer, correctAnswer, explanation);
        reviewList.append(item);
    });
}

/* Game controls */
function startGame() {
    clearTimer();
    quizQuestions = shuffle(questions).map((question) => ({
        ...question,
        options: [...question.options]
    }));
    currentQuestionIndex = 0;
    score = 0;
    missedQuestions = [];
    setScreen(quizScreen);
    renderQuestion();
}

nextButton.addEventListener("click", () => {
    if (!answered) {
        return;
    }
    if (currentQuestionIndex === quizQuestions.length - 1) {
        showResults();
        return;
    }
    currentQuestionIndex += 1;
    renderQuestion();
});

document.querySelector("#restart-button").addEventListener("click", startGame);
document.querySelector("#results-restart-button").addEventListener("click", startGame);
document.querySelector("#review-restart-button").addEventListener("click", startGame);
document.querySelector("#review-button").addEventListener("click", () => {
    renderReview();
    setScreen(reviewScreen);
});
document.querySelector("#back-button").addEventListener("click", () => setScreen(resultsScreen));

startGame();

document.addEventListener('DOMContentLoaded', () => {
    const mainMenu = document.getElementById('main-menu');
    const gameView = document.getElementById('game-view');

    const startPlusBtn = document.getElementById('start-plus-btn');
    const startMinusBtn = document.getElementById('start-minus-btn');
    const exitGameBtn = document.getElementById('exit-game-btn');
    const backToMenuBtn = document.getElementById('back-to-menu-btn');

    const scoreDisplay = document.getElementById('score');
    const questionContainer = document.getElementById('question-container');
    const optionsContainer = document.getElementById('options-container');
    const feedback = document.getElementById('feedback');
    const grimace = document.getElementById('grimace');

    let currentTrack = ''; // 'plus' or 'minus'
    let scores = {
        plus: 0,
        minus: 0
    };
    let currentQuestion = {};
    let feedbackTimeout;

    // Load progress from localStorage
    function loadProgress() {
        const savedScores = localStorage.getItem('grimaceMathScores');
        if (savedScores) {
            scores = JSON.parse(savedScores);
        }
    }

    // Save progress to localStorage
    function saveProgress() {
        localStorage.setItem('grimaceMathScores', JSON.stringify(scores));
    }

    function showMainMenu() {
        mainMenu.classList.remove('hidden');
        gameView.classList.add('hidden');
    }

    function showGameView() {
        mainMenu.classList.add('hidden');
        gameView.classList.remove('hidden');
    }

    function startGame(track) {
        currentTrack = track;
        showGameView();
        updateScoreDisplay();
        generateQuestion();
    }

    function updateScoreDisplay() {
        scoreDisplay.textContent = `Du har klarat ${scores[currentTrack]} frågor!`;
    }

    function generateQuestion() {
        clearTimeout(feedbackTimeout); // Clear any existing feedback timeout
        feedback.classList.add('hidden');
        const level = scores[currentTrack];
        let num1, num2, correctAnswer;

        if (currentTrack === 'plus') {
            num1 = Math.floor(Math.random() * (level * 1.5 + 5)) + 1;
            num2 = Math.floor(Math.random() * (level * 1.5 + 5)) + 1;
            correctAnswer = num1 + num2;
            questionContainer.textContent = `${num1} + ${num2} = ?`;
        } else { // minus
            const term1 = Math.floor(Math.random() * (level + 3)) + 1;
            const term2 = Math.floor(Math.random() * (level * 1.5 + 4)) + 1;
            num1 = term1 + term2; // This ensures the first number is always bigger
            num2 = term1;
            correctAnswer = num1 - num2;
            questionContainer.textContent = `${num1} - ${num2} = ?`;
        }

        currentQuestion = { num1, num2, correctAnswer };
        generateOptions(correctAnswer);
    }

    function generateOptions(correctAnswer) {
        optionsContainer.innerHTML = '';
        let options = new Set([correctAnswer]);
        while (options.size < 4) {
            const wrongAnswer = correctAnswer + Math.floor(Math.random() * 9) - 4;
            if (wrongAnswer !== correctAnswer && wrongAnswer >= 0) {
                options.add(wrongAnswer);
            }
        }

        // Shuffle options
        const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);

        shuffledOptions.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.addEventListener('click', () => checkAnswer(option));
            optionsContainer.appendChild(button);
        });
    }

    function checkAnswer(selectedAnswer) {
        if (selectedAnswer === currentQuestion.correctAnswer) {
            // Correct answer
            scores[currentTrack]++;
            saveProgress();
            updateScoreDisplay();
            
            grimace.classList.add('happy');
            setTimeout(() => {
                grimace.classList.remove('happy');
                generateQuestion();
            }, 500);

        } else {
            // Wrong answer
            feedback.classList.remove('hidden');
            clearTimeout(feedbackTimeout);
            feedbackTimeout = setTimeout(() => {
                feedback.classList.add('hidden');
            }, 2000);
        }
    }

    // Event Listeners
    startPlusBtn.addEventListener('click', () => startGame('plus'));
    startMinusBtn.addEventListener('click', () => startGame('minus'));
    backToMenuBtn.addEventListener('click', showMainMenu);
    exitGameBtn.addEventListener('click', showMainMenu); // Exit just goes to menu

    // Initial setup
    loadProgress();
});
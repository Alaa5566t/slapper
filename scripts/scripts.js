class WhackAMoleGame {
    constructor() {
        this.customCursor = document.querySelector('.custom-cursor');
        this.gameContainer = document.querySelector('.game-container');
        this.scoreDisplay = document.querySelector('.score');
        this.timerDisplay = document.querySelector('.timer');
        this.warning = document.getElementById('warning');
        this.selectedMoleImage = null;
        this.difficulty = 'easy';
        this.score = 0;
        this.timeLeft = 40;
        this.moleTimeouts = [];
        this.gameStarted = false;
        this.slapSound = new Audio('sounds/ahh.mp3');
        this.missSound = new Audio('sounds/hha.mp3');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        document.querySelectorAll('input[name="mole"]').forEach((input) => {
            input.addEventListener('change', (e) => {
                this.selectedMoleImage = e.target.value;
                this.warning.style.display = 'none';
            });
        });

        document.querySelectorAll('input[name="difficulty"]').forEach((input) => {
            input.addEventListener('change', (e) => {
                this.difficulty = e.target.value;
            });
        });

        document.addEventListener('mousemove', (e) => {
            if (this.gameStarted) {
                this.customCursor.style.top = `${e.clientY}px`;
                this.customCursor.style.left = `${e.clientX}px`;
                this.customCursor.classList.add('active');
            }
        });

        document.addEventListener('click', () => {
            if (this.gameStarted) {
                this.customCursor.classList.add('slap-animation');
                setTimeout(() => this.customCursor.classList.remove('slap-animation'), 300);
            }
        });
    }

    createHoles(num) {
        this.gameContainer.innerHTML = '';
        for (let i = 0; i < num; i++) {
            const hole = document.createElement('div');
            hole.classList.add('hole');

            const mole = document.createElement('img');
            mole.src = this.selectedMoleImage || 'images/mole1.png';
            mole.alt = 'Mole';
            mole.classList.add('mole');
            mole.addEventListener('click', () => this.whackMole(mole));

            hole.appendChild(mole);
            this.gameContainer.appendChild(hole);
        }
    }

    whackMole(mole) {
        if (mole.classList.contains('show')) {
            this.score++;
            this.updateScore();
            this.slapSound.play();

            // Add movement effect
            mole.classList.remove('show');
            mole.classList.add(Math.random() > 0.5 ? 'moving-right' : 'moving-left');

            setTimeout(() => mole.classList.remove('moving-right', 'moving-left'), 300);
        }
    }

    updateScore() {
        this.scoreDisplay.textContent = `Score: ${this.score}`;
    }

    updateTimer() {
        this.timerDisplay.textContent = `Time: ${this.timeLeft}`;
    }

    showMole() {
        const holes = document.querySelectorAll('.hole');
        const randomHole = holes[Math.floor(Math.random() * holes.length)];
        const mole = randomHole.querySelector('.mole');

        mole.classList.add('show');
        const timeout = setTimeout(() => {
            if (mole.classList.contains('show')) {
                this.missSound.play();
            }
            mole.classList.remove('show');
        }, this.getMoleTimeout());
        this.moleTimeouts.push(timeout);
    }

    getMoleTimeout() {
        switch (this.difficulty) {
            case 'easy':
                return 1500;
            case 'medium':
                return 1000;
            case 'hard':
                return 700;
            default:
                return 1000;
        }
    }

    startGame() {
        if (!this.selectedMoleImage) {
            this.warning.style.display = 'block';
            return;
        }

        this.warning.style.display = 'none';
        this.score = 0;
        this.timeLeft = 40;
        this.updateScore();
        this.updateTimer();
        this.createHoles(9);

        this.customCursor.classList.add('active');
        this.gameStarted = true;

        this.gameInterval = setInterval(() => {
            if (this.timeLeft <= 0) {
                this.endGame();
            } else {
                this.timeLeft--;
                this.updateTimer();
                this.showMole();
            }
        }, 1000);
    }

    endGame() {
        clearInterval(this.gameInterval);
        this.moleTimeouts.forEach(timeout => clearTimeout(timeout));
        this.customCursor.classList.remove('active');
        this.gameStarted = false;

        alert(`Game Over! Your final score: ${this.score}`);
    }

    resetGame() {
        this.endGame();
        this.score = 0;
        this.timeLeft = 40;
        this.updateScore();
        this.updateTimer();
        this.gameContainer.innerHTML = '';
    }
}

const game = new WhackAMoleGame();

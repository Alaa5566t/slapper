// Function to dynamically load the mobile or desktop CSS based on screen size
function loadCSS() {
    var mobileStylesheet = document.createElement('link');
    mobileStylesheet.rel = 'stylesheet';
    mobileStylesheet.href = 'style-mobile.css';

    var desktopStylesheet = document.createElement('link');
    desktopStylesheet.rel = 'stylesheet';
    desktopStylesheet.href = 'style-desktop.css';

    // Check the current window size and load the appropriate CSS
    if (window.innerWidth <= 600) {
        document.head.appendChild(mobileStylesheet);  // Load mobile stylesheet
    } else {
        document.head.appendChild(desktopStylesheet); // Load desktop stylesheet
    }

    // Listen for window resizing to update the styles dynamically
    window.onresize = function() {
        // Remove previously loaded stylesheets to avoid conflicts
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => link.remove());

        if (window.innerWidth <= 600) {
            document.head.appendChild(mobileStylesheet);
        } else {
            document.head.appendChild(desktopStylesheet);
        }
    };
}

// Load the correct styles when the page is loaded
window.onload = loadCSS;

const cursor = document.querySelector('.cursor');
const holes = [...document.querySelectorAll('.hole')];
const scoreEl = document.querySelector('.score span');
const music = new Audio("assets/music.mp3");
let score = 0;

const sound = new Audio("assets/smash.mp3");

function run() {
    music.play();
    const i = Math.floor(Math.random() * holes.length);
    const hole = holes[i];
    let timer = null;

    const img = document.createElement('img');
    img.classList.add('mole');
    img.src = 'assets/mole.png';

    img.addEventListener('click', () => {
        score += 10;
        sound.play();
        scoreEl.textContent = score;
        img.src = 'assets/mole-whacked.png';
        clearTimeout(timer);
        setTimeout(() => {
            hole.removeChild(img);
            run();
        }, 500);
    });

    hole.appendChild(img);

    timer = setTimeout(() => {
        hole.removeChild(img);
        run();
    }, 1500);
}

run();

window.addEventListener('mousemove', e => {
    cursor.style.top = e.pageY + 'px';  // Position the cursor based on Y-axis
    cursor.style.left = e.pageX + 'px'; // Position the cursor based on X-axis
});

window.addEventListener('mousedown', () => {
    cursor.classList.add('active'); // Add an active class when mouse is pressed
});

window.addEventListener('mouseup', () => {
    cursor.classList.remove('active'); // Remove active class when mouse is released
});

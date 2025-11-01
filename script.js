// Add loading class to body
document.body.classList.add('loading');

// Loading Screen
const loadingScreens = [
    {
        text: "Praying the wifi works",
        image: "pictures/fritzbox-nobg.png"
    },
    {
        text: "sshing into some random server",
        image: "pictures/hetzner-nobg.png"
    },
    {
        text: "realizing my 3d printer makes weird moves",
        image: "pictures/bambulab_nobg.png"
    }
];

let currentScreen = 0;
const loadingImage = document.getElementById('loading-image');
const loadingText = document.getElementById('loading-text');
const loadingScreenEl = document.getElementById('loading-screen');

function showLoadingScreen(index) {
    loadingImage.src = loadingScreens[index].image;
    loadingText.textContent = loadingScreens[index].text;
}

function nextLoadingScreen() {
    if (currentScreen < loadingScreens.length) {
        showLoadingScreen(currentScreen);
        currentScreen++;
        
        if (currentScreen < loadingScreens.length) {
            setTimeout(nextLoadingScreen, 1000);
        } else {
            setTimeout(() => {
                loadingScreenEl.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreenEl.style.display = 'none';
                    // Remove loading class and add loaded class
                    document.body.classList.remove('loading');
                    document.body.classList.add('loaded');
                    // Initialize scroll animations
                    initScrollAnimations();
                }, 500);
            }, 1000);
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    nextLoadingScreen();
});

// Scroll Animation Observer
function initScrollAnimations() {
    const sections = document.querySelectorAll('section');
    
    // Add fade-in class to all sections
    sections.forEach(section => {
        section.classList.add('fade-in');
    });
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Background scroll effect
const backgrounds = [
    'pictures/blueprint-pfp.png',
    'pictures/normal-pfp.jpg',
    'pictures/whatsapp-pfp.jpeg'
];

let currentBgIndex = 0;

const bgOverlay = document.createElement('div');
bgOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    background-repeat: no-repeat;
    opacity: 0.25;
    transition: opacity 1s ease-in-out;
`;
document.body.appendChild(bgOverlay);

bgOverlay.style.backgroundImage = `url('${backgrounds[0]}')`;

window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = (scrollPosition / documentHeight) * 100;

    let targetIndex;
    if (scrollPercentage < 33) {
        targetIndex = 0;
    } else if (scrollPercentage < 66) {
        targetIndex = 1;
    } else {
        targetIndex = 2;
    }

    if (targetIndex !== currentBgIndex) {
        bgOverlay.style.opacity = '0';
        
        setTimeout(() => {
            currentBgIndex = targetIndex;
            bgOverlay.style.backgroundImage = `url('${backgrounds[currentBgIndex]}')`;
            bgOverlay.style.opacity = '0.25';
        }, 500);
    }
});
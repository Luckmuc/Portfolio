document.body.classList.add('loading');

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
                    document.body.classList.remove('loading');
                    document.body.classList.add('loaded');
                    initScrollAnimations();
                }, 500);
            }, 1000);
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    nextLoadingScreen();
});

function initScrollAnimations() {
    const sections = document.querySelectorAll('section');
    
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
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}
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
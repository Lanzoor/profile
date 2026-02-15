let welcomeHeader = document.getElementById('welcome-header')!;

let welcomeButtons = document.getElementById('welcome-buttons')!;
let profileButton = document.getElementById('profile-button')!;
let navigationButton = document.getElementById('navigation-button')!;

let welcomeDown = document.getElementById('welcome-down')!;
let downArrow = document.getElementById('down-arrow')!;

welcomeHeader.classList.add('inactive');
welcomeButtons.classList.add('inactive');
welcomeDown.classList.add('inactive');

document.addEventListener('DOMContentLoaded', () => {
    welcomeHeader.classList.add('active');
    setTimeout(() => {
        welcomeButtons.classList.add('active');
        profileButton.addEventListener('click', () => {
            window.location.href = './profile/index.html';
        });

        setTimeout(() => {
            welcomeDown.classList.add('active');
            downArrow.style.animation = '2s floatAnimation ease-in-out infinite';
        }, 1000);
    }, 1000);
});

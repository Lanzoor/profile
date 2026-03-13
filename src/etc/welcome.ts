let welcomeHeader = document.getElementById('welcome--header')!;

let welcomeButtons = document.getElementById('welcome--buttons')!;
let profileButton = document.getElementById('welcome--profile-button')!;
let welcomeNavigationButton = document.getElementById('welcome--navigation-button')!;

let welcomeDown = document.getElementById('welcome--down')!;

welcomeHeader.classList.add('inactive');
welcomeButtons.classList.add('inactive');
welcomeDown.classList.add('inactive');

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        welcomeHeader.classList.add('active');
        setTimeout(() => {
            welcomeButtons.classList.add('active');
            profileButton.addEventListener('click', () => {
                window.location.href = './profile/index.html';
            });

            setTimeout(() => {
                welcomeDown.classList.add('active');
                welcomeDown.style.animation = '2s floatAnimation ease-in-out infinite';
            }, 1000);
        }, 1000);
    });
});

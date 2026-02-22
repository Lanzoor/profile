function getUTC9Time() {
    const date = new Date();
    const utc9 = new Date(date.getTime() + 9 * 60 * 60 * 1000);

    const year = utc9.getUTCFullYear();
    const month = String(utc9.getUTCMonth() + 1).padStart(2, '0');
    const day = String(utc9.getUTCDate()).padStart(2, '0');

    let hour = utc9.getUTCHours();
    const minute = String(utc9.getUTCMinutes()).padStart(2, '0');
    const second = String(utc9.getUTCSeconds()).padStart(2, '0');
    const millisecond = String(utc9.getUTCMilliseconds()).padStart(3, '0');

    const determiner = hour < 12 ? 'AM' : 'PM';
    const displayHour = hour % 12 || 12;

    return `${year}-${month}-${day} ${String(displayHour).padStart(2, '0')}:${minute}:${second}.${millisecond} ${determiner}`;
}

const localTimeText = document.getElementById('local-time')!;

function updateTime() {
    localTimeText.textContent = getUTC9Time();

    requestAnimationFrame(updateTime);
}

updateTime();
let currentPage: number = 1;

document.getElementById('javascript-indicator')!.classList.remove('active');

class Page {
    pageNumber: number;
    pageName: string;
    pageEl: HTMLElement;

    constructor(page: number, name: string, element: HTMLElement) {
        this.pageNumber = page;
        this.pageName = name;
        this.pageEl = element;
    }

    format() {
        return `Page ${this.pageNumber}/${pages.length} - <b>${this.pageName}</b>`;
    }
}

let pages = [
    //
    new Page(1, 'Welcome!', document.getElementById('profile-page-1')!),
    new Page(2, 'About me', document.getElementById('profile-page-2')!),
    new Page(3, 'Interests (1)', document.getElementById('profile-page-3')!),
    new Page(4, 'Special Thanks', document.getElementById('profile-page-4')!),
];

const savedPage = sessionStorage.getItem('currentPage');

if (savedPage !== null) {
    currentPage = Math.min(Math.max(parseInt(savedPage, 10), 1), pages.length);
}

let leftButton = document.getElementById('left-button')!;
let rightButton = document.getElementById('right-button')!;

let leftestButton = document.getElementById('leftest-button')!;
let rightestButton = document.getElementById('rightest-button')!;

let pageDescription = document.getElementById('profile-page-text')!;

let backgrounds = [
    //
    'linear-gradient(120deg, black, #38076f)',
    'linear-gradient(140deg, black, #1e0e48)',
    'linear-gradient(140deg, black, #1e0e48)',
    'radial-gradient(circle at top, #0c1f3a 0%, transparent 55%), linear-gradient(140deg, #0a0214, #10051e 45%, #05010c)',
];

function updateBackgroundAndUI() {
    document.body.style.background = backgrounds[currentPage - 1];
    pageDescription.innerHTML = pages[currentPage - 1].format();

    leftButton.classList.toggle('active', currentPage > 1);
    leftestButton.classList.toggle('active', currentPage > 1);

    rightButton.classList.toggle('active', currentPage < pages.length);
    rightestButton.classList.toggle('active', currentPage < pages.length);
}

function updatePagesVisibility() {
    pages.forEach((page) => {
        if (page.pageNumber === currentPage) {
            page.pageEl.classList.add('active');
        } else {
            page.pageEl.classList.remove('active');
        }
    });

    updateBackgroundAndUI();
}

document.addEventListener('DOMContentLoaded', () => {
    updatePagesVisibility();
});

type Direction = 'left' | 'leftest' | 'right' | 'rightest';

function movePage(direction: Direction) {
    const moveDirection = direction.replace('est', '');
    const absolute: boolean = direction.endsWith('est');

    let targetPageIndex: number = 0;

    if (absolute) {
        targetPageIndex = moveDirection === 'left' ? 1 : pages.length;
    } else {
        targetPageIndex = moveDirection === 'right' ? currentPage + 1 : currentPage - 1;
    }

    if (targetPageIndex === currentPage) return;

    if (targetPageIndex < 1 || targetPageIndex > pages.length) return;

    const current = pages[currentPage - 1];
    const next = pages[targetPageIndex - 1];

    pages.forEach((page) => {
        if (page !== next && page.pageEl.classList.contains('active') === false) {
            page.pageEl.style.display = 'none';
        }
    });

    pageDescription.style.transition = 'none';
    pageDescription.style.opacity = '0';
    next.pageEl.style.display = 'block';
    next.pageEl.offsetHeight;

    next.pageEl.classList.add('no-transition');
    next.pageEl.classList.add(moveDirection === 'right' ? 'off-down' : 'off-up');
    next.pageEl.classList.remove('active', 'exit-up', 'exit-down');
    next.pageEl.offsetHeight;

    requestAnimationFrame(() => {
        next.pageEl.classList.remove('no-transition');

        pageDescription.style.transition = 'opacity 1s ease';
        pageDescription.style.opacity = '1';

        current.pageEl.classList.add(moveDirection === 'right' ? 'exit-up' : 'exit-down');
        current.pageEl.classList.remove('active');

        next.pageEl.classList.add('active');
        next.pageEl.classList.remove('off-up', 'off-down');

        current.pageEl.addEventListener(
            'transitionend',
            () => {
                current.pageEl.classList.remove('exit-up', 'exit-down');
            },
            { once: true }
        );
    });

    currentPage = targetPageIndex;
    sessionStorage.setItem('currentPage', String(currentPage));

    updateBackgroundAndUI();
}

leftButton.addEventListener('click', () => movePage('left'));
rightButton.addEventListener('click', () => movePage('right'));

leftestButton.addEventListener('click', () => movePage('leftest'));
rightestButton.addEventListener('click', () => movePage('rightest'));

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        if (event.shiftKey) {
            movePage('leftest');
        } else {
            movePage('left');
        }
    }

    if (event.key === 'ArrowRight') {
        if (event.shiftKey) {
            movePage('rightest');
        } else {
            movePage('right');
        }
    }
});

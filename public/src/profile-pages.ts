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
    new Page(1, 'Welcome!', document.getElementById('page-1')!),
    new Page(2, 'About me (1)', document.getElementById('page-2')!),
    new Page(3, 'About me (2)', document.getElementById('page-3')!),
    new Page(4, 'Special Thanks', document.getElementById('page-4')!),
];

const savedPage = sessionStorage.getItem('currentPage');

if (savedPage !== null) {
    currentPage = Math.min(Math.max(parseInt(savedPage, 10), 1), pages.length);
}

let leftButton = document.getElementById('left-button')!;
let rightButton = document.getElementById('right-button')!;
let pageDescription = document.getElementById('page-text')!;

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
    rightButton.classList.toggle('active', currentPage < pages.length);
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

type Direction = 'left' | 'right';

function movePage(direction: Direction) {
    const targetPageIndex = direction === 'right' ? currentPage + 1 : currentPage - 1;

    if (targetPageIndex < 1 || targetPageIndex > pages.length) return;

    const current = pages[currentPage - 1];
    const next = pages[targetPageIndex - 1];

    pages.forEach((page) => {
        if (page !== next && page.pageEl.classList.contains('active') === false) {
            page.pageEl.style.display = 'none';
        }
    });

    next.pageEl.style.display = 'block';
    next.pageEl.offsetHeight;

    next.pageEl.classList.add('no-transition');
    next.pageEl.classList.add(direction === 'right' ? 'off-down' : 'off-up');
    next.pageEl.classList.remove('active', 'exit-up', 'exit-down');
    next.pageEl.offsetHeight;

    requestAnimationFrame(() => {
        next.pageEl.classList.remove('no-transition');

        current.pageEl.classList.add(direction === 'right' ? 'exit-up' : 'exit-down');
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

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') movePage('left');
    if (event.key === 'ArrowRight') movePage('right');
});

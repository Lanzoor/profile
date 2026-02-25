const topPanel = document.createElement('div');
topPanel.id = 'top-panel';

const topPanelLinks = document.createElement('nav');
topPanelLinks.id = 'top-panel--links';

const topPanelLogo = document.createElement('div');
topPanelLogo.id = 'top-panel--logo';

const topPanelLogoText = document.createElement('p');
topPanelLogoText.textContent = 'lanzoor.dev';

const topPanelNavigation = document.createElement('div');
topPanelNavigation.id = 'top-panel--navigation';
topPanelNavigation.classList.add('navigation-toggle');

const topPanelNavigationText = document.createElement('p');
topPanelNavigationText.textContent = 'Navigation';

const topPanelNavigationIcon = document.createElement('img');
topPanelNavigationIcon.src = '/assets/icons/hamburger.svg';
topPanelNavigationIcon.alt = '☰';

const navigationOverlay = document.createElement('div');
navigationOverlay.id = 'navigation-overlay';

const navigationPanel = document.createElement('div');
navigationPanel.id = 'navigation-panel';

const navigationClose = document.createElement('div');
navigationClose.id = 'navigation--close';
navigationClose.classList.add('navigation-toggle');

const navigationCloseText = document.createElement('p');
navigationCloseText.textContent = 'Close';

const navigationCloseIcon = document.createElement('img');
navigationCloseIcon.src = '/assets/icons/close.svg';
navigationCloseIcon.alt = '☰';

const navigationPanelNav = document.createElement('nav');
const navigationPanelList = document.createElement('ul');

class NavigationDestination {
    private link: string;
    private name: string;
    private childElements?: NavigationDestination[];

    constructor(link: string, name: string, childElements?: NavigationDestination[]) {
        this.link = link;
        this.name = name;
        this.childElements = childElements;
    }

    appendTo(parent: HTMLElement) {
        const textEl = document.createElement('div');
        const linkEl = document.createElement('a');

        if (!this.childElements) {
            linkEl.href = this.link;
            if (!this.link.startsWith('/')) {
                linkEl.target = '_blank';
            }
        } else {
            linkEl.classList.add('disabled');
        }

        linkEl.textContent = this.name;

        if (parent instanceof HTMLUListElement) {
            const listItemEl = document.createElement('li');
            parent.appendChild(listItemEl);

            textEl.appendChild(linkEl);
            listItemEl.appendChild(textEl);

            if (this.childElements) {
                const arrowEl = document.createElement('img');
                arrowEl.src = '/assets/icons/caret-down.svg';
                arrowEl.alt = '▼';
                arrowEl.classList.add('chevron');
                arrowEl.setAttribute('aria-expanded', 'false');

                textEl.appendChild(arrowEl);

                textEl.addEventListener('click', () => {
                    const expanded = arrowEl.getAttribute('aria-expanded') === 'true';

                    const allDropdowns = parent.querySelectorAll('ul.dropdown');
                    allDropdowns.forEach((dropdown) => dropdown.classList.remove('open'));

                    const allArrows = parent.querySelectorAll('img.chevron');
                    allArrows.forEach((arrow) => {
                        arrow.setAttribute('aria-expanded', 'false');
                        arrow.classList.remove('open');
                    });

                    const childList = listItemEl.nextElementSibling as HTMLUListElement | null;

                    if (childList && childList.classList.contains('dropdown')) {
                        arrowEl.setAttribute('aria-expanded', String(!expanded));
                        childList.classList.toggle('open', !expanded);
                        arrowEl.classList.toggle('open', !expanded);
                    }
                });

                const childListEl = document.createElement('ul');
                childListEl.classList.add('dropdown');

                for (const child of this.childElements) {
                    child.appendTo(childListEl);
                }

                parent.appendChild(childListEl);
            }
        } else if (parent instanceof HTMLElement) {
            parent.appendChild(linkEl);
            linkEl.href = this.link;

            if (this.childElements) {
                const childDivEl = document.createElement('div');
                childDivEl.classList.add('inline-dropdown');

                for (const child of this.childElements) {
                    child.appendTo(childDivEl);
                }

                parent.appendChild(childDivEl);
            }
        }
    }
}

let destinations = [
    //
    new NavigationDestination('/', 'Welcome!'),
    new NavigationDestination('/profile', 'Profile'),
    new NavigationDestination('/projects', 'Projects', [
        //
        new NavigationDestination('/projects', 'Project Portal'),
        new NavigationDestination('https://www.youtube.com/@lanzoorgaming', 'Videos'),
        new NavigationDestination('/projects/conlangs', 'Conlangs'),
    ]),
    new NavigationDestination('/docs', 'Documents', [
        //
        new NavigationDestination('/docs', 'Document Portal'),
        new NavigationDestination('/docs/announcements', 'Announcements'),
        new NavigationDestination('/api/docs', 'API Docs'),
    ]),
    new NavigationDestination('/credits', 'Credits'),
    new NavigationDestination('/troubleshooting', 'Troubleshooting'),
];

document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(topPanel);

    topPanel.appendChild(topPanelLinks);

    for (let destination of destinations) {
        destination.appendTo(topPanelLinks);
    }

    topPanelLogo.appendChild(topPanelLogoText);

    topPanelNavigation.appendChild(topPanelNavigationText);
    topPanelNavigation.appendChild(topPanelNavigationIcon);

    topPanel.appendChild(topPanelLogo);
    topPanel.appendChild(topPanelNavigation);

    topPanelLogo.addEventListener('click', () => {
        window.location.href = '/';
    });

    document.body.appendChild(navigationOverlay);

    navigationOverlay.appendChild(navigationPanel);

    navigationClose.appendChild(navigationCloseText);
    navigationClose.appendChild(navigationCloseIcon);
    navigationPanel.appendChild(navigationClose);

    navigationPanelNav.appendChild(navigationPanelList);
    for (let destination of destinations) {
        destination.appendTo(navigationPanelList);
    }

    navigationPanel.appendChild(navigationPanelNav);

    Array.from(document.getElementsByClassName('navigation-toggle')).forEach((button) => {
        button.addEventListener('click', () => {
            navigationOverlay.classList.toggle('active');
        });
    });
});

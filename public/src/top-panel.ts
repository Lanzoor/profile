document.addEventListener('DOMContentLoaded', () => {
    const topPanel = document.createElement('div');
    topPanel.id = 'top-panel';

    document.body.appendChild(topPanel);

    topPanel.innerHTML = `
<div id="panel-logo">
    <a href="/index.html">lanzoor.dev</a>
</div>

<div id="open-navigation" class="navigation-toggle">
    <p>Navigation</p>

    <button>
        <img src="/assets/icons/hamburger.svg" alt="">
    </button>
</div>
`;

    const navigationOverlay = document.createElement('div');
    navigationOverlay.id = 'navigation-overlay';

    navigationOverlay.innerHTML = `
<div id="navigation-panel">
    <div id="close-navigation" class="navigation-toggle">
        <p>Close</p>

        <button>
            x
        </button>
    </div>
</div>
`;
    document.body.appendChild(navigationOverlay);

    const navigationToggles = document.getElementsByClassName('navigation-toggle');
    Array.from(navigationToggles).forEach((button) => {
        button.addEventListener('click', () => {
            navigationOverlay.classList.toggle('active');
        });
    });
});

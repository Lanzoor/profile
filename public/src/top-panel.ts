const topPanel = document.createElement('div');
topPanel.id = 'top-panel';

document.body.appendChild(topPanel);

topPanel.innerHTML = `
<a id="panel-logo" href="/index.html">
    lanzoor.dev
</a>

<div id="panel-navigation">
    <p>Navigation</p>

    <button>
        <img src="/assets/icons/hamburger.svg" alt="">
    </button>
</div>
`;

const topPanel = document.createElement('div');
topPanel.id = 'top-panel';
document.body.appendChild(topPanel);

class TopPanelDestination {
    public displayName: string;
    public link: string;
    public identifier?: string;

    constructor(displayName: string, link: string, identifier?: string) {
        this.displayName = displayName;
        this.link = link;
        this.identifier = identifier;
    }

    format() {
        const idAttr = this.identifier ? `id="${this.identifier}" ` : '';
        return `<td>
    <a ${idAttr}href="${this.link}">${this.displayName}</a>
</td>`;
    }
}

const destinations: TopPanelDestination[] = [
    //
    new TopPanelDestination('lanzoor.dev', '/index.html', 'large-text'),
    new TopPanelDestination('Welcome!', '/index.html'),
    new TopPanelDestination('Profile', '/profile/index.html'),
    new TopPanelDestination('Credits', '/credits/index.html'),
    new TopPanelDestination('Documents', '/docs/index.html'),
    new TopPanelDestination('Announcements', '/docs/announcements/index.html'),
    new TopPanelDestination('Troubleshooting', '/troubleshooting/index.html'),
];

const tableHTML = `
    <table>
        <tr>
            ${destinations.map((dest) => dest.format()).join('')}
        </tr>
    </table>
`;

topPanel.innerHTML = tableHTML;

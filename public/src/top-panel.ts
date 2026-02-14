const topPanel = document.createElement('div');
topPanel.id = 'top-panel';
document.body.appendChild(topPanel);

class TopPanelDestination {
    public displayName: string;
    public link: string;
    public colspan: number;
    public identifier?: string;

    constructor(displayName: string, link: string, colspan: number = 1, identifier?: string) {
        this.displayName = displayName;
        this.link = link;
        this.colspan = colspan;
        this.identifier = identifier;
    }

    format() {
        const idAttr = this.identifier ? `id="${this.identifier}" ` : '';
        return `<td colspan="${this.colspan}">
    <a ${idAttr}href="${this.link}">${this.displayName}</a>
</td>`;
    }
}

const destinations: TopPanelDestination[] = [
    //
    new TopPanelDestination('lanzoor.dev', '/index.html', 2, 'lanzoor-dev'),
    new TopPanelDestination('Welcome!', '/index.html'),
    new TopPanelDestination('Profile', '/profile/index.html'),
    new TopPanelDestination('Credits', '/credits.html'),
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

let announcementSearchQuery = '';
let currentAnnouncementPage = 1;
const removedMessage = '- Removed by owner -';

class Announcement {
    id: string;
    link: string;
    title: string;
    private lastModified: Date;

    constructor(id: string, link: string, title: string = removedMessage, lastModified: Date = new Date()) {
        this.id = id;
        this.link = link;
        this.title = title;
        this.lastModified = lastModified;

        if (title == removedMessage) {
            this.link = '/docs/removed.html';
        }
    }

    formatDate(): string {
        return this.lastModified.toLocaleDateString('en-US', {
            // prettier, pls...
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    }
}

let announcements = [
    // keep this comment cuz prettier more like shittier
    new Announcement('0001', '/docs/announcements/0001.html'),
    new Announcement('0002', '/docs/announcements/0002.html', '<code>periodica</code> Retirement', new Date('2026-01-28')),
    new Announcement('0003', '/docs/announcements/0003.html', 'Vacation Announcement / Diary', new Date('2026-02-04')),
    new Announcement('0004', '/docs/announcements/0004.html', 'Retirement of the Old Profile Website', new Date('2026-02-07')),
    new Announcement('0005', '/docs/announcements/0005.html', 'Domain Registration Notice', new Date('2026-02-09')),
];

let descendingSort = true;
announcements.reverse();

let announcementsTable = document.getElementById('announcements-table')!;

function updateAnnouncements() {
    announcementsTable.innerHTML = `
<tr>
    <th>Link</th>
    <th id="announcements-title">Title</th>
    <th>Last Modified</th>
</tr>`;

    let foundAny = false;

    announcements.forEach((announcement) => {
        if (announcement.title.toLowerCase().includes(announcementSearchQuery.toLowerCase()) && announcement.title != 'Removed by owner') {
            foundAny = true;

            let currentRow = document.createElement('tr');

            let currentLinkTD = document.createElement('td');
            let currentLink = document.createElement('a');
            currentLink.textContent = announcement.id;
            currentLink.href = announcement.link;
            currentLinkTD.appendChild(currentLink);

            let currentTitleTD = document.createElement('td');

            if (announcement.title == removedMessage) {
                currentTitleTD.id = 'removed';
                currentTitleTD.colSpan = 2;
            }

            currentTitleTD.innerHTML = announcement.title;

            currentRow.appendChild(currentLinkTD);
            currentRow.appendChild(currentTitleTD);

            if (announcement.title != removedMessage) {
                let currentModTd = document.createElement('td');
                currentModTd.innerHTML = `<b>${announcement.formatDate()}</b>`;
                currentRow.appendChild(currentModTd);
            }

            announcementsTable.appendChild(currentRow);
        }
    });

    if (!foundAny) {
        let emptyRow = document.createElement('tr');
        let emptyCell = document.createElement('td');
        emptyCell.colSpan = 3;
        emptyCell.textContent = `No announcement found containing your search query. :C`;
        emptyCell.style.textAlign = 'center';
        emptyRow.appendChild(emptyCell);
        announcementsTable.appendChild(emptyRow);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateAnnouncements();
});

const sortButton = document.getElementById('sort-button')!;

sortButton.addEventListener('click', () => {
    descendingSort = !descendingSort;
    if (descendingSort) {
        sortButton.textContent = 'Sort: Descending';
    } else {
        sortButton.textContent = 'Sort: Ascending';
    }

    announcements.reverse();
    updateAnnouncements();
});

document.getElementById('announcements-search')!.addEventListener('input', (event) => {
    const rawQuery = event.target as HTMLInputElement;
    announcementSearchQuery = rawQuery.value;
    updateAnnouncements();
});

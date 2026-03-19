const headers = document.querySelectorAll('.anti-jpa--header');

headers.forEach((header) => {
    header.addEventListener('click', () => {
        header.querySelector('img').classList.toggle('open');

        const content = header.parentElement.querySelector('.anti-jpa--content');
        content.classList.toggle('open');

        const hr = header.parentElement.querySelector('hr');
        hr.classList.toggle('open');
    });
});

const urlButton = document.querySelector('#shameless-plug button');
const url = 'https://www.lanzoor.dev/projects/anti-JPA';

urlButton.addEventListener('click', async () => {
    urlButton.textContent = 'Copy';
    try {
        await navigator.clipboard.writeText(url);

        urlButton.textContent = 'Copied!';

        setTimeout(() => {
            urlButton.textContent = 'Copy';
        }, 2000);
    } catch (err) {
        console.error('Copy failed:', err);
    }
});

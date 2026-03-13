document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
        event.preventDefault();
        const targetElement = event.currentTarget as HTMLAnchorElement;
        const target = document.querySelector(targetElement.getAttribute('href')!);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

if (localStorage.getItem('secret') !== null) {
    localStorage.setItem('secret', 'true');
}

const privateBlock = document.getElementById('private')!;
const hidden = privateBlock.querySelector('.hidden')! as HTMLElement;
const revealed = privateBlock.querySelector('.revealed')! as HTMLElement;

let hoverTimer: NodeJS.Timeout | undefined = undefined;
let activated = false;

function activateHoverAnimation() {
    privateBlock.style.transition = 'opacity 0.3s ease, box-shadow 2s linear';
    privateBlock.style.boxShadow = '0 0 25px #000000, inset 0 0 50px #ffffff';
}

function deactivateHoverAnimation() {
    privateBlock.style.transition = 'opacity 0.3s ease, box-shadow 0.25s ease';
    privateBlock.style.boxShadow = '0 0 25px #000000';
}

privateBlock.addEventListener('mouseenter', () => {
    hidden.textContent = '( - Keep hovering... - )';

    if (!activated) {
        activateHoverAnimation();
    }

    hoverTimer = setTimeout(() => {
        deactivateHoverAnimation();
        hidden.hidden = true;
        revealed.hidden = false;
        activated = true;
    }, 2000);
});

privateBlock.addEventListener('mouseleave', () => {
    deactivateHoverAnimation();

    clearTimeout(hoverTimer);
    hoverTimer = undefined;

    if (!activated) {
        hidden.textContent = '( - Hover to reveal - )';
        hidden.hidden = false;
        revealed.hidden = true;
    }
});

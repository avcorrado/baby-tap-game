let lastPointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

function triggerAction(x, y) {
    playNiceTone();
    if (visualsEnabled) {
        const count = calmMode ? 4 : 8;
        for (let i = 0; i < count; i++) spawnParticle(x, y);
    }
}

window.addEventListener('pointermove', e => {
    lastPointer.x = e.clientX;
    lastPointer.y = e.clientY;
});

window.addEventListener('pointerdown', e => {
    // ignore clicks on UI buttons
    if (e.target.classList.contains('btn')) return;
    triggerAction(e.clientX, e.clientY);
});

window.addEventListener('keydown', e => {
    if (/^F\d{1,2}$/.test(e.key)) {
        e.preventDefault();
        return;
    }

    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'BUTTON') return;

    triggerAction(lastPointer.x, lastPointer.y);
});

// UI buttons
document.getElementById('mute').onclick = () => {
    muted = !muted;
    document.getElementById('mute').textContent = muted ? 'Unmute' : 'Mute';
    if (!calmMode) masterGain.gain.value = muted ? 0 : 0.8;
    else masterGain.gain.value = muted ? 0 : 0.5;
};

document.getElementById('fullscreen').onclick = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
};

const toggleModeBtn = document.getElementById('toggleMode');
toggleModeBtn.onclick = () => {
    calmMode = !calmMode;
    if (calmMode) {
        document.body.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-calm');
        toggleModeBtn.textContent = "Normal Mode";
        if (!muted) masterGain.gain.value = 0.5;
    } else {
        document.body.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-normal');
        toggleModeBtn.textContent = "Calm Mode";
        if (!muted) masterGain.gain.value = 0.8;
    }
};

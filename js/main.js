function triggerAction(x, y) {
    playNiceTone();
    const count = calmMode ? 4 : 8;
    for (let i = 0; i < count; i++) spawnParticle(x, y);
}

let lastPointer = { x: W / 2, y: H / 2 };
window.addEventListener('pointermove', e => {
    lastPointer.x = e.clientX;
    lastPointer.y = e.clientY;
});
window.addEventListener('keydown', () => {
    triggerAction(lastPointer.x, lastPointer.y);
});
window.addEventListener('pointerdown', e => {
    triggerAction(e.clientX, e.clientY);
});

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
const footer = document.querySelector('.footer');

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

function loop() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = getComputedStyle(document.body).backgroundColor;
    ctx.fillRect(0, 0, W, H);
    drawParticles();
    requestAnimationFrame(loop);
}
loop();
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
let W = canvas.width = innerWidth;
let H = canvas.height = innerHeight;
window.addEventListener('resize', () => {
    W = canvas.width = innerWidth;
    H = canvas.height = innerHeight;
});


const AudioContext = window.AudioContext || window.webkitAudioContext;
const ac = new AudioContext();
let masterGain = ac.createGain();
masterGain.gain.value = 0.8;
masterGain.connect(ac.destination);
let muted = false;

function resumeAudio() {
    if (ac.state !== 'running') {
        ac.resume();
    }
}

const scale = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88];

let calmMode = false;

function playNiceTone() {
    if (muted) return;
    resumeAudio();
    const note = scale[Math.floor(Math.random() * scale.length)];
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.frequency.value = note;

    if (calmMode) {
        masterGain.gain.value = 0.5; // reduce volume
        o.type = 'sine';
        g.gain.value = 0.3;
        o.connect(g);
        g.connect(masterGain);
        const now = ac.currentTime;
        g.gain.setValueAtTime(0.3, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
        o.frequency.setValueAtTime(note * 0.99, now);
        o.frequency.linearRampToValueAtTime(note * 1.01, now + 0.75);
        o.frequency.linearRampToValueAtTime(note * 0.99, now + 1.5);
        o.start(now);
        o.stop(now + 1.5);
    } else {
        masterGain.gain.value = 0.8;
        o.type = 'triangle';
        g.gain.value = 0.3;
        o.connect(g);
        g.connect(masterGain);
        const now = ac.currentTime;
        g.gain.setValueAtTime(0.3, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 1);
        o.frequency.exponentialRampToValueAtTime(note * 0.98, now + 0.5);
        o.start(now);
        o.stop(now + 1.1);
    }
}

// visuals
const particles = [];

function spawnParticle(x, y) {
    const sizeBase = 10 + Math.random() * 20;
    const size = calmMode ? sizeBase * 1.5 : sizeBase;
    const velocityFactor = calmMode ? 1.5 : 1;
    particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 4 * velocityFactor,
        vy: (Math.random() - 0.5) * 4 * velocityFactor,
        life: 80,
        size,
        hue: Math.floor(Math.random() * 360)
    });
}

function drawParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        ctx.globalAlpha = Math.max(0, p.life / 80);

        if (calmMode) {
            ctx.fillStyle = `hsl(${p.hue}, 20%, 80%)`;
        } else {
            ctx.fillStyle = `hsl(${p.hue}, 90%, 60%)`;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        if (p.life <= 0) particles.splice(i, 1);
    }
}

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

const muteBtn = document.getElementById('mute');
muteBtn.onclick = () => {
    muted = !muted;
    muteBtn.textContent = muted ? 'Unmute' : 'Mute';
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
        footer.textContent = "Calm Mode — softer colors and drone sound";
        toggleModeBtn.textContent = "Normal Mode";
        if (!muted) masterGain.gain.value = 0.5;
    } else {
        document.body.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-normal');
        footer.textContent = "Musical notes & bright visuals";
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
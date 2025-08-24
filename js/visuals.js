const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
let W = canvas.width = innerWidth;
let H = canvas.height = innerHeight;

window.addEventListener('resize', () => {
    W = canvas.width = innerWidth;
    H = canvas.height = innerHeight;
});

const particles = [];

// Visuals toggle
let visualsEnabled = true; // default ON
const toggleVisualsBtn = document.getElementById('toggleVisuals');

// Set initial button text
toggleVisualsBtn.textContent = visualsEnabled ? "Hide Visuals" : "Show Visuals";

toggleVisualsBtn.onclick = () => {
    visualsEnabled = !visualsEnabled;
    toggleVisualsBtn.textContent = visualsEnabled ? "Hide Visuals" : "Show Visuals";
    if (!visualsEnabled) {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = getComputedStyle(document.body).backgroundColor;
        ctx.fillRect(0, 0, W, H);
    }
};

function spawnParticle(x, y) {
    const sizeBase = 10 + Math.random() * 20;
    const size = calmMode ? sizeBase * 1.5 : sizeBase;
    const velocityFactor = calmMode ? 1.5 : 1;
    particles.push({
        x, y,
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
        ctx.fillStyle = calmMode ? `hsl(${p.hue}, 20%, 80%)` : `hsl(${p.hue}, 90%, 60%)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        if (p.life <= 0) particles.splice(i, 1);
    }
}

function loop() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = getComputedStyle(document.body).backgroundColor;
    ctx.fillRect(0, 0, W, H);

    if (visualsEnabled) drawParticles();

    requestAnimationFrame(loop);
}
loop();

const AudioContext = window.AudioContext || window.webkitAudioContext;
const ac = new AudioContext();
let masterGain = ac.createGain();
masterGain.gain.value = 0.8;
masterGain.connect(ac.destination);

let muted = false;
let calmMode = false;

function unlockAudio() {
    if (ac.state !== 'running') {
        ac.resume().then(() => {
            console.log('Audio unlocked on iOS');
        });
    }
}
window.addEventListener('touchstart', unlockAudio, { once: true });
window.addEventListener('pointerdown', unlockAudio, { once: true });
window.addEventListener('keydown', unlockAudio, { once: true });

function resumeAudio() {
    if (ac.state !== 'running') ac.resume();
}

const scale = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88];

function playNiceTone() {
    if (muted) return;
    resumeAudio(); // will be safe now, already unlocked on first gesture
    const note = scale[Math.floor(Math.random() * scale.length)];
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.frequency.value = note;

    if (calmMode) {
        masterGain.gain.value = 0.5;
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

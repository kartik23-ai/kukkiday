/* ==========================================================================
   PERSISTENT WEB AUDIO API SOUNDTRACK CONTROLLER WITH REALM CROSSFADE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const vinylBtn = document.getElementById('vinyl-btn');
    const musicStatusText = document.getElementById('music-status-text');
    let isPlaying = false;
    let audioCtx = null;
    let musicInterval = null;
    let mainGain = null;

    // Frequencies tailored per realm
    const realmFrequencies = {
        'index.html': [[261.63, 329.63, 392.00, 493.88], [220.00, 261.63, 329.63, 392.00]], // Cosmic Piano
        'story.html': [[196.00, 246.94, 293.66, 392.00], [164.81, 220.00, 246.94, 329.63]], // Warm Guitar/Piano
        'gallery.html': [[220.00, 277.18, 329.63, 440.00], [174.61, 220.00, 261.63, 349.23]], // Orchestral Ambience
        'letters.html': [[174.61, 220.00, 261.63, 329.63], [146.83, 174.61, 220.00, 261.63]], // Slow Candle Piano
        'garden.html': [[293.66, 369.99, 440.00, 554.37], [220.00, 293.66, 369.99, 440.00]], // Nature Breeze
        'music.html': [[261.63, 311.13, 392.00, 466.16], [207.65, 261.63, 311.13, 392.00]], // Lo-fi Lounge
        'album.html': [[196.00, 246.94, 293.66, 349.23], [164.81, 196.00, 246.94, 293.66]], // Acoustic Scrapbook
        'dreams.html': [[329.63, 415.30, 493.88, 659.25], [261.63, 329.63, 392.00, 523.25]], // Cosmic Future
        'wishes.html': [[261.63, 329.63, 392.00, 523.25], [220.00, 261.63, 329.63, 440.00]], // Lantern Festival
        'surprise.html': [[174.61, 220.00, 261.63, 349.23], [130.81, 164.81, 196.00, 261.63]], // Heartbeat Piano
        'credits.html': [[261.63, 329.63, 392.00, 493.88], [220.00, 261.63, 329.63, 392.00]]  // Replay Theme
    };

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const activeChords = realmFrequencies[currentPath] || realmFrequencies['index.html'];

    if (vinylBtn) {
        vinylBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            
            if (isPlaying) {
                vinylBtn.classList.add('playing');
                if (musicStatusText) musicStatusText.textContent = "Playing Romantic Soundtrack ❤️";
                startAmbientMelody();
            } else {
                vinylBtn.classList.remove('playing');
                if (musicStatusText) musicStatusText.textContent = "Click vinyl to play";
                stopAmbientMelody();
            }
        });
    }

    function startAmbientMelody() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        if (!mainGain) {
            mainGain = audioCtx.createGain();
            mainGain.connect(audioCtx.destination);
        }

        // Fade in volume
        mainGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
        mainGain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 1.2);

        let chordIndex = 0;

        function playChord() {
            if (!isPlaying || !audioCtx) return;
            const now = audioCtx.currentTime;
            const notes = activeChords[chordIndex];
            chordIndex = (chordIndex + 1) % activeChords.length;

            notes.forEach((freq) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);

                gain.gain.setValueAtTime(0.001, now);
                gain.gain.linearRampToValueAtTime(0.03, now + 0.9);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.9);

                osc.connect(gain);
                gain.connect(mainGain);

                osc.start(now);
                osc.stop(now + 4.0);
            });
        }

        playChord();
        musicInterval = setInterval(playChord, 3600);
    }

    function stopAmbientMelody() {
        if (mainGain && audioCtx) {
            mainGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
        }
        setTimeout(() => {
            if (musicInterval) {
                clearInterval(musicInterval);
                musicInterval = null;
            }
        }, 850);
    }
});

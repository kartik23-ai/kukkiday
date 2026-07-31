/* ==========================================================================
   AUDIO-ENGINE.JS — Cinematic Ambient Music Generator
   Unique soundscape per realm · Reverb · Arpeggios · Pads · Sub-bass
   ========================================================================== */

(function() {
    'use strict';

    let ctx = null;
    let masterGain = null;
    let reverbGain = null;
    let dryGain = null;
    let convolver = null;
    let isPlaying = false;
    let schedulerTimer = null;
    let padOscillators = [];
    let subBassOsc = null;
    let subBassGain = null;
    let currentRealm = null;
    let nextNoteTime = 0;
    let currentStep = 0;

    // ─── MUSICAL SCALES ───
    const SCALES = {
        // Major pentatonic — bright, happy
        majorPenta: [0, 2, 4, 7, 9],
        // Minor pentatonic — emotional, warm
        minorPenta: [0, 3, 5, 7, 10],
        // Dorian — jazzy, smooth
        dorian: [0, 2, 3, 5, 7, 9, 10],
        // Lydian — dreamy, magical
        lydian: [0, 2, 4, 6, 7, 9, 11],
        // Aeolian (natural minor) — nostalgic, bittersweet
        aeolian: [0, 2, 3, 5, 7, 8, 10],
        // Mixolydian — warm, sunset feel
        mixolydian: [0, 2, 4, 5, 7, 9, 10],
        // Whole tone — mysterious, cosmic
        wholeTone: [0, 2, 4, 6, 8, 10]
    };

    function midiToFreq(midi) {
        return 440 * Math.pow(2, (midi - 69) / 12);
    }

    function getScaleNote(rootMidi, scale, degree) {
        const octave = Math.floor(degree / scale.length);
        const idx = ((degree % scale.length) + scale.length) % scale.length;
        return rootMidi + scale[idx] + octave * 12;
    }

    // ─── REALM SOUNDSCAPES ───
    const realms = {
        'index.html': {
            name: 'Cosmic Romance',
            root: 60, // C4
            scale: SCALES.lydian,
            bpm: 68,
            padNotes: [48, 55, 60, 64, 67], // C3, G3, C4, E4, G4
            padWave: 'sine',
            padVolume: 0.012,
            subBass: 36, // C2
            subBassVol: 0.02,
            arpPattern: [0, 4, 7, 11, 7, 4, 0, 2],
            arpOctave: 72, // C5
            arpVolume: 0.018,
            arpWave: 'sine',
            filterFreq: 1800,
            reverbMix: 0.7,
            mood: 'wonder'
        },
        'story.html': {
            name: 'Golden Memories',
            root: 57, // A3
            scale: SCALES.aeolian,
            bpm: 72,
            padNotes: [45, 52, 57, 60, 64],
            padWave: 'sine',
            padVolume: 0.011,
            subBass: 33,
            subBassVol: 0.018,
            arpPattern: [0, 2, 4, 7, 4, 2, 5, 4],
            arpOctave: 69,
            arpVolume: 0.02,
            arpWave: 'sine',
            filterFreq: 1600,
            reverbMix: 0.65,
            mood: 'nostalgia'
        },
        'gallery.html': {
            name: 'Museum Ambience',
            root: 62, // D4
            scale: SCALES.dorian,
            bpm: 58,
            padNotes: [50, 57, 62, 65, 69],
            padWave: 'sine',
            padVolume: 0.009,
            subBass: 38,
            subBassVol: 0.015,
            arpPattern: [0, 3, 7, 10, 7, 3, 5, 3],
            arpOctave: 74,
            arpVolume: 0.014,
            arpWave: 'sine',
            filterFreq: 1400,
            reverbMix: 0.8,
            mood: 'elegance'
        },
        'letters.html': {
            name: 'Candlelight Serenade',
            root: 55, // G3
            scale: SCALES.aeolian,
            bpm: 64,
            padNotes: [43, 50, 55, 58, 62],
            padWave: 'sine',
            padVolume: 0.013,
            subBass: 31,
            subBassVol: 0.02,
            arpPattern: [0, 2, 4, 7, 9, 7, 4, 2],
            arpOctave: 67,
            arpVolume: 0.022,
            arpWave: 'sine',
            filterFreq: 1200,
            reverbMix: 0.75,
            mood: 'intimate'
        },
        'garden.html': {
            name: 'Garden of Peace',
            root: 64, // E4
            scale: SCALES.majorPenta,
            bpm: 76,
            padNotes: [52, 59, 64, 67, 71],
            padWave: 'triangle',
            padVolume: 0.01,
            subBass: 40,
            subBassVol: 0.015,
            arpPattern: [0, 2, 4, 7, 9, 7, 4, 2],
            arpOctave: 76,
            arpVolume: 0.016,
            arpWave: 'sine',
            filterFreq: 2200,
            reverbMix: 0.6,
            mood: 'peaceful'
        },
        'music.html': {
            name: 'Vintage Lounge',
            root: 58, // Bb3
            scale: SCALES.dorian,
            bpm: 82,
            padNotes: [46, 53, 58, 61, 65],
            padWave: 'triangle',
            padVolume: 0.008,
            subBass: 34,
            subBassVol: 0.022,
            arpPattern: [0, 3, 5, 7, 10, 7, 5, 3],
            arpOctave: 70,
            arpVolume: 0.02,
            arpWave: 'triangle',
            filterFreq: 2000,
            reverbMix: 0.55,
            mood: 'jazzy'
        },
        'album.html': {
            name: 'Scrapbook Memories',
            root: 60, // C4
            scale: SCALES.mixolydian,
            bpm: 66,
            padNotes: [48, 55, 60, 64, 67],
            padWave: 'sine',
            padVolume: 0.011,
            subBass: 36,
            subBassVol: 0.016,
            arpPattern: [0, 4, 7, 11, 12, 11, 7, 4],
            arpOctave: 72,
            arpVolume: 0.018,
            arpWave: 'sine',
            filterFreq: 1500,
            reverbMix: 0.7,
            mood: 'warm'
        },
        'wishes.html': {
            name: 'Lantern Festival',
            root: 65, // F4
            scale: SCALES.lydian,
            bpm: 70,
            padNotes: [53, 60, 65, 69, 72],
            padWave: 'sine',
            padVolume: 0.012,
            subBass: 41,
            subBassVol: 0.018,
            arpPattern: [0, 4, 6, 11, 7, 6, 4, 0],
            arpOctave: 77,
            arpVolume: 0.015,
            arpWave: 'sine',
            filterFreq: 2000,
            reverbMix: 0.75,
            mood: 'magical'
        },
        'surprise.html': {
            name: 'The Infinite Moment',
            root: 57, // A3
            scale: SCALES.aeolian,
            bpm: 54,
            padNotes: [45, 52, 57, 60, 64, 69],
            padWave: 'sine',
            padVolume: 0.014,
            subBass: 33,
            subBassVol: 0.025,
            arpPattern: [0, 4, 7, 12, 7, 4, 0, -5],
            arpOctave: 69,
            arpVolume: 0.022,
            arpWave: 'sine',
            filterFreq: 1100,
            reverbMix: 0.85,
            mood: 'cinematic'
        }
    };

    function getRealmKey() {
        const path = window.location.pathname.split('/').pop();
        return path || 'index.html';
    }

    // ─── CREATE REVERB IMPULSE RESPONSE ───
    function createReverb(duration, decay) {
        const sampleRate = ctx.sampleRate;
        const length = sampleRate * duration;
        const impulse = ctx.createBuffer(2, length, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const data = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                // Exponential decay with random noise
                data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
            }
        }
        return impulse;
    }

    function ensureContext() {
        if (!ctx) {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (ctx.state === 'suspended') ctx.resume();

        if (!masterGain) {
            masterGain = ctx.createGain();
            masterGain.gain.value = 0;

            // Compressor to prevent clipping
            const compressor = ctx.createDynamicsCompressor();
            compressor.threshold.value = -24;
            compressor.knee.value = 12;
            compressor.ratio.value = 4;
            compressor.attack.value = 0.005;
            compressor.release.value = 0.25;

            // Reverb setup
            convolver = ctx.createConvolver();
            convolver.buffer = createReverb(3.5, 2.2);

            reverbGain = ctx.createGain();
            reverbGain.gain.value = 0.6;

            dryGain = ctx.createGain();
            dryGain.gain.value = 0.7;

            // Routing: master -> dry -> compressor -> destination
            //                 -> convolver -> reverbGain -> compressor
            masterGain.connect(dryGain);
            masterGain.connect(convolver);
            convolver.connect(reverbGain);
            dryGain.connect(compressor);
            reverbGain.connect(compressor);
            compressor.connect(ctx.destination);
        }
    }

    // ─── LUSH PAD (layered detuned oscillators with slow filter sweep) ───
    function startPad(realm) {
        const notes = realm.padNotes || [];
        const volume = realm.padVolume || 0.01;

        notes.forEach((midi, i) => {
            const freq = midiToFreq(midi);
            
            // Two slightly detuned oscillators per note for warmth
            for (let d = 0; d < 2; d++) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const filter = ctx.createBiquadFilter();
                
                osc.type = realm.padWave || 'sine';
                osc.frequency.value = freq;
                osc.detune.value = (d === 0 ? -6 : 6) + (Math.random() - 0.5) * 4;

                filter.type = 'lowpass';
                filter.frequency.value = 800 + i * 100;
                filter.Q.value = 0.7;

                // Slow filter sweep for movement
                const sweepTime = 8 + Math.random() * 6;
                const now = ctx.currentTime;
                filter.frequency.setValueAtTime(600 + i * 80, now);
                filter.frequency.linearRampToValueAtTime(1200 + i * 100, now + sweepTime);

                // Gentle fade in
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(volume * (d === 0 ? 1 : 0.6), now + 3 + i * 0.5);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(masterGain);
                osc.start(now);

                padOscillators.push({ osc, gain, filter });
            }
        });
    }

    function stopPad() {
        const now = ctx.currentTime;
        padOscillators.forEach(({ osc, gain }) => {
            gain.gain.cancelScheduledValues(now);
            gain.gain.setValueAtTime(gain.gain.value, now);
            gain.gain.linearRampToValueAtTime(0, now + 2);
            setTimeout(() => { try { osc.stop(); } catch(e) {} }, 2500);
        });
        padOscillators = [];
    }

    // ─── SUB BASS (deep warm foundation) ───
    function startSubBass(realm) {
        if (!realm.subBass) return;
        const now = ctx.currentTime;

        subBassOsc = ctx.createOscillator();
        subBassGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        subBassOsc.type = 'sine';
        subBassOsc.frequency.value = midiToFreq(realm.subBass);
        
        filter.type = 'lowpass';
        filter.frequency.value = 120;
        filter.Q.value = 1;

        subBassGain.gain.setValueAtTime(0, now);
        subBassGain.gain.linearRampToValueAtTime(realm.subBassVol || 0.015, now + 4);

        subBassOsc.connect(filter);
        filter.connect(subBassGain);
        subBassGain.connect(masterGain);
        subBassOsc.start(now);
    }

    function stopSubBass() {
        if (!subBassOsc || !subBassGain) return;
        const now = ctx.currentTime;
        subBassGain.gain.cancelScheduledValues(now);
        subBassGain.gain.setValueAtTime(subBassGain.gain.value, now);
        subBassGain.gain.linearRampToValueAtTime(0, now + 2);
        setTimeout(() => { try { subBassOsc.stop(); } catch(e) {} }, 2500);
        subBassOsc = null;
        subBassGain = null;
    }

    // ─── ARPEGGIATOR (melodic sparkle) ───
    function playArpNote(realm) {
        if (!isPlaying || !ctx) return;
        
        const now = ctx.currentTime;
        const pattern = realm.arpPattern;
        const degree = pattern[currentStep % pattern.length];
        const midi = realm.arpOctave + degree;
        const freq = midiToFreq(midi);

        // Slight humanization
        const humanize = (Math.random() - 0.5) * 0.02;
        const velocity = 0.7 + Math.random() * 0.3;
        const vol = (realm.arpVolume || 0.015) * velocity;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = realm.arpWave || 'sine';
        osc.frequency.value = freq;
        osc.detune.value = (Math.random() - 0.5) * 5;

        filter.type = 'lowpass';
        filter.frequency.value = realm.filterFreq || 1500;
        filter.Q.value = 1.5;

        // Soft piano-like envelope
        const attackTime = 0.02;
        const decayTime = 0.3;
        const sustainLevel = vol * 0.4;
        const releaseTime = 1.5;
        const totalTime = attackTime + decayTime + releaseTime + 0.5;

        gain.gain.setValueAtTime(0.0001, now + humanize);
        gain.gain.linearRampToValueAtTime(vol, now + humanize + attackTime);
        gain.gain.exponentialRampToValueAtTime(sustainLevel + 0.0001, now + humanize + attackTime + decayTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + humanize + attackTime + decayTime + releaseTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start(now + humanize);
        osc.stop(now + humanize + totalTime);

        // Every 8 steps, add a gentle chord shimmer
        if (currentStep % 8 === 0) {
            playChordShimmer(realm);
        }

        currentStep++;
    }

    // ─── CHORD SHIMMER (every few beats, a soft chord rings out) ───
    function playChordShimmer(realm) {
        const now = ctx.currentTime;
        const chordDegrees = [0, 4, 7, 11]; // Major 7th feel
        const baseOctave = realm.arpOctave - 12;

        chordDegrees.forEach((deg, i) => {
            const midi = baseOctave + deg;
            const freq = midiToFreq(midi);

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sine';
            osc.frequency.value = freq;
            osc.detune.value = (Math.random() - 0.5) * 8;

            filter.type = 'lowpass';
            filter.frequency.value = 1200;
            filter.Q.value = 0.5;

            const vol = (realm.arpVolume || 0.015) * 0.6;
            const start = now + i * 0.08;
            
            gain.gain.setValueAtTime(0.0001, start);
            gain.gain.linearRampToValueAtTime(vol, start + 0.5);
            gain.gain.setValueAtTime(vol, start + 1.5);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + 5);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(masterGain);

            osc.start(start);
            osc.stop(start + 5.5);
        });
    }

    // ─── SCHEDULER (look-ahead scheduler for tight timing) ───
    function startScheduler(realm) {
        const secondsPerBeat = 60 / (realm.bpm || 70);
        const noteInterval = secondsPerBeat / 2; // 8th notes
        nextNoteTime = ctx.currentTime + 0.5; // small delay before first note
        currentStep = 0;

        function schedule() {
            while (nextNoteTime < ctx.currentTime + 0.1) {
                playArpNote(realm);
                nextNoteTime += noteInterval;
            }
            schedulerTimer = setTimeout(schedule, 25);
        }
        schedule();
    }

    function stopScheduler() {
        if (schedulerTimer) {
            clearTimeout(schedulerTimer);
            schedulerTimer = null;
        }
    }

    // ─── START / STOP ───
    function startSoundscape() {
        ensureContext();
        const key = getRealmKey();
        const realm = realms[key] || realms['index.html'];
        currentRealm = realm;

        // Set reverb mix
        if (reverbGain) reverbGain.gain.value = realm.reverbMix || 0.6;
        if (dryGain) dryGain.gain.value = 1 - (realm.reverbMix || 0.6) * 0.5;

        // Fade in master
        masterGain.gain.cancelScheduledValues(ctx.currentTime);
        masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 2);

        startPad(realm);
        startSubBass(realm);
        startScheduler(realm);
        isPlaying = true;
    }

    function stopSoundscape() {
        if (!ctx || !masterGain) return;
        isPlaying = false;

        masterGain.gain.cancelScheduledValues(ctx.currentTime);
        masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1.5);

        setTimeout(() => {
            stopScheduler();
            stopPad();
            stopSubBass();
        }, 1800);
    }

    // ─── INTERACTIVE SOUNDS ───
    function playHoverChirp() {
        if (!ctx || !isPlaying) return;
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        osc.type = 'sine';
        const baseFreq = 1100 + Math.random() * 600;
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.12);

        filter.type = 'lowpass';
        filter.frequency.value = 3000;
        
        gain.gain.setValueAtTime(0.006, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.2);
    }

    function playClickSound() {
        if (!ctx || !isPlaying) return;
        const now = ctx.currentTime;
        
        // Gentle bell-like click
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = 880;
        osc2.type = 'sine';
        osc2.frequency.value = 1320;
        
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
        
        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(masterGain);
        
        osc.start(now);
        osc2.start(now);
        osc.stop(now + 0.6);
        osc2.stop(now + 0.6);
    }

    // ─── BIND UI ───
    function init() {
        const vinylBtn = document.querySelector('.vinyl-btn');
        const statusEl = document.querySelector('.music-meta-status');
        const titleEl = document.querySelector('.music-meta-title');

        // Set realm-specific music title
        const key = getRealmKey();
        const realm = realms[key] || realms['index.html'];
        if (titleEl && realm.name) {
            titleEl.textContent = realm.name;
        }

        if (vinylBtn) {
            vinylBtn.addEventListener('click', () => {
                if (isPlaying) {
                    stopSoundscape();
                    vinylBtn.classList.remove('spinning');
                    if (statusEl) statusEl.textContent = 'Click to play';
                } else {
                    startSoundscape();
                    vinylBtn.classList.add('spinning');
                    if (statusEl) statusEl.textContent = 'Now Playing ♪';
                }
            });
        }

        // Bind hover chirps
        document.querySelectorAll('.btn-journey, .nav-link').forEach(el => {
            el.addEventListener('mouseenter', playHoverChirp);
        });

        // Bind click sounds to interactive elements
        document.querySelectorAll('.interactive, .tilt-card').forEach(el => {
            el.addEventListener('click', playClickSound);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose for external use
    window.AudioEngine = {
        start: startSoundscape,
        stop: stopSoundscape,
        playChirp: playHoverChirp,
        playClick: playClickSound,
        isPlaying: () => isPlaying
    };
})();

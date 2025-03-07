const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
const strings = ['E', 'A', 'D', 'G', 'B', 'E'];

let currentNote, nextNote, currentString, nextString;
let intervalId;
let audioContext;
let tempo = 25; // Default tempo

const currentNoteDisplay = document.getElementById('currentNote');
const currentStringDisplay = document.getElementById('currentString');
const nextNoteDisplay = document.getElementById('nextNote');
const nextStringDisplay = document.getElementById('nextString');
const bpmDisplay = document.getElementById('bpm');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const showStringCheckbox = document.getElementById('showString');
const consecutiveStringsCheckbox = document.getElementById('consecutiveStrings');
const previewNextCheckbox = document.getElementById('previewNext');
const reverseLayoutCheckbox = document.getElementById('reverseLayout');
const tempoSlider = document.getElementById('tempoSlider');
const muteSoundCheckbox = document.getElementById('muteSound');

function getRandomNote() {
    return notes[Math.floor(Math.random() * notes.length)];
}

function getRandomString() {
    return strings[Math.floor(Math.random() * strings.length)];
}

function playSound() {
    if (muteSoundCheckbox.checked) return;
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

function updateDisplay() {
    currentNoteDisplay.textContent = currentNote;
    currentStringDisplay.textContent = showStringCheckbox.checked ? currentString : '--';
    nextNoteDisplay.textContent = previewNextCheckbox.checked ? nextNote : '--';
    nextStringDisplay.textContent = previewNextCheckbox.checked && showStringCheckbox.checked ? nextString : '--';
    bpmDisplay.textContent = `${tempo} BPM`;
}

function startDrill() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    currentNote = getRandomNote();
    currentString = getRandomString();
    nextNote = getRandomNote();
    nextString = getRandomString();
    updateDisplay();
    playSound();
    intervalId = setInterval(() => {
        currentNote = nextNote;
        currentString = consecutiveStringsCheckbox.checked ? strings[(strings.indexOf(currentString) + 1) % strings.length] : getRandomString();
        nextNote = getRandomNote();
        nextString = consecutiveStringsCheckbox.checked ? strings[(strings.indexOf(currentString) + 1) % strings.length] : getRandomString();
        updateDisplay();
        playSound();
    }, 60000 / tempo);
}

function stopDrill() {
    clearInterval(intervalId);
    currentNoteDisplay.textContent = '--';
    currentStringDisplay.textContent = '--';
    nextNoteDisplay.textContent = '--';
    nextStringDisplay.textContent = '--';
}

startButton.addEventListener('click', startDrill);
stopButton.addEventListener('click', stopDrill);

showStringCheckbox.addEventListener('change', updateDisplay);
previewNextCheckbox.addEventListener('change', updateDisplay);
reverseLayoutCheckbox.addEventListener('change', () => {
    const noteLabel = document.getElementById('currentNoteLabel');
    const stringLabel = document.getElementById('currentStringLabel');
    if (reverseLayoutCheckbox.checked) {
        noteLabel.textContent = 'String:';
        stringLabel.textContent = 'Note:';
    } else {
        noteLabel.textContent = 'Note:';
        stringLabel.textContent = 'String:';
    }
    updateDisplay();
});

tempoSlider.addEventListener('input', () => {
    const sliderValue = parseFloat(tempoSlider.value);
    tempo = Math.round(Math.pow(10, sliderValue));
    bpmDisplay.textContent = `${tempo} BPM`;
    if (intervalId) {
        clearInterval(intervalId);
        startDrill();
    }
});

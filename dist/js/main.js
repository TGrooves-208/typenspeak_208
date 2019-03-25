// Initialize SpeechSynth API
const synth = window.speechSynthesis;

// Gather all of the DOM elements accordingly
const textForm = document.querySelector("form");
const textInput = document.querySelector("#text-input");
const voiceSelect = document.querySelector("#voice-select");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector("#rate-value");
const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector("#pitch-value");
const body = document.querySelector("body");

// Initialize the voices array accordingly
let voices = [];

// Using ES6 syntax
const getVoices = () => {
  voices = synth.getVoices();

  // Loop through voices and create an option for each one accordingly
  voices.forEach(voice => {
    // Create an option element
    const option = document.createElement("option");
    // Fill the option with the voice and the language accordingly
    option.textContent = voice.name + "(" + voice.lang + ")";

    // Set needed option attributes
    option.setAttribute("data-lang", voice.lang);
    option.setAttribute("data-name", voice.name);
    // Append
    voiceSelect.appendChild(option);
  });
};

getVoices();

if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

// Speak the language that is chosen by the user accordingly
const speak = () => {
  // Check if speaking
  if (synth.speaking) {
    console.error("Already speaking ...");
    return;
  }
  if (textInput.value !== "") {
    // Add WAV background animation
    body.style.background = "#141414 url(./dist/img/wave.gif)";
    body.style.backgroundRepeat = "repeat-x";
    body.style.backgroundSize = "100% 100%";
    // Get speak text
    const speakText = new SpeechSynthesisUtterance(textInput.value);
    //  Speak end
    speakText.onend = e => {
      console.log("Done speaking ...");
      body.style.background = "#141414";
    };

    // Speak error
    speakText.onerror = e => {
      console.error("Something went wrong");
    };

    // Select a voice that will be spoken
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
      "data-name"
    );

    // Loop through the voices
    voices.forEach(voice => {
      if (voice.name == selectedVoice) {
        speakText.voice = voice;
      }
    });

    // Set pitch and rate accordingly
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;
    // Speak
    synth.speak(speakText);
  }
};

// Set event listeners

// Text form submit
textForm.addEventListener("submit", e => {
  e.preventDefault();
  speak();
  textInput.blur();
});

// Rate value change when selected
rate.addEventListener("change", e => (rateValue.textContent = rate.value));

// Pitch value change when selected
pitch.addEventListener("change", e => (pitchValue.textContent = pitch.value));

// Voice select change
voiceSelect.addEventListener("change", e => speak());

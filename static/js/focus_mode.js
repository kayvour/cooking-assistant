document.addEventListener("DOMContentLoaded", () => {
  const instructions = JSON.parse(document.getElementById("recipe-data").textContent);
  const stepDisplay = document.getElementById("focus-step");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const repeatBtn = document.getElementById("repeatBtn");
  const voiceControlBtn = document.getElementById("voiceControlBtn");
  const voiceStatus = document.getElementById("voiceStatus");

  let currentStep = 0;
  let synth = window.speechSynthesis;

  // Setup Speech Recognition with better Brave compatibility
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  let recognizing = false;
  let shouldRestart = false;

  // Check if Speech Recognition is available and functional
  if (SpeechRecognition) {
    try {
      // Test if we can create an instance
      const testRecognition = new SpeechRecognition();
      testRecognition = null; // Clean up test instance
      recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.continuous = false;
      
      // Add extra settings for Brave compatibility
      if (recognition.grammars !== undefined) {
        // Some browsers support grammar lists
        try {
          const grammar = '#JSGF V1.0; grammar commands; public <command> = next | previous | repeat | exit;';
          const speechRecognitionList = new window.webkitSpeechGrammarList();
          speechRecognitionList.addFromString(grammar, 1);
          recognition.grammars = speechRecognitionList;
        } catch (e) {
          console.log('Grammar not supported:', e);
        }
      }

    recognition.onstart = () => {
      recognizing = true;
      shouldRestart = true;
      voiceStatus.textContent = '🎙️ Listening... Say "next", "previous", "repeat", or "exit".';
      voiceControlBtn.textContent = '⏹️ Stop Voice Control';
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      
      // Handle specific errors more gracefully
      if (event.error === 'no-speech') {
        voiceStatus.textContent = '🔇 No speech detected. Click to try again.';
        shouldRestart = false;
        voiceControlBtn.textContent = '🎤 Start Voice Control';
      } else if (event.error === 'network') {
        // Network errors are common false positives - just restart
        console.log('Network error - attempting restart');
        if (shouldRestart) {
          setTimeout(() => {
            if (shouldRestart) {
              try {
                recognition.start();
              } catch (e) {
                console.log('Restart failed:', e);
              }
            }
          }, 1000);
        }
      } else if (event.error === 'not-allowed') {
        voiceStatus.textContent = '❌ Microphone access denied. Please allow microphone access.';
        shouldRestart = false;
        voiceControlBtn.textContent = '🎤 Start Voice Control';
      } else if (event.error === 'aborted') {
        // Recognition was stopped intentionally - don't show error
        return;
      } else {
        voiceStatus.textContent = '❌ Error: ' + event.error;
        shouldRestart = false;
        voiceControlBtn.textContent = '🎤 Start Voice Control';
      }
    };

    recognition.onend = () => {
      recognizing = false;
      
      // Auto-restart if voice control is still active
      if (shouldRestart) {
        setTimeout(() => {
          if (shouldRestart) {
            try {
              recognition.start();
              voiceStatus.textContent = '🎙️ Listening... Say a command.';
            } catch (e) {
              console.error('Failed to restart recognition:', e);
              voiceStatus.textContent = '❌ Voice control stopped. Click to restart.';
              voiceControlBtn.textContent = '🎤 Start Voice Control';
              shouldRestart = false;
            }
          }
        }, 1000); // Longer delay to prevent rapid cycling
      } else {
        voiceStatus.textContent = '🛑 Voice control stopped';
        voiceControlBtn.textContent = '🎤 Start Voice Control';
      }
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        
        if (result.isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      // Show interim results
      if (interimTranscript) {
        voiceStatus.textContent = `🎧 Hearing: "${interimTranscript.trim()}"`;
      }
      
      // Process final results
      if (finalTranscript) {
        const command = finalTranscript.toLowerCase().trim();
        console.log('Final voice command:', command);
        voiceStatus.textContent = `🗣️ Processing: "${command}"`;
        
        // Simple word matching - check if any command word is present
        if (command.includes('next') || command.includes('forward')) {
          console.log('Next command triggered');
          nextBtn.click();
          voiceStatus.textContent = '✅ Moving to next step';
        } else if (command.includes('previous') || command.includes('back') || command.includes('prev')) {
          console.log('Previous command triggered');
          prevBtn.click();
          voiceStatus.textContent = '✅ Moving to previous step';
        } else if (command.includes('repeat') || command.includes('again')) {
          console.log('Repeat command triggered');
          repeatBtn.click();
          voiceStatus.textContent = '✅ Repeating current step';
        } else if (command.includes('exit') || command.includes('stop') || command.includes('quit')) {
          console.log('Exit command triggered');
          shouldRestart = false;
          recognition.stop();
          voiceStatus.textContent = '✅ Exiting...';
          setTimeout(() => {
            window.location.href = '/assistant';
          }, 500);
        } else {
          voiceStatus.textContent = `❓ Say: "next", "previous", "repeat", or "exit"`;
        }
        
        // Clear status after a moment
        setTimeout(() => {
          if (shouldRestart) {
            voiceStatus.textContent = '🎙️ Ready for next command...';
          }
        }, 2000);
      }
    };
    } catch (error) {
      console.error('Speech Recognition initialization failed:', error);
      voiceStatus.textContent = "❌ Speech Recognition not available in this browser. Try Chrome or check Brave settings.";
      voiceControlBtn.disabled = true;
    }
  } else {
    voiceStatus.textContent = "❌ Speech Recognition not supported. Try Chrome or enable Web Speech API in Brave.";
    voiceControlBtn.disabled = true;
  }

  function speak(text) {
    if (!text) return;
    if (synth.speaking) synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9; // Slightly slower for better comprehension
    synth.speak(utterance);
  }

  function updateStep() {
    currentStep = Math.min(Math.max(currentStep, 0), instructions.length - 1);
    stepDisplay.textContent = instructions[currentStep];
    speak(instructions[currentStep]);

    prevBtn.disabled = (currentStep === 0);
    nextBtn.disabled = (currentStep === instructions.length - 1);
  }

  prevBtn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      updateStep();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentStep < instructions.length - 1) {
      currentStep++;
      updateStep();
    }
  });

  repeatBtn.addEventListener("click", () => {
    speak(instructions[currentStep]);
  });

  voiceControlBtn.addEventListener("click", () => {
    if (recognizing || shouldRestart) {
      shouldRestart = false;
      recognition.stop();
      voiceStatus.textContent = '🛑 Stopping voice control...';
    } else {
      try {
        shouldRestart = true;
        recognition.start();
      } catch (e) {
        console.error('Failed to start recognition:', e);
        voiceStatus.textContent = '❌ Failed to start voice control. Try again.';
        shouldRestart = false;
      }
    }
  });

  updateStep(); // show first step initially
});
document.addEventListener("DOMContentLoaded", () => {
  // --- Dark Mode Toggle Setup ---
  const themeToggleBtn = document.querySelector(".theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const body = document.body;

  // Load saved theme from localStorage or default to light
  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme);

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = body.classList.contains("dark-mode") ? "dark" : "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  });

  function setTheme(theme) {
    if (theme === "dark") {
      body.classList.add("dark-mode");
      themeIcon.textContent = "☀️"; // sun icon for light mode
      localStorage.setItem("theme", "dark");
    } else {
      body.classList.remove("dark-mode");
      themeIcon.textContent = "🌙"; // moon icon for dark mode
      localStorage.setItem("theme", "light");
    }
  }

  // --- Timer System ---
  class SmartTimer {
    constructor() {
      this.timers = new Map();
      this.timerCounter = 0;
      this.audioContext = null;
      this.initAudio();
    }

    initAudio() {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.log('Audio context not available:', e);
      }
    }

    // Parse time from text using various patterns
    parseTimeFromText(text) {
      const timePatterns = [
        // "15 minutes", "30 mins", "2 hours"
        /(\d+(?:\.\d+)?)\s*(minute|minutes|min|mins|hour|hours|hr|hrs)\b/gi,
        // "for 20 minutes", "cook 30 mins"
        /(?:for|cook|bake|simmer|boil|fry|roast|grill|steam|sauté)\s+(?:for\s+)?(\d+(?:\.\d+)?)\s*(minute|minutes|min|mins|hour|hours|hr|hrs)\b/gi,
        // "20-30 minutes", "15 to 20 mins"
        /(\d+(?:\.\d+)?)\s*(?:-|to)\s*(\d+(?:\.\d+)?)\s*(minute|minutes|min|mins|hour|hours|hr|hrs)\b/gi,
        // "until golden brown (about 15 minutes)"
        /\((?:about|approximately|roughly)?\s*(\d+(?:\.\d+)?)\s*(minute|minutes|min|mins|hour|hours|hr|hrs)\)/gi
      ];

      const times = [];
      
      timePatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(text)) !== null) {
          const duration = parseFloat(match[1]);
          const unit = match[2].toLowerCase();
          const multiplier = (unit.includes('hour') || unit.includes('hr')) ? 60 : 1;
          const totalMinutes = duration * multiplier;
          
          if (totalMinutes > 0 && totalMinutes <= 1440) { // Max 24 hours
            times.push({
              duration: totalMinutes,
              text: match[0],
              originalText: text
            });
          }
        }
      });

      // Remove duplicates and sort by duration
      const uniqueTimes = times.filter((time, index, self) => 
        index === self.findIndex(t => Math.abs(t.duration - time.duration) < 0.1)
      ).sort((a, b) => a.duration - b.duration);

      return uniqueTimes;
    }

    // Create timer UI element
    createTimerElement(timeInfo, timerId) {
      const timerContainer = document.createElement('div');
      timerContainer.className = 'timer-container';
      timerContainer.id = `timer-${timerId}`;
      
      const minutes = Math.floor(timeInfo.duration);
      const seconds = Math.round((timeInfo.duration - minutes) * 60);
      
      timerContainer.innerHTML = `
        <div class="timer-header">
          <span class="timer-label">⏱️ ${timeInfo.text}</span>
          <button class="timer-close" onclick="smartTimer.removeTimer(${timerId})">✖️</button>
        </div>
        <div class="timer-display">
          <span class="timer-time">${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}</span>
          <div class="timer-progress">
            <div class="timer-progress-bar" style="width: 100%"></div>
          </div>
        </div>
        <div class="timer-controls">
          <button class="timer-btn timer-start" onclick="smartTimer.startTimer(${timerId})">▶️ Start</button>
          <button class="timer-btn timer-pause" onclick="smartTimer.pauseTimer(${timerId})" style="display: none;">⏸️ Pause</button>
          <button class="timer-btn timer-reset" onclick="smartTimer.resetTimer(${timerId})">🔄 Reset</button>
        </div>
      `;
      
      return timerContainer;
    }

    // Add timer to the UI
    addTimer(timeInfo) {
      const timerId = ++this.timerCounter;
      const totalSeconds = Math.round(timeInfo.duration * 60);
      
      this.timers.set(timerId, {
        id: timerId,
        duration: timeInfo.duration,
        totalSeconds: totalSeconds,
        remainingSeconds: totalSeconds,
        isRunning: false,
        isPaused: false,
        interval: null,
        text: timeInfo.text
      });

      const timerElement = this.createTimerElement(timeInfo, timerId);
      const timerSection = document.getElementById('timer-section');
      timerSection.appendChild(timerElement);
      timerSection.style.display = 'block';

      return timerId;
    }

    // Start a timer
    startTimer(timerId) {
      const timer = this.timers.get(timerId);
      if (!timer || timer.isRunning) return;

      timer.isRunning = true;
      timer.isPaused = false;

      const timerElement = document.getElementById(`timer-${timerId}`);
      const startBtn = timerElement.querySelector('.timer-start');
      const pauseBtn = timerElement.querySelector('.timer-pause');
      
      startBtn.style.display = 'none';
      pauseBtn.style.display = 'inline-block';

      timer.interval = setInterval(() => {
        timer.remainingSeconds--;
        this.updateTimerDisplay(timerId);

        if (timer.remainingSeconds <= 0) {
          this.completeTimer(timerId);
        }
      }, 1000);

      // Voice feedback
      if (typeof speak === 'function') {
        speak(`Timer started for ${timer.text}`);
      }
    }

    // Pause a timer
    pauseTimer(timerId) {
      const timer = this.timers.get(timerId);
      if (!timer || !timer.isRunning) return;

      timer.isRunning = false;
      timer.isPaused = true;
      clearInterval(timer.interval);

      const timerElement = document.getElementById(`timer-${timerId}`);
      const startBtn = timerElement.querySelector('.timer-start');
      const pauseBtn = timerElement.querySelector('.timer-pause');
      
      startBtn.style.display = 'inline-block';
      startBtn.textContent = '▶️ Resume';
      pauseBtn.style.display = 'none';
    }

    // Reset a timer
    resetTimer(timerId) {
      const timer = this.timers.get(timerId);
      if (!timer) return;

      timer.isRunning = false;
      timer.isPaused = false;
      timer.remainingSeconds = timer.totalSeconds;
      clearInterval(timer.interval);

      const timerElement = document.getElementById(`timer-${timerId}`);
      const startBtn = timerElement.querySelector('.timer-start');
      const pauseBtn = timerElement.querySelector('.timer-pause');
      
      startBtn.style.display = 'inline-block';
      startBtn.textContent = '▶️ Start';
      pauseBtn.style.display = 'none';

      this.updateTimerDisplay(timerId);
    }

    // Remove a timer
    removeTimer(timerId) {
      const timer = this.timers.get(timerId);
      if (timer) {
        clearInterval(timer.interval);
        this.timers.delete(timerId);
      }

      const timerElement = document.getElementById(`timer-${timerId}`);
      if (timerElement) {
        timerElement.remove();
      }

      // Hide timer section if no timers left
      if (this.timers.size === 0) {
        document.getElementById('timer-section').style.display = 'none';
      }
    }

    // Update timer display
    updateTimerDisplay(timerId) {
      const timer = this.timers.get(timerId);
      if (!timer) return;

      const timerElement = document.getElementById(`timer-${timerId}`);
      const timeDisplay = timerElement.querySelector('.timer-time');
      const progressBar = timerElement.querySelector('.timer-progress-bar');

      const minutes = Math.floor(timer.remainingSeconds / 60);
      const seconds = timer.remainingSeconds % 60;
      
      timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      const progress = (timer.remainingSeconds / timer.totalSeconds) * 100;
      progressBar.style.width = `${Math.max(0, progress)}%`;

      // Change color when timer is almost done
      if (timer.remainingSeconds <= 60) {
        timerElement.classList.add('timer-warning');
      }
      if (timer.remainingSeconds <= 10) {
        timerElement.classList.add('timer-critical');
      }
    }

    // Complete a timer
    completeTimer(timerId) {
      const timer = this.timers.get(timerId);
      if (!timer) return;

      clearInterval(timer.interval);
      timer.isRunning = false;
      timer.remainingSeconds = 0;

      const timerElement = document.getElementById(`timer-${timerId}`);
      timerElement.classList.add('timer-completed');

      // Play notification sound
      this.playNotificationSound();

      // Voice notification
      if (typeof speak === 'function') {
        speak(`Timer finished for ${timer.text}`);
      }

      // Visual notification
      this.showTimerNotification(timer);

      // Auto-remove completed timer after 10 seconds
      setTimeout(() => {
        this.removeTimer(timerId);
      }, 10000);
    }

    // Play notification sound
    playNotificationSound() {
      if (!this.audioContext) return;

      try {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
      } catch (e) {
        console.log('Could not play notification sound:', e);
      }
    }

    // Show timer notification
    showTimerNotification(timer) {
      const notification = document.createElement('div');
      notification.className = 'timer-notification';
      notification.innerHTML = `
        <div class="notification-content">
          <span class="notification-icon">⏰</span>
          <span class="notification-text">Timer finished: ${timer.text}</span>
          <button class="notification-close" onclick="this.parentElement.parentElement.remove()">✖️</button>
        </div>
      `;
      
      document.body.appendChild(notification);
      
      // Auto-remove notification after 5 seconds
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 5000);
    }

    // Process step for timers
    processStepForTimers(stepText) {
      const existingTimers = document.querySelectorAll('.timer-container');
      existingTimers.forEach(timer => timer.remove());
      this.timers.clear();

      const detectedTimes = this.parseTimeFromText(stepText);
      
      if (detectedTimes.length > 0) {
        detectedTimes.forEach(timeInfo => {
          this.addTimer(timeInfo);
        });
        
        // Show suggestion to user
        const timerSuggestion = document.getElementById('timer-suggestion');
        if (timerSuggestion) {
          timerSuggestion.textContent = `⏱️ ${detectedTimes.length} timer${detectedTimes.length > 1 ? 's' : ''} detected in this step`;
          timerSuggestion.style.display = 'block';
        }
      } else {
        const timerSection = document.getElementById('timer-section');
        timerSection.style.display = 'none';
        const timerSuggestion = document.getElementById('timer-suggestion');
        if (timerSuggestion) {
          timerSuggestion.style.display = 'none';
        }
      }
    }
  }

  // Initialize timer system
  const smartTimer = new SmartTimer();
  window.smartTimer = smartTimer; // Make it globally accessible for onclick events

  // --- Focus Mode Cooking Assistant Logic (your existing code) ---
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

  if (SpeechRecognition) {
    try {
      const testRecognition = new SpeechRecognition();
      recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.continuous = false;

      if (recognition.grammars !== undefined) {
        try {
          const grammar = '#JSGF V1.0; grammar commands; public <command> = next | previous | repeat | exit | start timer | stop timer | pause timer;';
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
        voiceStatus.textContent = '🎙️ Listening... Say "next", "previous", "repeat", "start timer", or "exit".';
        voiceControlBtn.textContent = '⏹️ Stop Voice Control';
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);

        if (event.error === 'no-speech') {
          voiceStatus.textContent = '🔇 No speech detected. Click to try again.';
          shouldRestart = false;
          voiceControlBtn.textContent = '🎤 Start Voice Control';
        } else if (event.error === 'network') {
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
          return;
        } else {
          voiceStatus.textContent = '❌ Error: ' + event.error;
          shouldRestart = false;
          voiceControlBtn.textContent = '🎤 Start Voice Control';
        }
      };

      recognition.onend = () => {
        recognizing = false;
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
          }, 1000);
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

        if (interimTranscript) {
          voiceStatus.textContent = `🎧 Hearing: "${interimTranscript.trim()}"`;
        }

        if (finalTranscript) {
          const command = finalTranscript.toLowerCase().trim();
          console.log('Final voice command:', command);
          voiceStatus.textContent = `🗣️ Processing: "${command}"`;

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
          } else if (command.includes('start timer') || command.includes('begin timer')) {
            console.log('Start timer command triggered');
            const activeTimers = Array.from(smartTimer.timers.values()).filter(t => !t.isRunning);
            if (activeTimers.length > 0) {
              smartTimer.startTimer(activeTimers[0].id);
              voiceStatus.textContent = '✅ Timer started';
            } else {
              voiceStatus.textContent = '❓ No timers available to start';
            }
          } else if (command.includes('stop timer') || command.includes('pause timer')) {
            console.log('Stop/pause timer command triggered');
            const runningTimers = Array.from(smartTimer.timers.values()).filter(t => t.isRunning);
            if (runningTimers.length > 0) {
              smartTimer.pauseTimer(runningTimers[0].id);
              voiceStatus.textContent = '✅ Timer paused';
            } else {
              voiceStatus.textContent = '❓ No running timers to stop';
            }
          } else if (command.includes('exit') || command.includes('stop') || command.includes('quit')) {
            console.log('Exit command triggered');
            shouldRestart = false;
            recognition.stop();
            voiceStatus.textContent = '✅ Exiting...';
            setTimeout(() => {
              window.location.href = '/assistant';
            }, 500);
          } else {
            voiceStatus.textContent = '❓ Say: "next", "previous", "repeat", "start timer", or "exit"';
          }

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
    utterance.rate = 0.9;
    synth.speak(utterance);
  }

  // Make speak function globally accessible
  window.speak = speak;

  function updateStep() {
    currentStep = Math.min(Math.max(currentStep, 0), instructions.length - 1);
    stepDisplay.textContent = instructions[currentStep];
    speak(instructions[currentStep]);

    // Process step for timers
    smartTimer.processStepForTimers(instructions[currentStep]);

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

  updateStep();
});
let currentInput = "0";
let calculationHistory = [];
let currentTheme = "light";
let quizMode = false;
let currentQuiz = null;

function playSound(frequency = 440, duration = 100) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = "sine";

  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + duration / 1000
  );

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration / 1000);
}
function updateDisplay() {
  document.getElementById("display").textContent = currentInput;
}

function addToDisplay(value) {
  playSound(500, 50);

  if (currentInput === "0" && value !== ".") {
    currentInput = value;
  } else {
    currentInput += value;
  }
  updateDisplay();
}

function clearDisplay() {
  playSound(300, 50);
  currentInput = "0";
  updateDisplay();
  document.getElementById("emojiResult").textContent = "";
}
function calculate() {
  try {
    playSound(600, 100);
    let expression = currentInput.replace(/×/g, "*").replace(/÷/g, "/");
    if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
      throw new Error("Invalid expression");
    }

    let result = eval(expression);
    addToHistory(`${currentInput} = ${result}`);
    showEmojiReaction(result);

    currentInput = result.toString();
    updateDisplay();
  } catch (error) {
    showError("Invalid calculation! 😅");
  }
}

// Advanced math functions
function calculatePower() {
  try {
    let num = parseFloat(currentInput);
    let result = Math.pow(num, 2);
    addToHistory(`${num}² = ${result}`);
    currentInput = result.toString();
    updateDisplay();
    showEmojiReaction(result);
    playSound(700, 100);
  } catch (error) {
    showError("Invalid number! 😅");
  }
}

function calculateSqrt() {
  try {
    let num = parseFloat(currentInput);
    if (num < 0) {
      showError("Cannot calculate square root of negative number! 😅");
      return;
    }
    let result = Math.sqrt(num);
    addToHistory(`√${num} = ${result}`);
    currentInput = result.toString();
    updateDisplay();
    showEmojiReaction(result);
    playSound(700, 100);
  } catch (error) {
    showError("Invalid number! 😅");
  }
}

function calculateFactorial() {
  try {
    let num = parseInt(currentInput);
    if (num < 0) {
      showError("Cannot calculate factorial of negative number! 😅");
      return;
    }
    if (num > 20) {
      showError("Number too large for factorial! 😅");
      return;
    }

    let result = 1;
    for (let i = 2; i <= num; i++) {
      result *= i;
    }

    addToHistory(`${num}! = ${result}`);
    currentInput = result.toString();
    updateDisplay();
    showEmojiReaction(result);
    playSound(700, 100);
  } catch (error) {
    showError("Invalid number! 😅");
  }
}

function generateRandom() {
  let min = prompt("Enter minimum number:") || 1;
  let max = prompt("Enter maximum number:") || 100;

  min = parseInt(min);
  max = parseInt(max);

  if (min > max) {
    [min, max] = [max, min];
  }

  let result = Math.floor(Math.random() * (max - min + 1)) + min;
  addToHistory(`Random(${min}-${max}) = ${result}`);
  currentInput = result.toString();
  updateDisplay();
  showEmojiReaction(result);
  playSound(800, 100);
}

function temperatureConverter() {
  let temp = prompt("Enter temperature:") || 0;
  let unit = prompt("Enter unit (C/F):").toUpperCase() || "C";

  temp = parseFloat(temp);
  let result, convertedUnit;

  if (unit === "C") {
    result = (temp * 9) / 5 + 32;
    convertedUnit = "F";
  } else if (unit === "F") {
    result = ((temp - 32) * 5) / 9;
    convertedUnit = "C";
  } else {
    showError("Invalid unit! Use C or F 😅");
    return;
  }

  addToHistory(`${temp}°${unit} = ${result.toFixed(1)}°${convertedUnit}`);
  currentInput = result.toFixed(1);
  updateDisplay();
  showEmojiReaction(result);
  playSound(700, 100);
}

function currencyConverter() {
  // Simplified currency converter (you can add real API later)
  let amount = prompt("Enter amount:") || 1;
  let fromCurrency =
    prompt("From currency (USD/EUR/INR):").toUpperCase() || "USD";
  let toCurrency = prompt("To currency (USD/EUR/INR):").toUpperCase() || "EUR";

  amount = parseFloat(amount);

  // Simplified exchange rates
  const rates = {
    USD: { EUR: 0.85, INR: 75, USD: 1 },
    EUR: { USD: 1.18, INR: 88, EUR: 1 },
    INR: { USD: 0.013, EUR: 0.011, INR: 1 },
  };

  if (rates[fromCurrency] && rates[fromCurrency][toCurrency]) {
    let result = amount * rates[fromCurrency][toCurrency];
    addToHistory(
      `${amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`
    );
    currentInput = result.toFixed(2);
    updateDisplay();
    showEmojiReaction(result);
    playSound(700, 100);
  } else {
    showError("Invalid currency! 😅");
  }
}

// Quiz Mode
function startQuiz() {
  quizMode = true;
  generateQuiz();
}

function generateQuiz() {
  const operations = ["+", "-", "*", "/"];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  const num1 = Math.floor(Math.random() * 20) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;

  let question, answer;

  switch (operation) {
    case "+":
      question = `${num1} + ${num2}`;
      answer = num1 + num2;
      break;
    case "-":
      question = `${num1} - ${num2}`;
      answer = num1 - num2;
      break;
    case "*":
      question = `${num1} × ${num2}`;
      answer = num1 * num2;
      break;
    case "/":
      question = `${num1} ÷ ${num2}`;
      answer = num1 / num2;
      break;
  }

  currentQuiz = { question, answer };
  document.getElementById("display").textContent = question;

  setTimeout(() => {
    let userAnswer = prompt(`What is ${question}?`);
    checkQuizAnswer(userAnswer, answer);
  }, 100);
}

function checkQuizAnswer(userAnswer, correctAnswer) {
  userAnswer = parseFloat(userAnswer);

  if (userAnswer === correctAnswer) {
    showEmojiReaction("🎉 Correct! 🎉");
    playSound(800, 200);
    addToHistory(`Quiz: ${currentQuiz.question} = ${userAnswer} ✅`);
  } else {
    showEmojiReaction("❌ Wrong! ❌");
    playSound(300, 200);
    addToHistory(
      `Quiz: ${currentQuiz.question} = ${userAnswer} ❌ (Correct: ${correctAnswer})`
    );
  }

  setTimeout(() => {
    if (confirm("Want another quiz?")) {
      generateQuiz();
    } else {
      quizMode = false;
      currentInput = "0";
      updateDisplay();
    }
  }, 2000);
}

// Voice Input (using Web Speech API)
function startVoiceInput() {
  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      document.getElementById("display").textContent = "Listening...";
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      processVoiceInput(transcript);
    };

    recognition.onerror = () => {
      showError("Voice recognition failed! 😅");
    };

    recognition.start();
  } else {
    showError("Voice recognition not supported! 😅");
  }
}

function processVoiceInput(transcript) {
  // Convert speech to mathematical expression
  let expression = transcript
    .toLowerCase()
    .replace("plus", "+")
    .replace("minus", "-")
    .replace("times", "*")
    .replace("multiplied by", "*")
    .replace("divided by", "/")
    .replace("equals", "=")
    .replace(/\s/g, "");
  const numbers = expression.match(/\d+/g);
  const operators = expression.match(/[+\-*/]/g);

  if (numbers && numbers.length >= 2 && operators && operators.length >= 1) {
    currentInput = numbers[0] + operators[0] + numbers[1];
    updateDisplay();
    calculate();
  } else {
    showError("Could not understand voice input! 😅");
  }
}
function toggleTheme() {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  document.body.style.background =
    currentTheme === "dark"
      ? "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)"
      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

  document.querySelector(".theme-toggle").textContent =
    currentTheme === "dark" ? "☀️" : "🌙";
}
function showEmojiReaction(result) {
  const emojiResult = document.getElementById("emojiResult");
  let emoji = "😊";

  if (typeof result === "number") {
    if (result > 1000) emoji = "🤯";
    else if (result > 100) emoji = "😎";
    else if (result > 10) emoji = "😄";
    else if (result < 0) emoji = "😅";
    else if (result === 0) emoji = "😐";
  } else if (typeof result === "string") {
    emoji = result;
  }

  emojiResult.textContent = emoji;
  setTimeout(() => {
    emojiResult.textContent = "";
  }, 2000);
}
function showError(message) {
  document.getElementById("emojiResult").textContent = message;
  setTimeout(() => {
    document.getElementById("emojiResult").textContent = "";
  }, 3000);
}
function addToHistory(calculation) {
  calculationHistory.unshift(calculation);
  if (calculationHistory.length > 10) {
    calculationHistory.pop();
  }
  updateHistory();
}

function updateHistory() {
  const historyDiv = document.getElementById("history");
  historyDiv.innerHTML =
    '<div style="text-align: center; color: #999;">Calculation History</div>';

  calculationHistory.forEach((item) => {
    const historyItem = document.createElement("div");
    historyItem.className = "history-item";
    historyItem.textContent = item;
    historyDiv.appendChild(historyItem);
  });
}

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if ((key >= "0" && key <= "9") || key === ".") {
    addToDisplay(key);
  } else if (key === "+" || key === "-") {
    addToDisplay(key);
  } else if (key === "*") {
    addToDisplay("×");
  } else if (key === "/") {
    addToDisplay("÷");
  } else if (key === "Enter" || key === "=") {
    calculate();
  } else if (key === "Escape") {
    clearDisplay();
  }
});
updateDisplay();

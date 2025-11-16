// =========================================
// ScoreSight - Main Script
// =========================================

// API Base URL - Configure for production deployment
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8000'
  : 'https://scoresight-backend.onrender.com';  // Your Render backend URL
const API_URL = `${API_BASE}/api`;

// Get base URL for frontend navigation (works on any server)
function getBaseUrl() {
  const href = window.location.href;
  return href.substring(0, href.lastIndexOf('/'));
}

// Auth check on page load
document.addEventListener('DOMContentLoaded', function() {
  // Determine current page
  const href = window.location.href;
  const currentPage = href.substring(href.lastIndexOf('/') + 1).split('?')[0] || 'login.html';
  
  console.log('📄 Current page:', currentPage);
  console.log('🔐 Login status:', localStorage.getItem('loginStatus'));
  console.log('👤 Current user:', localStorage.getItem('currentUser'));
  
  // Protected pages - redirect to login if not authenticated
  const protectedPages = ['dashboard.html', 'predict.html', 'ai_predictor.html'];
  const isProtected = protectedPages.includes(currentPage);
  
  if (isProtected) {
    const loginStatus = localStorage.getItem('loginStatus');
    if (loginStatus !== 'true') {
      console.log('⛔ Not logged in, redirecting to login page');
      window.location.href = 'login.html';
      return;
    }
  }
  
  // Initialize page-specific scripts
  if (currentPage === 'login.html') {
    initLoginPage();
  } else if (currentPage === 'signup.html') {
    initSignupPage();
  } else if (currentPage === 'dashboard.html') {
    initDashboardPage();
  } else if (currentPage === 'predict.html') {
    initPredictPage();
  } else if (currentPage === 'ai_predictor.html') {
    initAIPredictorPage();
  }
});

// =========================================
// LOGIN PAGE
// =========================================

function initLoginPage() {
  const form = document.getElementById('loginForm');
  if (form) {
    form.addEventListener('submit', handleLogin);
  }
}

async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const alertDiv = document.getElementById('loginAlert');
  
  // Clear previous alerts
  alertDiv.innerHTML = '';
  
  // Validation
  if (!email || !password) {
    showAlert(alertDiv, 'Please fill in all fields.', 'danger');
    return;
  }
  
  // Retrieve stored credentials from localStorage
  const storedEmail = localStorage.getItem('userEmail');
  const storedPassword = localStorage.getItem('userPassword');
  const storedName = localStorage.getItem('userName');
  
  console.log('Login attempt:', { email, storedEmail });
  
  // Validate credentials
  if (email === storedEmail && password === storedPassword) {
    // Login successful
    localStorage.setItem('loginStatus', 'true');
    localStorage.setItem('currentUser', storedName);
    
    console.log('✅ Login successful!');
    showAlert(alertDiv, `✅ Welcome back, ${storedName}!`, 'success');
    
    setTimeout(() => {
      console.log('Redirecting to dashboard...');
      window.location.href = 'dashboard.html';
    }, 500);
  } else {
    // Login failed
    console.log('❌ Login failed - invalid credentials');
    showAlert(alertDiv, '❌ Invalid email or password. Please try again.', 'danger');
  }
}

// =========================================
// SIGNUP PAGE
// =========================================

function initSignupPage() {
  const form = document.getElementById('signupForm');
  if (form) {
    form.addEventListener('submit', handleSignup);
  }
}

async function handleSignup(e) {
  e.preventDefault();
  
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value.trim();
  const passwordConfirm = document.getElementById('signupPasswordConfirm').value.trim();
  const alertDiv = document.getElementById('signupAlert');
  
  // Clear previous alerts
  alertDiv.innerHTML = '';
  
  // Validation
  if (!name || !email || !password || !passwordConfirm) {
    showAlert(alertDiv, 'Please fill in all fields.', 'danger');
    return;
  }
  
  if (password !== passwordConfirm) {
    showAlert(alertDiv, 'Passwords do not match.', 'danger');
    return;
  }
  
  if (password.length < 6) {
    showAlert(alertDiv, 'Password must be at least 6 characters long.', 'danger');
    return;
  }
  
  // Save user credentials to localStorage
  localStorage.setItem('userName', name);
  localStorage.setItem('userEmail', email);
  localStorage.setItem('userPassword', password);
  
  console.log('✅ User registered:', { name, email });
  
  showAlert(alertDiv, '✅ Account created successfully! Please log in.', 'success');
  
  setTimeout(() => {
    console.log('Redirecting to login page...');
    window.location.href = 'login.html';
  }, 1200);
}

// =========================================
// DASHBOARD PAGE
// =========================================

function initDashboardPage() {
  const userName = localStorage.getItem('userName') || localStorage.getItem('currentUser');
  
  console.log('🏠 Initializing dashboard for user:', userName);
  
  if (userName) {
    // Update all welcome name elements with smooth animation
    const welcomeElements = document.querySelectorAll('#welcomeName');
    welcomeElements.forEach(element => {
      // Add fade-in animation
      element.style.opacity = '0';
      element.style.transition = 'opacity 0.8s ease-in-out';
      element.textContent = userName;
      // Trigger animation
      setTimeout(() => {
        element.style.opacity = '1';
      }, 100);
    });
  }
  
  // Setup logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  // Setup navigation links
  const predictLink = document.getElementById('predictMatchLink');
  if (predictLink) {
    predictLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'predict.html';
    });
  }
  
  const aiPredictorLink = document.getElementById('aiPredictorLink');
  if (aiPredictorLink) {
    aiPredictorLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'ai_predictor.html';
    });
  }
  
  // Setup action cards
  const predictCard = document.getElementById('predictCard');
  if (predictCard) {
    predictCard.addEventListener('click', () => {
      window.location.href = 'predict.html';
    });
  }
  
  const aiCard = document.getElementById('aiCard');
  if (aiCard) {
    aiCard.addEventListener('click', () => {
      window.location.href = 'ai_predictor.html';
    });
  }
}

function handleLogout() {
  console.log('Logging out...');
  localStorage.removeItem('loginStatus');
  localStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

// =========================================
// AI PREDICTOR PAGE
// =========================================

function initAIPredictorPage() {
  const userName = localStorage.getItem('userName') || localStorage.getItem('currentUser');
  if (userName) {
    const userNameSpan = document.getElementById('userNameNav');
    if (userNameSpan) {
      userNameSpan.textContent = userName;
    }
  }
  
  // Setup logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  // Setup AI Predictor link in navbar
  const aiPredictorLink = document.getElementById('aiPredictorLink');
  if (aiPredictorLink) {
    aiPredictorLink.removeEventListener('click', navClickHandler);
  }
}

// =========================================
// PREDICT PAGE
// =========================================

const epl_teams = [
  'Arsenal', 'Aston Villa', 'Bournemouth', 'Brighton', 'Chelsea',
  'Crystal Palace', 'Everton', 'Fulham', 'Ipswich', 'Leicester',
  'Liverpool', 'Manchester City', 'Manchester United', 'Newcastle',
  'Nottingham', 'Southampton', 'Tottenham', 'West Ham', 'Wolves'
];

function initPredictPage() {
  const userName = localStorage.getItem('userName') || localStorage.getItem('currentUser');
  if (userName) {
    const userNameSpan = document.getElementById('userNameNav');
    if (userNameSpan) {
      userNameSpan.textContent = userName;
    }
  }
  
  // Setup logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  // Populate team dropdowns
  populateTeamDropdowns();
  
  // Setup predict form
  const predictForm = document.getElementById('predictForm');
  if (predictForm) {
    predictForm.addEventListener('submit', handlePredictSubmit);
  }
  
  // Set minimum date to today
  const dateInput = document.getElementById('matchDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }
}

function populateTeamDropdowns() {
  const homeTeam = document.getElementById('homeTeam');
  const awayTeam = document.getElementById('awayTeam');
  
  epl_teams.forEach(team => {
    const option1 = document.createElement('option');
    option1.value = team;
    option1.textContent = team;
    homeTeam.appendChild(option1);
    
    const option2 = document.createElement('option');
    option2.value = team;
    option2.textContent = team;
    awayTeam.appendChild(option2);
  });
}

async function handlePredictSubmit(e) {
  e.preventDefault();
  
  const homeTeam = document.getElementById('homeTeam').value;
  const awayTeam = document.getElementById('awayTeam').value;
  const matchDate = document.getElementById('matchDate').value;
  
  // Validation
  if (!homeTeam || !awayTeam || !matchDate) {
    alert('Please fill in all required fields.');
    return;
  }
  
  if (homeTeam === awayTeam) {
    alert('Home and Away teams must be different.');
    return;
  }
  
  // Collect all statistics
  const predictionData = {
    home_team: homeTeam,
    away_team: awayTeam,
    match_date: matchDate,
    HTHG: parseInt(document.getElementById('HTHG').value) || 0,
    HTAG: parseInt(document.getElementById('HTAG').value) || 0,
    HS: parseInt(document.getElementById('HS').value) || 0,
    AS: parseInt(document.getElementById('AS').value) || 0,
    HST: parseInt(document.getElementById('HST').value) || 0,
    AST: parseInt(document.getElementById('AST').value) || 0,
    HC: parseInt(document.getElementById('HC').value) || 0,
    AC: parseInt(document.getElementById('AC').value) || 0,
    HF: parseInt(document.getElementById('HF').value) || 0,
    AF: parseInt(document.getElementById('AF').value) || 0,
    HY: parseInt(document.getElementById('HY').value) || 0,
    AY: parseInt(document.getElementById('AY').value) || 0,
    HR: parseInt(document.getElementById('HR').value) || 0,
    AR: parseInt(document.getElementById('AR').value) || 0
  };
  
  // Show loading state
  const resultCard = document.getElementById('resultCard');
  resultCard.innerHTML = '<div class="loading"><div class="spinner"></div><p>Analyzing match statistics and predicting outcome...</p></div>';
  resultCard.classList.add('show');
  
  try {
    const response = await fetch(`${API_URL}/predict_v2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(predictionData)
    });
    
    if (!response.ok) {
      throw new Error('Prediction failed');
    }
    
    const data = await response.json();
    displayPredictionResult(homeTeam, awayTeam, matchDate, data);
    
  } catch (error) {
    console.error('Predict error:', error);
    resultCard.innerHTML = '<p style="color: #ff6b6b; text-align: center; padding: 20px;">❌ Error predicting match. Please check your input and try again.</p>';
  }
}

function displayPredictionResult(homeTeam, awayTeam, matchDate, data) {
  const resultCard = document.getElementById('resultCard');
  const outcome = data.outcome; // "Home Win", "Away Win", or "Draw"
  const probabilities = data.probabilities; // {home_win, draw, away_win}
  const homeGoals = data.home_goals;
  const awayGoals = data.away_goals;
  const homePoints = data.home_points;
  const awayPoints = data.away_points;
  const goalDiff = data.goal_difference;
  
  // Determine outcome text and color
  let outcomeText = '';
  let outcomeClass = '';
  if (outcome === 'Home Win') {
    outcomeText = `🏆 ${homeTeam} Win`;
    outcomeClass = 'outcome-home';
  } else if (outcome === 'Away Win') {
    outcomeText = `🔴 ${awayTeam} Win`;
    outcomeClass = 'outcome-away';
  } else {
    outcomeText = '🤝 Draw';
    outcomeClass = 'outcome-draw';
  }
  
  // Get max confidence from probabilities object
  const homeWinProb = (probabilities.home_win * 100).toFixed(1);
  const drawProb = (probabilities.draw * 100).toFixed(1);
  const awayWinProb = (probabilities.away_win * 100).toFixed(1);
  const maxConfidence = Math.max(probabilities.home_win, probabilities.draw, probabilities.away_win);
  const confidencePercent = (maxConfidence * 100).toFixed(1);
  
  const formattedDate = new Date(matchDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  resultCard.innerHTML = `
    <div class="result-match-info">${homeTeam} vs ${awayTeam}</div>
    <div class="result-date">📅 ${formattedDate}</div>
    
    <div class="result-outcome ${outcomeClass}">
      ${outcomeText}
    </div>
    
    <div class="confidence-section">
      <div class="confidence-label">
        <span>Prediction Confidence</span>
        <span>${confidencePercent}%</span>
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="width: ${confidencePercent}%"></div>
      </div>
    </div>
    
    <div class="probability-breakdown">
      <h4 style="margin-bottom: 15px; color: #00d4ff; font-size: 0.95rem; text-align: center;">📊 Win Probabilities</h4>
      <div class="prob-item">
        <div class="prob-label">
          <span>🏠 ${homeTeam} Win</span>
          <span class="prob-value">${homeWinProb}%</span>
        </div>
        <div class="prob-bar">
          <div class="prob-fill" style="width: ${homeWinProb}%; background: linear-gradient(90deg, #00d4ff, #00a8cc);"></div>
        </div>
      </div>
      <div class="prob-item">
        <div class="prob-label">
          <span>🤝 Draw</span>
          <span class="prob-value">${drawProb}%</span>
        </div>
        <div class="prob-bar">
          <div class="prob-fill" style="width: ${drawProb}%; background: linear-gradient(90deg, #ffd700, #ffa500);"></div>
        </div>
      </div>
      <div class="prob-item">
        <div class="prob-label">
          <span>✈️ ${awayTeam} Win</span>
          <span class="prob-value">${awayWinProb}%</span>
        </div>
        <div class="prob-bar">
          <div class="prob-fill" style="width: ${awayWinProb}%; background: linear-gradient(90deg, #ff6b6b, #ee5a6f);"></div>
        </div>
      </div>
    </div>
    
    <div class="result-stats">
      <div class="stat-item">
        <label>🏠 Home Goals</label>
        <div class="value">${homeGoals}</div>
      </div>
      <div class="stat-item">
        <label>✈️ Away Goals</label>
        <div class="value">${awayGoals}</div>
      </div>
      <div class="stat-item">
        <label>🏠 Home Points</label>
        <div class="value">${homePoints}</div>
      </div>
      <div class="stat-item">
        <label>✈️ Away Points</label>
        <div class="value">${awayPoints}</div>
      </div>
      <div class="stat-item">
        <label>⚖️ Goal Difference</label>
        <div class="value">${goalDiff > 0 ? '+' : ''}${goalDiff.toFixed(2)}</div>
      </div>
      <div class="stat-item">
        <label>🎯 Confidence</label>
        <div class="value">${confidencePercent}%</div>
      </div>
    </div>
  `;
  
  resultCard.classList.add('show');
}

// =========================================
// UTILITY FUNCTIONS
// =========================================

function showAlert(element, message, type) {
  const alertHtml = `
    <div class="alert alert-${type}" role="alert">
      ${message}
    </div>
  `;
  element.innerHTML = alertHtml;
}

// =========================================
// INITIALIZE CHATBOX
// =========================================

document.addEventListener('DOMContentLoaded', function() {
  initChatbox();
});

function initChatbox() {
  const chatIcon = document.getElementById('chatIcon');
  const chatPopup = document.getElementById('chatPopup');
  const chatClose = document.getElementById('chatClose');
  const chatSend = document.getElementById('chatSend');
  const chatInput = document.getElementById('chatInput');
  
  if (!chatIcon) return;
  
  // Toggle chat popup
  chatIcon.addEventListener('click', () => {
    chatPopup.classList.toggle('show');
    if (chatPopup.classList.contains('show')) {
      setTimeout(() => {
        chatInput.focus();
      }, 100);
    }
  });
  
  // Close chat
  if (chatClose) {
    chatClose.addEventListener('click', () => {
      chatPopup.classList.remove('show');
    });
  }
  
  // Send message
  if (chatSend) {
    chatSend.addEventListener('click', sendChatMessage);
  }
  
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendChatMessage();
      }
    });
  }
}

function sendChatMessage() {
  const chatInput = document.getElementById('chatInput');
  const chatBody = document.getElementById('chatBody');
  const userMessage = chatInput.value.trim();
  
  if (!userMessage) return;
  
  // Add user message
  const userMsgDiv = document.createElement('div');
  userMsgDiv.className = 'chat-message user';
  userMsgDiv.innerHTML = `<div class="chat-text">${escapeHtml(userMessage)}</div>`;
  chatBody.appendChild(userMsgDiv);
  
  // Clear input
  chatInput.value = '';
  
  // Auto-scroll to bottom
  chatBody.scrollTop = chatBody.scrollHeight;
  
  // Show typing indicator
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-message bot';
  typingDiv.id = 'typingIndicator';
  typingDiv.innerHTML = `<div class="chat-text"><em style="opacity: 0.7; font-style: italic;">ScoreSight Assistant is typing...</em></div>`;
  chatBody.appendChild(typingDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
  
  // Generate bot response
  const botResponse = generateBotResponse(userMessage);
  
  // Simulate typing delay (400-600ms for natural feel)
  const typingDelay = 400 + Math.random() * 200;
  
  // Add bot response after typing delay
  setTimeout(() => {
    // Remove typing indicator
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
      indicator.remove();
    }
    
    // Add actual bot response
    const botMsgDiv = document.createElement('div');
    botMsgDiv.className = 'chat-message bot';
    botMsgDiv.innerHTML = `<div class="chat-text">${escapeHtml(botResponse)}</div>`;
    chatBody.appendChild(botMsgDiv);
    
    // Auto-scroll to bottom
    chatBody.scrollTop = chatBody.scrollHeight;
  }, typingDelay);
}

function generateBotResponse(userMessage) {
  const message = userMessage.toLowerCase().trim();
  
  // ====================================
  // 1️⃣ GREETING ENGINE with variations
  // ====================================
  const greetings = {
    patterns: [
      /^(hi|hii|hiii|hey|hello|yo|sup|hola|wassup|heya|howdy)$/i,
      /^(hi|hey|hello)\s+(there|bro|buddy|mate|friend|dude)$/i,
      /^good\s+(morning|afternoon|evening|night)$/i,
    ],
    responses: [
      "Hi! 👋 Welcome to ScoreSight — how can I help you today?",
      "Hello! 😊 What match would you like to predict today?",
      "Hey there! ⚽ Ready for some EPL insights?",
      "Hi! 🔥 Let's predict some match outcomes together!",
      "Hello! ✨ Welcome to your EPL prediction assistant!",
      "Hey! 😊 What can I do for you?",
      "Yo! ⚽ Ready to dive into some football predictions?",
      "Good to see you! 👋 How can I assist with match predictions?",
      "Hey there! 🌟 Let's get started with some EPL action!",
      "Hi! Hope you're ready for some accurate predictions! ⚽"
    ]
  };
  
  for (const pattern of greetings.patterns) {
    if (pattern.test(message)) {
      return getRandomResponse(greetings.responses);
    }
  }
  
  // Good morning/afternoon/evening special handling
  if (message.includes('good morning')) {
    const morningReplies = [
      "Good morning! ☀️ Hope you're ready for some EPL predictions!",
      "Morning! 🌅 Let's make today's match predictions count!",
      "Good morning! ⚽ Ready to predict some winners today?"
    ];
    return getRandomResponse(morningReplies);
  }
  
  if (message.includes('good afternoon')) {
    const afternoonReplies = [
      "Good afternoon! 🌤️ Ready for some football insights?",
      "Afternoon! ⚽ Let's predict some matches!",
      "Good afternoon! What EPL match can I help you with?"
    ];
    return getRandomResponse(afternoonReplies);
  }
  
  if (message.includes('good evening') || message.includes('good night')) {
    const eveningReplies = [
      "Good evening! 🌙 Perfect time for match predictions!",
      "Evening! ⚽ Let's see what matches we can predict tonight!",
      "Good evening! Ready to analyze some EPL action?"
    ];
    return getRandomResponse(eveningReplies);
  }
  
  // ====================================
  // 2️⃣ FRIENDLY SMALL TALK
  // ====================================
  const smallTalk = {
    'how are you': [
      "I'm doing great, thanks! Ready to help with predictions ⚽", 
      "Fantastic! Always excited to talk football! How about you?",
      "I'm awesome! 😊 Ready to predict some matches for you!"
    ],
    'whats up': [
      "Just here helping predict EPL matches! What's up with you? ⚽",
      "Not much! Ready to analyze some football data for you! 😊",
      "All good! Looking forward to helping you with predictions!"
    ],
    'thank': [
      "You're very welcome! 😊 Anytime!",
      "My pleasure! ⚽ Happy to help!",
      "No problem at all! Let me know if you need anything else! ✨",
      "Glad I could help! 👍"
    ],
    'thanks': [
      "You're welcome! 😊",
      "Anytime! ⚽ Happy predicting!",
      "My pleasure! 🌟"
    ],
    'love you': [
      "Aww thanks! 😊 Let's get some match predictions going!",
      "Love helping you with predictions too! ⚽💙",
      "You're awesome! Let's predict some winners! 🔥"
    ],
    'you are cool': [
      "Thanks! 😎 You're pretty cool too!",
      "Aww, appreciate it! ⚽ You're cooler!",
      "Thanks! 🌟 Now let's make some cool predictions!"
    ],
    'you are awesome': [
      "Thanks so much! 😊 You're awesome too!",
      "You're making me blush! ✨ Let's predict some matches!",
      "Appreciate it! ⚽ Now let's find some winners!"
    ],
    'bye': [
      "Goodbye! 👋 Come back soon for more predictions!",
      "See you later! ⚽ Good luck with your matches!",
      "Bye! 😊 Happy predicting!"
    ],
    'ok': [
      "Great! 👍 Anything else I can help with?",
      "Perfect! Let me know if you need anything else! ⚽",
      "Sounds good! 😊"
    ],
    'yes': [
      "Awesome! 🔥 What would you like to know?",
      "Great! How can I assist you? ⚽",
      "Perfect! 😊 I'm here to help!"
    ],
    'no': [
      "No problem! Let me know if you need anything! 😊",
      "Okay! I'm here if you change your mind! ⚽",
      "Alright! Feel free to ask anytime! 👍"
    ]
  };
  
  for (const [keyword, responses] of Object.entries(smallTalk)) {
    if (message.includes(keyword)) {
      return getRandomResponse(responses);
    }
  }
  
  // ====================================
  // 3️⃣ FAQ RESPONSES (Enhanced with fuzzy matching)
  // ====================================
  const faqResponses = {
    'how does scoresight work': {
      keywords: ['how does', 'how it works', 'what does scoresight do', 'explain', 'tell me about'],
      answer: 'ScoreSight predicts EPL match outcomes using AI trained on historical match data. Our machine learning model analyzes team performance, stats, and patterns to forecast match results with high accuracy. ⚽📊'
    },
    'accuracy': {
      keywords: ['accurate', 'accuracy', 'how accurate', 'success rate', 'correct', 'reliable'],
      answer: 'Our current model achieves about 75% accuracy on historical test data. This includes correct prediction of match outcomes (win/draw/loss) and suggested scorelines. Pretty solid, right? 🎯'
    },
    'trust': {
      keywords: ['trust', 'reliable', 'can i trust', 'should i trust', 'believable'],
      answer: 'These are probabilistic predictions, not guaranteed outcomes. Football is inherently unpredictable, but our model consistently achieves 75%+ accuracy on test data. Use these predictions as guidance, not guarantees! ⚽✨'
    },
    'who built': {
      keywords: ['who built', 'who made', 'creator', 'developer', 'team'],
      answer: 'The ScoreSight Team – a group of data scientists and developers passionate about combining machine learning with sports analytics! 👨‍💻⚽'
    },
    'teams': {
      keywords: ['teams', 'which teams', 'what teams', 'clubs', 'available teams'],
      answer: 'You can predict matches for all 19 Premier League teams, including Arsenal, Chelsea, Liverpool, Manchester City, Manchester United, Tottenham, and many more! ⚽🏆'
    },
    'how to use': {
      keywords: ['how to use', 'how do i', 'predict match', 'make prediction', 'get started'],
      answer: 'Simply head to the Predict Match page, fill in the match statistics (teams, shots, corners, fouls, cards), and click "Predict Match Outcome". Our AI will forecast the result and suggested scoreline instantly! 🚀⚽'
    },
    'features': {
      keywords: ['features', 'what can you do', 'capabilities', 'functions'],
      answer: 'I can help you predict EPL match outcomes, explain how our AI works, share accuracy stats, and guide you through using the predictor. Just ask away! 😊⚽'
    },
    'data': {
      keywords: ['data', 'statistics', 'stats', 'what data'],
      answer: 'Our model uses 15+ match statistics including shots, shots on target, corners, fouls, yellow/red cards, and half-time scores to make accurate predictions! 📊⚽'
    }
  };
  
  // Check FAQ with fuzzy matching
  for (const [category, faq] of Object.entries(faqResponses)) {
    for (const keyword of faq.keywords) {
      if (message.includes(keyword)) {
        return faq.answer;
      }
    }
  }
  
  // ====================================
  // 4️⃣ FALLBACK RESPONSES (Human-like)
  // ====================================
  const fallbackResponses = [
    "Hmm… I'm not sure about that 🤔 but I can help you with EPL match predictions!",
    "Interesting! I don't have the answer to that, but I can predict football matches for you! ⚽",
    "That's a great question! I'm mainly focused on EPL predictions, but feel free to ask about that! 😊",
    "I'm not entirely sure about that, but ScoreSight is here to help predict EPL match outcomes! Feel free to ask me about how the predictions work, team data, or accuracy! ⚽✨",
    "Good question! I specialize in football predictions. Want to know about our AI accuracy or how to use the predictor? 🔥",
    "I'm still learning! 😊 But I'm great at predicting EPL matches. Ask me about teams, accuracy, or how it works!",
    "Hmm, not my area of expertise! But I can tell you all about EPL match predictions! ⚽📊"
  ];
  
  return getRandomResponse(fallbackResponses);
}

// Helper function to get random response
function getRandomResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

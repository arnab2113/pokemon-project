
function openFeature(id) {
    document.getElementById('dashboard').style.display = 'none';
    document.querySelectorAll('.feature-view').forEach(view => view.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function goHome() {
    document.querySelectorAll('.feature-view').forEach(view => view.classList.remove('active'));
    document.getElementById('dashboard').style.display = 'grid';
}

const themeToggleBtn = document.getElementById('theme-toggle');

if(localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
}

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' };
    document.getElementById('date-time-display').innerText = now.toLocaleString('en-US', options);
}

setInterval(updateDateTime, 60000);
updateDateTime();

async function fetchWeather(lat, lon, locationName = "Current Location") {
    const weatherDisplay = document.getElementById('weather-display');
    const locationDisplay = document.getElementById('location-display');
    
    try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await res.json();
        
        weatherDisplay.innerText = `${data.current_weather.temperature}°C, Wind: ${data.current_weather.windspeed}km/h`;
        locationDisplay.innerText = `📍 ${locationName}`;
    } catch (err) {
        weatherDisplay.innerText = "Weather unavailable";
        locationDisplay.innerText = "📍 Location unknown";
    }
}

function getLocationAndWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                try {
                    const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
                    const geoData = await geoRes.json();
                    
                    const city = geoData.city || geoData.locality || geoData.principalSubdivision || "Current Location";
                    fetchWeather(lat, lon, city);
                } catch (e) {
                    fetchWeather(lat, lon, "Current Location");
                }
            },
            (error) => {
                console.warn("Geolocation blocked or failed. Using fallback location.");
                fetchWeather(28.6139, 77.2090, "New Delhi");
            }
        );
    } else {
        fetchWeather(28.6139, 77.2090, "New Delhi");
    }
}
let todos = JSON.parse(localStorage.getItem('todos')) || [];
const todoListEl = document.getElementById('todo-list');
const todoInput = document.getElementById('todo-input');

function renderTodos() {
    todoListEl.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        if (todo.completed) li.classList.add('completed');
        li.innerHTML = `
            <span onclick="toggleTodo(${index})" style="cursor:pointer; flex:1;">${todo.text}</span>
            <button class="delete-btn" onclick="deleteTodo(${index})">✕</button>
        `;
        todoListEl.appendChild(li);
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function addTodo() {
    const text = todoInput.value.trim();
    if(text) {
        todos.push({ text, completed: false });
        todoInput.value = '';
        renderTodos();
    }
}

todoInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') addTodo();
});

function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    renderTodos();
}

function deleteTodo(index) {
    todos.splice(index, 1);
    renderTodos();
}

let pomodoroTimer;
let timeLeft = 25 * 60; 
let isRunning = false;

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer-display').innerText = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    pomodoroTimer = setInterval(() => {
        if(timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(pomodoroTimer);
            isRunning = false;
            alert("Session Complete! Take a break.");
        }
    }, 1000);
}

function pauseTimer() { 
    clearInterval(pomodoroTimer); 
    isRunning = false;
}

function resetTimer() {
    clearInterval(pomodoroTimer);
    isRunning = false;
    timeLeft = 25 * 60;
    updateTimerDisplay();
}
async function fetchQuote() {
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    quoteText.innerText = "Fetching inspiration...";
    quoteAuthor.innerText = "";
    try {
        const res = await fetch('https://dummyjson.com/quotes/random');
        const data = await res.json();
        quoteText.innerText = `"${data.quote}"`;
        quoteAuthor.innerText = `- ${data.author}`;
    } catch (err) {
        quoteText.innerText = "Believe you can and you're halfway there.";
        quoteAuthor.innerText = "- Theodore Roosevelt";
    }
}

let goals = JSON.parse(localStorage.getItem('goals')) || [];
const goalsListEl = document.getElementById('goals-list');
const goalInput = document.getElementById('goal-input');

function renderGoals() {
    goalsListEl.innerHTML = '';
    let completedCount = 0;
    
    goals.forEach((goal, index) => {
        if(goal.completed) completedCount++;
        const li = document.createElement('li');
        if(goal.completed) li.classList.add('completed');
        li.innerHTML = `
            <span onclick="toggleGoal(${index})" style="cursor:pointer; flex:1;">${goal.text}</span>
            <button class="delete-btn" onclick="deleteGoal(${index})">✕</button>
        `;
        goalsListEl.appendChild(li);
    });
    
    document.getElementById('goal-progress').innerText = `Progress: ${completedCount} of ${goals.length} completed`;
    localStorage.setItem('goals', JSON.stringify(goals));
}

function addGoal() {
    if(goalInput.value.trim()) {
        goals.push({ text: goalInput.value.trim(), completed: false });
        goalInput.value = '';
        renderGoals();
    }
}

goalInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') addGoal();
});

function toggleGoal(index) { 
    goals[index].completed = !goals[index].completed; 
    renderGoals(); 
}

function deleteGoal(index) { 
    goals.splice(index, 1); 
    renderGoals(); 
}


const plannerListEl = document.getElementById('planner-list');
let plannerData = JSON.parse(localStorage.getItem('plannerData')) || {};

function renderPlanner() {
    plannerListEl.innerHTML = '';
    for(let i = 8; i <= 18; i++) {
        const timeLabel = i > 12 ? `${i-12} PM` : (i === 12 ? `12 PM` : `${i} AM`);
        const blockId = `hour-${i}`;
        
        const slotDiv = document.createElement('div');
        slotDiv.className = 'time-slot';
        slotDiv.innerHTML = `
            <div class="time-label">${timeLabel}</div>
            <input type="text" id="${blockId}" value="${plannerData[blockId] || ''}" placeholder="Plan for ${timeLabel}..." onchange="savePlanner('${blockId}')">
        `;
        plannerListEl.appendChild(slotDiv);
    }
}

function savePlanner(blockId) {
    const inputVal = document.getElementById(blockId).value;
    plannerData[blockId] = inputVal;
    localStorage.setItem('plannerData', JSON.stringify(plannerData));
}

document.addEventListener('DOMContentLoaded', () => {
    getLocationAndWeather();
    renderTodos();
    renderGoals();
    renderPlanner();
    updateTimerDisplay();
    fetchQuote();
});
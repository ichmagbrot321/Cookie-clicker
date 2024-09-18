// Deine Firebase-Konfigurationsdaten
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialisiere Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let cookies = 0;
let cookiesPerClick = 1;
let cursorCost = 10;
let grandmaCost = 100;
let multiplierCost = 50;
let cursors = 0;
let grandmas = 0;
let multiplier = 1;
let achievementsUnlocked = [];

// HTML-Elemente
const cookieElement = document.getElementById('cookie');
const goldenCookieElement = document.getElementById('golden-cookie');
const counterElement = document.getElementById('counter');
const messageElement = document.getElementById('message');
const cursorCostElement = document.getElementById('cursorCost');
const grandmaCostElement = document.getElementById('grandmaCost');
const multiplierCostElement = document.getElementById('multiplierCost');
const achievementsListElement = document.getElementById('achievements-list');
const cheaterMessageElement = document.getElementById('cheater-message');

// Click auf den Cookie
cookieElement.addEventListener('click', () => {
    cookies += cookiesPerClick * multiplier;
    updateDisplay();
    checkAchievements();
    saveGame(); // Daten speichern nach jedem Klick
});

// Click auf den goldenen Cookie
goldenCookieElement.addEventListener('click', () => {
    cookies += 500; // Golden Cookie Bonus
    updateDisplay();
    messageElement.textContent = 'Du hast den goldenen Cookie gefunden!';
    goldenCookieElement.style.display = 'none'; // Verstecke den goldenen Cookie nach dem Klick
    saveGame(); // Daten speichern nach dem Klick
});

// Zeige den goldenen Cookie zufällig an
setInterval(() => {
    let randomChance = Math.random();
    if (randomChance < 0.1) { // 10% Chance
        goldenCookieElement.style.display = 'block';
    }
}, 10000); // Alle 10 Sekunden überprüfen

// Update der Cookie-Anzeige
function updateDisplay() {
    counterElement.textContent = 'Cookies: ' + cookies;
}

// Überprüfe die Erfolge
function checkAchievements() {
    const thresholds = {
        100: "Erste 100 Cookies!",
        1000: "Erste 1000 Cookies!",
        10000: "Cookie-Meister!"
    };

    for (let threshold in thresholds) {
        if (cookies >= threshold && !achievementsUnlocked.includes(threshold)) {
            achievementsUnlocked.push(threshold);
            unlockAchievement(thresholds[threshold]);
        }
    }
}

// Erfolg freischalten
function unlockAchievement(name) {
    let li = document.createElement('li');
    li.textContent = name;
    achievementsListElement.appendChild(li);
    messageElement.textContent = `Achievement freigeschaltet: ${name}`;
    saveGame(); // Daten speichern nach dem Freischalten eines Erfolgs
}

// Cursor kaufen
function buyCursor() {
    if (cookies >= cursorCost) {
        cookies -= cursorCost;
        cursors++;
        cursorCost = Math.floor(cursorCost * 1.5); // Preis nach dem Kauf erhöhen
        cursorCostElement.textContent = cursorCost;
        setInterval(() => {
            cookies += cursors;
            updateDisplay();
            checkAchievements();
            saveGame(); // Daten speichern nach jeder automatischen Hinzufügung
        }, 2000);
        updateDisplay();
        messageElement.textContent = '';
    } else {
        messageElement.textContent = 'Nicht genug Cookies!';
    }
}

// Oma kaufen
function buyGrandma() {
    if (cookies >= grandmaCost) {
        cookies -= grandmaCost;
        grandmas++;
        grandmaCost = Math.floor(grandmaCost * 1.5);
        grandmaCostElement.textContent = grandmaCost;
        setInterval(() => {
            cookies += grandmas * 10;
            updateDisplay();
            checkAchievements();
            saveGame(); // Daten speichern nach jeder automatischen Hinzufügung
        }, 1000);
        updateDisplay();
        messageElement.textContent = '';
    } else {
        messageElement.textContent = 'Nicht genug Cookies!';
    }
}

// Multiplikator kaufen
function buyMultiplier() {
    if (cookies >= multiplierCost) {
        cookies -= multiplierCost;
        multiplier *= 2; // Klicks verdoppeln
        multiplierCost = Math.floor(multiplierCost * 2);
        multiplierCostElement.textContent = multiplierCost;
        updateDisplay();
        messageElement.textContent = '';
        saveGame(); // Daten speichern nach dem Kauf
    } else {
        messageElement.textContent = 'Nicht genug Cookies!';
    }
}

// Daten speichern
function saveGame() {
    const userId = 'user'; // Hier könntest du eine echte Benutzer-ID verwenden
    const data = {
        cookies,
        cursors,
        grandmas,
        multiplier,
        cursorCost,
        grandmaCost,
        multiplierCost,
        achievementsUnlocked
    };
    database.ref('users/' + userId).set(data);
}

// Daten laden
function loadGame() {
    const userId = 'user'; // Hier könntest du eine echte Benutzer-ID verwenden
    database.ref('users/' + userId).once('value').then(snapshot => {
        const data = snapshot.val();
        if (data) {
            cookies = data.cookies || 0;
            cursors = data.cursors || 0;
            grandmas = data.grandmas || 0;
            multiplier = data.multiplier || 1;
            cursorCost = data.cursorCost || 10;
            grandmaCost = data.grandmaCost || 100;
            multiplierCost = data.multiplierCost || 50;
            achievementsUnlocked = data.achievementsUnlocked || [];
            updateDisplay();
            cursorCostElement.textContent = cursorCost;
            grandmaCostElement.textContent = grandmaCost;
            multiplierCostElement.textContent = multiplierCost;
            checkAchievements();
        }
    });
}

// Lade das Spiel beim Start
loadGame();

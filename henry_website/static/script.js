var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let styleSheet = document.createElement("style");
document.head.appendChild(styleSheet);
const theNumber = document.getElementById('number');
const personalNumber = document.getElementById('personal');
;
function increment() {
    fetch('/increment', {
        method: 'POST'
    })
        .then(response => response.json())
        .then(data => {
        theNumber.innerText = `Henry has been pet : ${data.number} times!`;
    });
    myPats = myPats + 1;
    updateSelf();
}
function updateSelf() {
    personalNumber.innerText = `You have pet him : ${myPats} times!`;
    document.getElementById('user-score').innerText = `${myPats}`;
}
function getLeaderboard() {
    return __awaiter(this, void 0, void 0, function* () {
        const leaderboardData = yield fetch('/get_leaderboard');
        return yield leaderboardData.json();
    });
}
function getSelfPats() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('/get_user_pets');
        const data = yield response.json();
        return data.userCount;
    });
}
function syncNumber() {
    return __awaiter(this, void 0, void 0, function* () {
        fetch('/get_number')
            .then(response => response.json())
            .then(data => {
            theNumber.innerText = `Henry has been pet : ${data.number} times!`;
        });
        var newBoard = yield getLeaderboard();
        setupLeaderboard(newBoard);
    });
}
var sampleData = [
    { displayName: "Aspect", pets: 7600 },
    { displayName: "Nathan", pets: 650 }
];
function prepareLeaderboardData(data) {
    return data.sort(compare);
}
function compare(a, b) {
    return b.count - a.count;
}
function setupLeaderboard(data) {
    var _a;
    document.getElementById('leaderboard-container').innerHTML = "";
    var table = document.createElement('table');
    console.log(data.length);
    console.log(data[0].display_name);
    var header = document.createElement('tr');
    var placeHeader = document.createElement('th');
    placeHeader.textContent = "Place";
    header.appendChild(placeHeader);
    var displayNameHeader = document.createElement('th');
    displayNameHeader.textContent = "Display Name";
    header.appendChild(displayNameHeader);
    var petCountHeader = document.createElement('th');
    petCountHeader.textContent = "Times Pet";
    header.appendChild(petCountHeader);
    table.appendChild(header);
    for (var i = 0; i < data.length - 1; i++) {
        var row = document.createElement('tr');
        var place = i + 1;
        var placeString = "#" + data[i].rank.toString();
        var placeContainer = document.createElement('td');
        placeContainer.textContent = placeString;
        row.appendChild(placeContainer);
        var displayNameContainer = document.createElement('td');
        displayNameContainer.textContent = data[i].display_name;
        row.appendChild(displayNameContainer);
        var petsContainer = document.createElement('td');
        petsContainer.textContent = data[i].count.toString();
        if (data[i].display_name == myDisplayName) {
            var rootStyle = getComputedStyle(document.documentElement);
            var colorScheme = rootStyle.getPropertyValue('--color-scheme').trim();
            row.id = "userRow";
            row.style.fontWeight = 'bold';
            petsContainer.id = "user-score";
        }
        row.appendChild(petsContainer);
        table.appendChild(row);
    }
    if (data[i].rank > 10) {
        var tableFooter = document.createElement('tfoot');
        var yourStatsRow = document.createElement('tr');
        var placeString = "#" + data[i].rank.toString();
        var placeContainer = document.createElement('td');
        placeContainer.textContent = placeString;
        yourStatsRow.appendChild(placeContainer);
        var displayNameContainer = document.createElement('td');
        displayNameContainer.textContent = data[i].display_name;
        yourStatsRow.appendChild(displayNameContainer);
        var petsContainer = document.createElement('td');
        petsContainer.textContent = data[i].count.toString();
        petsContainer.id = "user-score";
        yourStatsRow.appendChild(petsContainer);
        tableFooter.appendChild(yourStatsRow);
        table.appendChild(tableFooter);
    }
    (_a = document.getElementById('leaderboard-container')) === null || _a === void 0 ? void 0 : _a.appendChild(table);
}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
var myPats;
var myDisplayName = getCookie("display_name");
var honkAudio = new Audio('../static/honk.mp3');
var boomAudio = new Audio('../static/boom.mp3');
(() => __awaiter(this, void 0, void 0, function* () {
    myPats = yield getSelfPats();
    console.log(myPats);
    var bruh = yield getLeaderboard();
    console.log(bruh);
    syncNumber();
    setInterval(syncNumber, 600);
}))();
let colorSchemes = ["#9426fc", "#28c99e", "#c97c28", "#c92828", "#282dc9", "#4b9e2c", "#d814db", "#2a53c1", "#871010"];
var currentColorScheme = 0;
selectColorScheme(0);
function getDimmedColor(hex, dimAmount) {
    var rgb = [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
    var r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0;
    var s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0; // achromatic
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    l = Math.max(0, 1 - dimAmount);
    return `hsl(${h * 360}, ${s * 100}%, ${l * 100}%`;
}
function selectColorScheme(scheme) {
    document.documentElement.style.setProperty('--color-scheme', colorSchemes[scheme]);
    document.body.style.backgroundColor = getDimmedColor(colorSchemes[scheme], 0.95);
    styleSheet.sheet.insertRule(`button:active { background-color: ${colorSchemes[scheme]}30; }`, 0);
}
function changeColorSchme(direction) {
    currentColorScheme = currentColorScheme + direction;
    if (currentColorScheme >= colorSchemes.length) {
        currentColorScheme = 0;
    }
    else if (currentColorScheme < 0) {
        currentColorScheme = colorSchemes.length - 1;
    }
    document.documentElement.style.setProperty('--color-scheme', colorSchemes[currentColorScheme]);
}
function scoldUserForSinfulAction() {
    boomAudio.currentTime = 0.25;
    boomAudio.play();
    var foxDiv = document.createElement('div');
    foxDiv.style.backgroundImage = "url('../static/togif.png')";
    foxDiv.style.position = 'fixed';
    foxDiv.style.top = '0';
    foxDiv.style.left = '0';
    foxDiv.style.width = '100%';
    foxDiv.style.height = '100%';
    foxDiv.style.backgroundSize = '100% 100%';
    document.body.appendChild(foxDiv);
}
function praiseUserForHolyAction() {
    honkAudio.currentTime = 0;
    honkAudio.play();
}
function getCoordinateDistance(c1, c2) {
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y; // i love pythagorie
    const dist = Math.sqrt(dx * dx + dy * dy);
    console.log(dist);
    return dist;
}
const illegalRadius = 35;
const happyTouchRadius = 15;
const illegalArea = { x: 158, y: 495 };
const happyArea = { x: 138, y: 225 };
const petSection = document.getElementById('pet-section');
if (petSection) {
    petSection.addEventListener('click', function (clickEvent) {
        const clickPos = {
            x: clickEvent.offsetX,
            y: clickEvent.offsetY
        };
        if (getCoordinateDistance(clickPos, illegalArea) <= illegalRadius) {
            scoldUserForSinfulAction();
            return;
        }
        if (getCoordinateDistance(clickPos, happyArea) <= happyTouchRadius) {
            praiseUserForHolyAction();
        }
        //alert(`${x},${y}`);
        increment();
    });
}

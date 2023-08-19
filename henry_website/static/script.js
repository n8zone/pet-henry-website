let styleSheet = document.createElement("style");
document.head.appendChild(styleSheet);

function increment() {
    fetch('/increment', {
	method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
	document.getElementById('number').innerText = `Henry has been pet : ${data.number} times!`;
    });
    myPats = myPats + 1
    updateSelf()
}

function updateSelf() {
    document.getElementById('personal').innerText = `You have pet him : ${myPats} times!`;
}

async function getLeaderboard(){
    const response = await fetch('/get_leaderboard')
    const data = await response.json()
    return data
}

async function getSelfPats() {
    const response = await fetch('/get_user_pets')
    const data = await response.json()
    return data.userCount;
}

async function syncNumber() {
    fetch('/get_number')
    .then(response => response.json())
    .then(data => {
        document.getElementById('number').innerText = `Henry has been pet : ${data.number} times!`;
    });
    var newBoard = await getLeaderboard()
    setupLeaderboard(newBoard);
}

var sampleData = [
    {displayName : "Aspect", pets : 7600},
    {displayName : "Nathan", pets : 650}
];

function prepareLeaderboardData(data) {
    return data.sort(compare)
}

function compare(a, b) {
    return b.pets - a.pets;
}
    
function setupLeaderboard(data) {
    document.getElementById('leaderboard-container').innerHTML = "";
    var table = document.createElement('table');
    console.log(data.length);
    console.log(data[0].displayName)

    var header = document.createElement('tr');
    var placeHeader = document.createElement('th');
    placeHeader.textContent = "Place"
    header.appendChild(placeHeader)

    var displayNameHeader = document.createElement('th');
    displayNameHeader.textContent = "Display Name"
    header.appendChild(displayNameHeader)

    var petCountHeader = document.createElement('th');
    petCountHeader.textContent = "Times Pet"
    header.appendChild(petCountHeader)

    table.appendChild(header)

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
        petsContainer.textContent = data[i].count;
        row.appendChild(petsContainer);

        if (data[i].display_name == myDisplayName) {
            var rootStyle = getComputedStyle(document.documentElement);
            var colorScheme = rootStyle.getPropertyValue('--color-scheme').trim();
            row.id = "userRow";
            row.style.fontWeight = 'bold';
        }

        table.appendChild(row)
    }

    if (data[i].rank > 10) { 
        var tableFooter = document.createElement('tfoot');
        var yourStatsRow = document.createElement('tr')

        var placeString = "#" + data[i].rank.toString();
        var placeContainer = document.createElement('td');
        placeContainer.textContent = placeString;
        yourStatsRow.appendChild(placeContainer);

        var displayNameContainer = document.createElement('td');
        displayNameContainer.textContent = data[i].display_name;
        yourStatsRow.appendChild(displayNameContainer);

        var petsContainer = document.createElement('td');
        petsContainer.textContent = data[i].count;
        yourStatsRow.appendChild(petsContainer);

        tableFooter.appendChild(yourStatsRow);
        table.appendChild(tableFooter);
    }

    document.getElementById('leaderboard-container').appendChild(table);
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';')
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
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
var myDisplayName = getCookie("display_name")
var honkAudio = new Audio('../static/honk.mp3');
var boomAudio = new Audio('../static/boom.mp3');

(async () => {
    myPats = await getSelfPats();
    console.log(myPats);
    bruh = await getLeaderboard();
    console.log(bruh)
    syncNumber()
    setInterval(syncNumber, 600)
    
})();
let colorSchemes = ["#9426fc", "#28c99e", "#c97c28", "#c92828", "#282dc9", "#4b9e2c", "#d814db", "#2a53c1"]
var currentColorScheme = 0;

selectColorScheme(0)

function getDimmedColor(hex, dimAmount) {
    var rgb = [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];

    var r = rgb[0] / 255,
        g = rgb[1] / 255,
        b = rgb[2] / 255;
    
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);

    var h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    l = Math.max(0, 1 - dimAmount);

    return `hsl(${h * 360}, ${s * 100}%, ${l * 100}%`
}



function selectColorScheme(scheme) {
    document.documentElement.style.setProperty('--color-scheme', colorSchemes[scheme]);
    document.body.style.backgroundColor = getDimmedColor(colorSchemes[scheme], 0.95)
    styleSheet.sheet.insertRule(`button:active { background-color: ${colorSchemes[scheme]}30; }`, 0);
}

function changeColorSchme(direction) {
    currentColorScheme = currentColorScheme + direction;
    if (currentColorScheme >= colorSchemes.length) {
        currentColorScheme = 0;
    } else if (currentColorScheme < 0) {
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

document.getElementById('pet-section').addEventListener('click', function(event) {
    var x = event.offsetX;
    var y = event.offsetY;
    
    var illegalTouchX = 158;
    var illegalTouchY = 483;
    var illegalRadius = 25;
    
    var distanceX = x - illegalTouchX;
    var distanceY = y - illegalTouchY;
    var illegalDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY); // holy crap its the pythagoreonie thereom
    if(illegalDistance <= illegalRadius) {
        scoldUserForSinfulAction();
        return;
    }

    var happyTouchX = 138;
    var happyTouchY = 225;
    var happyTouchRadius = 8;

    var happyX = x - happyTouchX;
    var happyY = y - happyTouchY;
    var happyDistance = Math.sqrt(happyX * happyX + happyY * happyY);
    if(happyDistance <= happyTouchRadius) {
        honkAudio.currentTime = 0;
        honkAudio.play();
    }

    //alert(`${x},${y}`);

    increment();
});

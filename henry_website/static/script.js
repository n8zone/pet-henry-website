
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

        table.appendChild(row)
    }

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

    document.getElementById('leaderboard-container').appendChild(table);
}


var myPats;

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

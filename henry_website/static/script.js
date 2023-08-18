function increment() {
    fetch('/increment', {
	method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
	document.getElementById('number').innerText = `Henry has been pet : ${data.number} times!`;
    });
    myPats = myPats + 1;
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

(async () => {
    myPats = await getSelfPats();
    console.log(myPats);
    bruh = await getLeaderboard();
    console.log(bruh)
    syncNumber()
    setInterval(syncNumber, 600)
    
})();

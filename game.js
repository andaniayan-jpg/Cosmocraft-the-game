var moneyText = document.getElementById("moneyText");
var ironText = document.getElementById("ironText");
var crystalText = document.getElementById("crystalText");
var goldText = document.getElementById("goldText");
var fuelText = document.getElementById("fuelText");
var storageText = document.getElementById("storageText");
var heatText = document.getElementById("heatText");

var planetName = document.getElementById("planetName");
var planetDescription = document.getElementById("planetDescription");
var planetStatus = document.getElementById("planetStatus");
var planetCircle = document.getElementById("planetCircle");

var messageText = document.getElementById("messageText");
var logBox = document.getElementById("logBox");

var mineBtn = document.getElementById("mineBtn");
var sellBtn = document.getElementById("sellBtn");
var coolBtn = document.getElementById("coolBtn");
var refuelBtn = document.getElementById("refuelBtn");

var upgradeDrillBtn = document.getElementById("upgradeDrillBtn");
var upgradeStorageBtn = document.getElementById("upgradeStorageBtn");
var upgradeFuelBtn = document.getElementById("upgradeFuelBtn");
var upgradeAutoMinerBtn = document.getElementById("upgradeAutoMinerBtn");

var drillLevelText = document.getElementById("drillLevelText");
var drillCostText = document.getElementById("drillCostText");

var storageLevelText = document.getElementById("storageLevelText");
var storageCostText = document.getElementById("storageCostText");

var fuelLevelText = document.getElementById("fuelLevelText");
var fuelCostText = document.getElementById("fuelCostText");
var autoMinerLevelText = document.getElementById("autoMinerLevelText");
var autoMinerCostText = document.getElementById("autoMinerCostText");
var moonBtn = document.getElementById("moonBtn");
var marsBtn = document.getElementById("marsBtn");
var europaBtn = document.getElementById("europaBtn");
var titanBtn = document.getElementById("titanBtn");
var saveBtn = document.getElementById("saveBtn");
var loadBtn = document.getElementById("loadBtn");
var resetBtn = document.getElementById("resetBtn");
var money = 0;
var iron = 0;
var crystal = 0;
var gold = 0;
var fuel = 100;
var storageCurrent = 0;
var storageMax = 100;
var heat = 0;
var maxHeat = 100;
var drillLevel = 1;
var drillPower = 1;
var drillCost = 50;
var storageLevel = 1;
var storageCost = 75;
var fuelLevel = 1;
var fuelMax = 100;
var fuelCost = 100;
var autoMinerLevel = 0;
var autoMinerCost = 150;
var currentPlanet = "Moon";
var totalMined = 0;
var totalMoneyEarned = 0;
var miningClicks = 0;
var missionOneDone = false;
var missionTwoDone = false;
var missionThreeDone = false;
var planets = {
  Moon: {
    name: "Moon Base",
    description: "A calm starting planet with basic iron and small crystal deposits.",
    ironChance: 70,
    crystalChance: 25,
    goldChance: 5,
    fuelUse: 2,
    heatGain: 4,
    color: "radial-gradient(circle at 30% 30%, #d4d4d4, #555577, #181830)"
  


















},

  Mars: {
    name: "Mars Outpost",
    description: "A red planet with more iron and stronger mining conditions.",
    ironChance: 80,
    crystalChance: 15,
    goldChance: 5,
    fuelUse: 4,
    heatGain: 6,
    color: "radial-gradient(circle at 30% 30%, #ff9f68, #9d3f20, #2d0f08)"
  





},

  Europa: {
    name: "Europa Ice Mine",
    description: "A frozen moon with more crystals but less iron.",
    ironChance: 40,
    crystalChance: 50,
    goldChance: 10,
    fuelUse: 5,
    heatGain: 5,
    color: "radial-gradient(circle at 30% 30%, #e0fbfc, #74c0fc, #102a43)"
  },















  Titan: {
    name: "Titan Deep Field",
    description: "A dangerous world with rare gold deposits and high fuel cost.",
    ironChance: 30,
    crystalChance: 35,
    goldChance: 35,
    fuelUse: 8,
    heatGain: 9,
    color: "radial-gradient(circle at 30% 30%, #ffd166, #9c6644, #24140c)"
  }
};









function updateScreen() {
  moneyText.innerText = money;

  ironText.innerText = iron;
  crystalText.innerText = crystal;
  goldText.innerText = gold;
  fuelText.innerText = fuel + " / " + fuelMax;
  storageText.innerText = storageCurrent + " / " + storageMax;
  heatText.innerText = heat + " / " + maxHeat;





















  drillLevelText.innerText = drillLevel;
  drillCostText.innerText = drillCost;
  storageLevelText.innerText = storageLevel;
  storageCostText.innerText = storageCost;
  fuelLevelText.innerText = fuelLevel;
  fuelCostText.innerText = fuelCost;
  autoMinerLevelText.innerText = autoMinerLevel;
  autoMinerCostText.innerText = autoMinerCost;


  updateMissions();
}

function addLog(text) {
  var newLine = document.createElement("p");
  newLine.innerText = text;

  logBox.prepend(newLine);
}

function showMessage(text) {
  messageText.innerText = text;
  addLog(text);
}

function minePlanet() {
  var planet = planets[currentPlanet];

  if (fuel < planet.fuelUse) {
    showMessage("Not enough fuel. Refuel before mining again.");
    return;
  }

  if (heat >= maxHeat) {
    showMessage("Machine overheated. Cool the machine first.");
    return;
  }

  if (storageCurrent >= storageMax) {
    showMessage("Storage is full. Sell resources first.");
    return;
  }

  fuel = fuel - planet.fuelUse;
  heat = heat + planet.heatGain;

  if (heat > maxHeat) {
    heat = maxHeat;
  }

  var randomNumber = Math.floor(Math.random() * 100) + 1;
  var amount = drillPower;

  if (randomNumber <= planet.ironChance) {
    iron = iron + amount;
    showMessage("Mined " + amount + " iron from " + currentPlanet + ".");
  } else if (randomNumber <= planet.ironChance + planet.crystalChance) {
    crystal = crystal + amount;
    showMessage("Mined " + amount + " crystal from " + currentPlanet + ".");
  } else {
    gold = gold + amount;
    showMessage("Mined " + amount + " gold from " + currentPlanet + ".");
  }

  storageCurrent = storageCurrent + amount;

  if (storageCurrent > storageMax) {
    storageCurrent = storageMax;
  }

  updateScreen();
}

function sellResources() {
  if (iron === 0 && crystal === 0 && gold === 0) {
    showMessage("No resources to sell.");
    return;
  }

  var earnedMoney = iron * 2 + crystal * 5 + gold * 12;

  money = money + earnedMoney;

  iron = 0;
  crystal = 0;
  gold = 0;
  storageCurrent = 0;

  showMessage("Sold resources and earned " + earnedMoney + " money.");

  updateScreen();
}

function coolMachine() {
  if (heat === 0) {
    showMessage("Machine is already cool.");
    return;
  }

  heat = heat - 25;

  if (heat < 0) {
    heat = 0;
  }

  showMessage("Machine cooled down.");

  updateScreen();
}

function refuelMachine() {
  if (fuel >= fuelMax) {
    showMessage("Fuel tank is already full.");
    return;
  }

  if (money < 20) {
    showMessage("You need 20 money to refuel.");
    return;
  }

  money = money - 20;
  fuel = fuel + 30;

  if (fuel > fuelMax) {
    fuel = fuelMax;
  }

  showMessage("Fuel refilled.");

  updateScreen();
}

function upgradeDrill() {
  if (money < drillCost) {
    showMessage("Not enough money to upgrade drill.");
    return;
  }

  money = money - drillCost;
  drillLevel++;
  drillPower++;
  drillCost = drillCost + 50;

  showMessage("Drill upgraded to level " + drillLevel + ".");

  updateScreen();
}

function upgradeStorage() {
  if (money < storageCost) {
    showMessage("Not enough money to upgrade storage.");
    return;
  }

  money = money - storageCost;
  storageLevel++;
  storageMax = storageMax + 50;
  storageCost = storageCost + 75;

  showMessage("Storage upgraded to level " + storageLevel + ".");

  updateScreen();
}

function upgradeFuelTank() {
  if (money < fuelCost) {
    showMessage("Not enough money to upgrade fuel tank.");
    return;
  }

  money = money - fuelCost;
  fuelLevel++;
  fuelMax = fuelMax + 50;
  fuel = fuelMax;
  fuelCost = fuelCost + 100;

  showMessage("Fuel tank upgraded to level " + fuelLevel + ".");

  updateScreen();
}

function upgradeAutoMiner() {
  if (money < autoMinerCost) {
    showMessage("Not enough money to buy auto miner.");
    return;
  }

  money = money - autoMinerCost;
  autoMinerLevel++;
  autoMinerCost = autoMinerCost + 150;

  showMessage("Auto miner upgraded to level " + autoMinerLevel + ".");

  updateScreen();
}

function changePlanet(planetNameValue) {
  currentPlanet = planetNameValue;

  var planet = planets[currentPlanet];

  planetName.innerText = planet.name;
  planetDescription.innerText = planet.description;
  planetStatus.innerText = "Current Planet: " + currentPlanet;
  planetCircle.style.background = planet.color;

  showMessage("Travelled to " + currentPlanet + ".");

  updateScreen();
}

function saveGame() {
  showMessage("Save system will be added in the next phase.");
}

function loadGame() {
  showMessage("Load system will be added in the next phase.");
}

function resetGame() {
  money = 0;
  iron = 0;
  crystal = 0;
  gold = 0;
  fuel = 100;
  storageCurrent = 0;
  storageMax = 100;
  heat = 0;
  drillLevel = 1;
  drillPower = 1;
  drillCost = 50;
  storageLevel = 1;
  storageCost = 75;
  fuelLevel = 1;
  fuelMax = 100;
  fuelCost = 100;











  autoMinerLevel = 0;
  autoMinerCost = 150;

  currentPlanet = "Moon";

  changePlanet("Moon");

  showMessage("Game reset.");
  updateScreen();
}

function updateMissions() {
    var missionsOne = document.getElementById("missionOne");
    var missionTwo = document.getElementById("missionTwo");
    var missionThree = document.getElementById("missionThree");
    
    if (iron >= 20 && !missionOneDone) {
        missionOneDone = true;
        money = money + 50;
        showMessage("Mission complete: Mine 20 iron. Reward: 50 money.");

    }

    if (totalMoneyEarned >= 100 & !missionTwoDone) {
        missionTwoDone = true;
        money = money + 75;
        showMessage("Mission complete: Earn 100 moeny. Reward: 75 money.");


    }

    if (drillLevel >= 2 && !missionThreeDone) {
        missionThreeDone = true;
        money = money + 100;
        showMessage("Mission complete: Upgrade drill to level 2. Reward: 100 money.");


    }

    if (missionOneDone) {
        missionOneDone.innerText = "Complete: Mine 20 iron";
        missionOneDone.style.color = "#90be6d";

    }

    if (missionTwoDone) {
    missionTwo.innerText = "Completed: Earn 100 money";
    missionTwo.style.color = "#90be6d";
  }

  if (missionThreeDone) {
    missionThree.innerText = "Completed: Upgrade drill to level 2";
    missionThree.style.color = "#90be6d";
  }
}


mineBtn.onclick = function () {
  minePlanet();
};

sellBtn.onclick = function () {
  sellResources();
};

coolBtn.onclick = function () {
  coolMachine();
};

refuelBtn.onclick = function () {
  refuelMachine();
};

upgradeDrillBtn.onclick = function () {
  upgradeDrill();
};

upgradeStorageBtn.onclick = function () {
  upgradeStorage();
};

upgradeFuelBtn.onclick = function () {
  upgradeFuelTank();
};

upgradeAutoMinerBtn.onclick = function () {
  upgradeAutoMiner();
};

moonBtn.onclick = function () {
  changePlanet("Moon");
};

marsBtn.onclick = function () {
  changePlanet("Mars");
};

europaBtn.onclick = function () {
  changePlanet("Europa");
};

titanBtn.onclick = function () {
  changePlanet("Titan");
};

saveBtn.onclick = function () {
  saveGame();
};

loadBtn.onclick = function () {
  loadGame();
};

resetBtn.onclick = function () {
  resetGame();
};

updateScreen();
addLog("CosmoCraft system started.");
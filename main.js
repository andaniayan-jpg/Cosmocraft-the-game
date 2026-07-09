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

var missionPanel = document.getElementById("missionPanel");
var upgradePanel = document.getElementById("upgradePanel");
var gameContainer = document.getElementById("gameContainer");

var missionOne = document.getElementById("missionOne");
var missionTwo = document.getElementById("missionTwo");
var missionThree = document.getElementById("missionThree");

var claimMissionBtn;
var toggleAutoMinerBtn;
var achievementList;
var statsBox;

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
var autoMinerActive = false;

var currentPlanet = "Moon";

var totalMined = 0;
var totalMoneyEarned = 0;
var miningClicks = 0;
var totalSales = 0;
var coolCount = 0;

var currentMissionIndex = 0;

var visitedPlanets = {
  Moon: true,
  Mars: false,
  Europa: false,
  Titan: false
};

var planets = {
  Moon: {
    name: "Moon Base",
    description: "A calm starting planet with basic iron and small crystal deposits.",
    ironChance: 70,
    crystalChance: 25,
    goldChance: 5,
    fuelUse: 2,
    heatGain: 4,
    unlocked: true,
    unlockText: "Unlocked from start",
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
    unlocked: false,
    unlockText: "Unlock: Earn 200 total money",
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
    unlocked: false,
    unlockText: "Unlock: Upgrade drill to level 3",
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
    unlocked: false,
    unlockText: "Unlock: Mine 300 total resources",
    color: "radial-gradient(circle at 30% 30%, #ffd166, #9c6644, #24140c)"
  }
};

var achievements = {
  firstMine: {
    name: "First Mine",
    text: "Mine your first resource.",
    done: false,
    reward: 20
  },

  firstSale: {
    name: "First Sale",
    text: "Sell resources for the first time.",
    done: false,
    reward: 30
  },

  drillEngineer: {
    name: "Drill Engineer",
    text: "Upgrade drill to level 3.",
    done: false,
    reward: 75
  },

  heatMaster: {
    name: "Heat Master",
    text: "Cool the machine 5 times.",
    done: false,
    reward: 60
  },

  planetExplorer: {
    name: "Planet Explorer",
    text: "Visit 3 planets.",
    done: false,
    reward: 100
  },

  autoMinerOwner: {
    name: "Auto Miner Owner",
    text: "Buy your first auto miner.",
    done: false,
    reward: 80
  },

  richMiner: {
    name: "Rich Miner",
    text: "Earn 1000 total money.",
    done: false,
    reward: 200
  },

  titanExplorer: {
    name: "Titan Explorer",
    text: "Unlock Titan.",
    done: false,
    reward: 250
  }
};

var missions = [
  {
    title: "Mine 20 total resources",
    reward: 75,
    check: function () {
      return totalMined >= 20;
    },
    progress: function () {
      return totalMined + " / 20 resources mined";
    }
  },

  {
    title: "Earn 200 total money",
    reward: 100,
    check: function () {
      return totalMoneyEarned >= 200;
    },
    progress: function () {
      return totalMoneyEarned + " / 200 money earned";
    }
  },

  {
    title: "Upgrade drill to level 3",
    reward: 150,
    check: function () {
      return drillLevel >= 3;
    },
    progress: function () {
      return "Drill level " + drillLevel + " / 3";
    }
  },

  {
    title: "Unlock Mars",
    reward: 150,
    check: function () {
      return planets.Mars.unlocked;
    },
    progress: function () {
      if (planets.Mars.unlocked) {
        return "Mars unlocked";
      }

      return totalMoneyEarned + " / 200 total money";
    }
  },

  {
    title: "Buy an auto miner",
    reward: 200,
    check: function () {
      return autoMinerLevel >= 1;
    },
    progress: function () {
      return "Auto miner level " + autoMinerLevel + " / 1";
    }
  },

  {
    title: "Mine 300 total resources",
    reward: 300,
    check: function () {
      return totalMined >= 300;
    },
    progress: function () {
      return totalMined + " / 300 resources mined";
    }
  }
];

function createExtraInterface() {
  if (!document.getElementById("claimMissionBtn")) {
    claimMissionBtn = document.createElement("button");
    claimMissionBtn.id = "claimMissionBtn";
    claimMissionBtn.innerText = "Claim Mission Reward";
    missionPanel.appendChild(claimMissionBtn);
  } else {
    claimMissionBtn = document.getElementById("claimMissionBtn");
  }

  if (!document.getElementById("toggleAutoMinerBtn")) {
    toggleAutoMinerBtn = document.createElement("button");
    toggleAutoMinerBtn.id = "toggleAutoMinerBtn";
    toggleAutoMinerBtn.innerText = "Auto Miner: OFF";
    upgradePanel.appendChild(toggleAutoMinerBtn);
  } else {
    toggleAutoMinerBtn = document.getElementById("toggleAutoMinerBtn");
  }

  if (!document.getElementById("achievementPanel")) {
    var achievementPanel = document.createElement("section");
    achievementPanel.id = "achievementPanel";

    var title = document.createElement("h2");
    title.innerText = "Achievements";

    achievementList = document.createElement("ul");
    achievementList.id = "achievementList";

    achievementPanel.appendChild(title);
    achievementPanel.appendChild(achievementList);

    gameContainer.appendChild(achievementPanel);
  } else {
    achievementList = document.getElementById("achievementList");
  }

  if (!document.getElementById("statsPanel")) {
    var statsPanel = document.createElement("section");
    statsPanel.id = "statsPanel";

    var statsTitle = document.createElement("h2");
    statsTitle.innerText = "Game Stats";

    statsBox = document.createElement("div");
    statsBox.id = "statsBox";

    statsPanel.appendChild(statsTitle);
    statsPanel.appendChild(statsBox);

    gameContainer.appendChild(statsPanel);
  } else {
    statsBox = document.getElementById("statsBox");
  }
}

function updateScreen() {
  updatePlanetUnlocks();
  updateAchievements();

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

  updatePlanetButtons();
  updateMissions();
  updateAutoMinerButton();
  updateAchievementList();
  updateStats();
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

function getStorageSpace() {
  return storageMax - storageCurrent;
}

function chooseResourceFromPlanet(planet) {
  var randomNumber = Math.floor(Math.random() * 100) + 1;

  if (randomNumber <= planet.ironChance) {
    return "iron";
  }

  if (randomNumber <= planet.ironChance + planet.crystalChance) {
    return "crystal";
  }

  return "gold";
}

function addResource(resourceName, amount) {
  if (amount <= 0) {
    return;
  }

  if (resourceName === "iron") {
    iron = iron + amount;
  }

  if (resourceName === "crystal") {
    crystal = crystal + amount;
  }

  if (resourceName === "gold") {
    gold = gold + amount;
  }

  storageCurrent = storageCurrent + amount;
  totalMined = totalMined + amount;

  if (storageCurrent > storageMax) {
    storageCurrent = storageMax;
  }
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

  miningClicks++;

  var amount = drillPower;

  if (amount > getStorageSpace()) {
    amount = getStorageSpace();
  }

  var resourceName = chooseResourceFromPlanet(planet);

  addResource(resourceName, amount);

  showMessage("Mined " + amount + " " + resourceName + " from " + currentPlanet + ".");

  if (miningClicks % 8 === 0) {
    randomMiningEvent();
  }

  updateScreen();
}

function randomMiningEvent() {
  var eventNumber = Math.floor(Math.random() * 5) + 1;

  if (eventNumber === 1) {
    var bonusIron = 5;

    if (bonusIron > getStorageSpace()) {
      bonusIron = getStorageSpace();
    }

    addResource("iron", bonusIron);
    showMessage("Random event: Rich iron vein found. Bonus iron gained.");
  }

  if (eventNumber === 2) {
    var bonusCrystal = 3;

    if (bonusCrystal > getStorageSpace()) {
      bonusCrystal = getStorageSpace();
    }

    addResource("crystal", bonusCrystal);
    showMessage("Random event: Crystal pocket discovered.");
  }

  if (eventNumber === 3) {
    fuel = fuel - 10;

    if (fuel < 0) {
      fuel = 0;
    }

    showMessage("Random event: Fuel leak. Lost 10 fuel.");
  }

  if (eventNumber === 4) {
    heat = heat + 15;

    if (heat > maxHeat) {
      heat = maxHeat;
    }

    showMessage("Random event: Solar flare increased machine heat.");
  }

  if (eventNumber === 5) {
    money = money + 25;
    totalMoneyEarned = totalMoneyEarned + 25;
    showMessage("Random event: Found abandoned space coins. Gained 25 money.");
  }
}

function sellResources() {
  if (iron === 0 && crystal === 0 && gold === 0) {
    showMessage("No resources to sell.");
    return;
  }

  var earnedMoney = iron * 2 + crystal * 5 + gold * 12;

  money = money + earnedMoney;
  totalMoneyEarned = totalMoneyEarned + earnedMoney;
  totalSales++;

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

  heat = heat - 30;
  coolCount++;

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

function toggleAutoMiner() {
  if (autoMinerLevel <= 0) {
    showMessage("Buy an auto miner first.");
    return;
  }

  autoMinerActive = !autoMinerActive;

  if (autoMinerActive) {
    showMessage("Auto miner activated.");
  } else {
    showMessage("Auto miner paused.");
  }

  updateScreen();
}

function autoMineTick() {
  if (!autoMinerActive) {
    return;
  }

  if (autoMinerLevel <= 0) {
    return;
  }

  if (storageCurrent >= storageMax) {
    addLog("Auto miner paused because storage is full.");
    return;
  }

  var planet = planets[currentPlanet];

  if (fuel < planet.fuelUse) {
    autoMinerActive = false;
    showMessage("Auto miner stopped because fuel is low.");
    updateScreen();
    return;
  }

  if (heat >= maxHeat) {
    autoMinerActive = false;
    showMessage("Auto miner stopped because machine overheated.");
    updateScreen();
    return;
  }

  var amount = autoMinerLevel;

  if (amount > getStorageSpace()) {
    amount = getStorageSpace();
  }

  fuel = fuel - planet.fuelUse;
  heat = heat + planet.heatGain;

  if (heat > maxHeat) {
    heat = maxHeat;
  }

  var resourceName = chooseResourceFromPlanet(planet);

  addResource(resourceName, amount);

  addLog("Auto miner collected " + amount + " " + resourceName + " from " + currentPlanet + ".");

  updateScreen();
}

function updateAutoMinerButton() {
  if (autoMinerActive) {
    toggleAutoMinerBtn.innerText = "Auto Miner: ON";
  } else {
    toggleAutoMinerBtn.innerText = "Auto Miner: OFF";
  }
}

function changePlanet(planetNameValue) {
  if (!planets[planetNameValue].unlocked) {
    showMessage(planetNameValue + " is locked. " + planets[planetNameValue].unlockText + ".");
    return;
  }

  currentPlanet = planetNameValue;
  visitedPlanets[currentPlanet] = true;

  var planet = planets[currentPlanet];

  planetName.innerText = planet.name;
  planetDescription.innerText = planet.description;
  planetStatus.innerText = "Current Planet: " + currentPlanet;
  planetCircle.style.background = planet.color;

  showMessage("Travelled to " + currentPlanet + ".");

  updateScreen();
}

function updatePlanetUnlocks() {
  if (!planets.Mars.unlocked && totalMoneyEarned >= 200) {
    planets.Mars.unlocked = true;
    showMessage("New planet unlocked: Mars.");
  }

  if (!planets.Europa.unlocked && drillLevel >= 3) {
    planets.Europa.unlocked = true;
    showMessage("New planet unlocked: Europa.");
  }

  if (!planets.Titan.unlocked && totalMined >= 300) {
    planets.Titan.unlocked = true;
    showMessage("New planet unlocked: Titan.");
  }
}

function updatePlanetButtons() {
  moonBtn.disabled = false;

  marsBtn.disabled = !planets.Mars.unlocked;
  europaBtn.disabled = !planets.Europa.unlocked;
  titanBtn.disabled = !planets.Titan.unlocked;

  moonBtn.innerText = "Moon";

  if (planets.Mars.unlocked) {
    marsBtn.innerText = "Mars";
  } else {
    marsBtn.innerText = "Mars Locked";
  }

  if (planets.Europa.unlocked) {
    europaBtn.innerText = "Europa";
  } else {
    europaBtn.innerText = "Europa Locked";
  }

  if (planets.Titan.unlocked) {
    titanBtn.innerText = "Titan";
  } else {
    titanBtn.innerText = "Titan Locked";
  }
}

function updateMissions() {
  if (currentMissionIndex >= missions.length) {
    missionOne.innerText = "All missions completed.";
    missionTwo.innerText = "You have finished the main CosmoCraft mission path.";
    missionThree.innerText = "Keep mining, upgrading and exploring.";
    claimMissionBtn.innerText = "All Missions Complete";
    claimMissionBtn.disabled = true;
    return;
  }

  var mission = missions[currentMissionIndex];

  missionOne.innerText = "Current Mission: " + mission.title;
  missionTwo.innerText = "Progress: " + mission.progress();
  missionThree.innerText = "Reward: " + mission.reward + " money";

  if (mission.check()) {
    missionOne.style.color = "#90be6d";
    claimMissionBtn.innerText = "Claim Reward";
    claimMissionBtn.disabled = false;
  } else {
    missionOne.style.color = "white";
    claimMissionBtn.innerText = "Mission Not Ready";
    claimMissionBtn.disabled = false;
  }
}

function claimMissionReward() {
  if (currentMissionIndex >= missions.length) {
    showMessage("All missions are already complete.");
    return;
  }

  var mission = missions[currentMissionIndex];

  if (!mission.check()) {
    showMessage("Mission is not complete yet: " + mission.progress() + ".");
    return;
  }

  money = money + mission.reward;
  totalMoneyEarned = totalMoneyEarned + mission.reward;

  showMessage("Mission complete: " + mission.title + ". Reward: " + mission.reward + " money.");

  currentMissionIndex++;

  updateScreen();
}

function unlockAchievement(achievementKey) {
  var achievement = achievements[achievementKey];

  if (achievement.done) {
    return;
  }

  achievement.done = true;
  money = money + achievement.reward;
  totalMoneyEarned = totalMoneyEarned + achievement.reward;

  showMessage("Achievement unlocked: " + achievement.name + ". Reward: " + achievement.reward + " money.");
}

function updateAchievements() {
  if (totalMined >= 1) {
    unlockAchievement("firstMine");
  }

  if (totalSales >= 1) {
    unlockAchievement("firstSale");
  }

  if (drillLevel >= 3) {
    unlockAchievement("drillEngineer");
  }

  if (coolCount >= 5) {
    unlockAchievement("heatMaster");
  }

  if (countVisitedPlanets() >= 3) {
    unlockAchievement("planetExplorer");
  }

  if (autoMinerLevel >= 1) {
    unlockAchievement("autoMinerOwner");
  }

  if (totalMoneyEarned >= 1000) {
    unlockAchievement("richMiner");
  }

  if (planets.Titan.unlocked) {
    unlockAchievement("titanExplorer");
  }
}

function updateAchievementList() {
  achievementList.innerHTML = "";

  for (var key in achievements) {
    var item = document.createElement("li");

    if (achievements[key].done) {
      item.innerText = "Completed: " + achievements[key].name;
      item.style.color = "#90be6d";
    } else {
      item.innerText = achievements[key].name + " - " + achievements[key].text;
      item.style.color = "#e0e6ff";
    }

    achievementList.appendChild(item);
  }
}

function countVisitedPlanets() {
  var count = 0;

  if (visitedPlanets.Moon) {
    count++;
  }

  if (visitedPlanets.Mars) {
    count++;
  }

  if (visitedPlanets.Europa) {
    count++;
  }

  if (visitedPlanets.Titan) {
    count++;
  }

  return count;
}

function updateStats() {
  statsBox.innerHTML = "";

  var lineOne = document.createElement("p");
  lineOne.innerText = "Total mined: " + totalMined;

  var lineTwo = document.createElement("p");
  lineTwo.innerText = "Total money earned: " + totalMoneyEarned;

  var lineThree = document.createElement("p");
  lineThree.innerText = "Mining clicks: " + miningClicks;

  var lineFour = document.createElement("p");
  lineFour.innerText = "Planets visited: " + countVisitedPlanets() + " / 4";

  var lineFive = document.createElement("p");
  lineFive.innerText = "Current mission: " + (currentMissionIndex + 1) + " / " + missions.length;

  statsBox.appendChild(lineOne);
  statsBox.appendChild(lineTwo);
  statsBox.appendChild(lineThree);
  statsBox.appendChild(lineFour);
  statsBox.appendChild(lineFive);
}

function saveGame() {
  var saveData = {
    money: money,
    iron: iron,
    crystal: crystal,
    gold: gold,
    fuel: fuel,
    storageCurrent: storageCurrent,
    storageMax: storageMax,
    heat: heat,
    drillLevel: drillLevel,
    drillPower: drillPower,
    drillCost: drillCost,
    storageLevel: storageLevel,
    storageCost: storageCost,
    fuelLevel: fuelLevel,
    fuelMax: fuelMax,
    fuelCost: fuelCost,
    autoMinerLevel: autoMinerLevel,
    autoMinerCost: autoMinerCost,
    autoMinerActive: autoMinerActive,
    currentPlanet: currentPlanet,
    totalMined: totalMined,
    totalMoneyEarned: totalMoneyEarned,
    miningClicks: miningClicks,
    totalSales: totalSales,
    coolCount: coolCount,
    currentMissionIndex: currentMissionIndex,
    visitedPlanets: visitedPlanets,
    planetsUnlocked: {
      Moon: planets.Moon.unlocked,
      Mars: planets.Mars.unlocked,
      Europa: planets.Europa.unlocked,
      Titan: planets.Titan.unlocked
    },
    achievements: achievements
  };

  localStorage.setItem("cosmocraftSave", JSON.stringify(saveData));

  showMessage("Game saved successfully.");
}

function loadGame() {
  var savedGame = localStorage.getItem("cosmocraftSave");

  if (savedGame === null) {
    showMessage("No saved game found.");
    return;
  }

  var saveData = JSON.parse(savedGame);

  money = saveData.money;
  iron = saveData.iron;
  crystal = saveData.crystal;
  gold = saveData.gold;
  fuel = saveData.fuel;

  storageCurrent = saveData.storageCurrent;
  storageMax = saveData.storageMax;

  heat = saveData.heat;

  drillLevel = saveData.drillLevel;
  drillPower = saveData.drillPower;
  drillCost = saveData.drillCost;

  storageLevel = saveData.storageLevel;
  storageCost = saveData.storageCost;

  fuelLevel = saveData.fuelLevel;
  fuelMax = saveData.fuelMax;
  fuelCost = saveData.fuelCost;

  autoMinerLevel = saveData.autoMinerLevel;
  autoMinerCost = saveData.autoMinerCost;
  autoMinerActive = saveData.autoMinerActive;

  currentPlanet = saveData.currentPlanet;

  totalMined = saveData.totalMined;
  totalMoneyEarned = saveData.totalMoneyEarned;
  miningClicks = saveData.miningClicks;
  totalSales = saveData.totalSales;
  coolCount = saveData.coolCount;

  currentMissionIndex = saveData.currentMissionIndex;

  visitedPlanets = saveData.visitedPlanets;

  planets.Moon.unlocked = saveData.planetsUnlocked.Moon;
  planets.Mars.unlocked = saveData.planetsUnlocked.Mars;
  planets.Europa.unlocked = saveData.planetsUnlocked.Europa;
  planets.Titan.unlocked = saveData.planetsUnlocked.Titan;

  achievements = saveData.achievements;

  var planet = planets[currentPlanet];

  planetName.innerText = planet.name;
  planetDescription.innerText = planet.description;
  planetStatus.innerText = "Current Planet: " + currentPlanet;
  planetCircle.style.background = planet.color;

  showMessage("Saved game loaded.");
  updateScreen();
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
  autoMinerActive = false;

  currentPlanet = "Moon";

  totalMined = 0;
  totalMoneyEarned = 0;
  miningClicks = 0;
  totalSales = 0;
  coolCount = 0;

  currentMissionIndex = 0;

  visitedPlanets = {
    Moon: true,
    Mars: false,
    Europa: false,
    Titan: false
  };

  planets.Moon.unlocked = true;
  planets.Mars.unlocked = false;
  planets.Europa.unlocked = false;
  planets.Titan.unlocked = false;

  achievements.firstMine.done = false;
  achievements.firstSale.done = false;
  achievements.drillEngineer.done = false;
  achievements.heatMaster.done = false;
  achievements.planetExplorer.done = false;
  achievements.autoMinerOwner.done = false;
  achievements.richMiner.done = false;
  achievements.titanExplorer.done = false;

  localStorage.removeItem("cosmocraftSave");

  var planet = planets.Moon;

  planetName.innerText = planet.name;
  planetDescription.innerText = planet.description;
  planetStatus.innerText = "Current Planet: Moon";
  planetCircle.style.background = planet.color;

  showMessage("Game reset.");
  updateScreen();
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

createExtraInterface();

claimMissionBtn.onclick = function () {
  claimMissionReward();
};

toggleAutoMinerBtn.onclick = function () {
  toggleAutoMiner();
};

changePlanet("Moon");
updateScreen();
addLog("CosmoCraft system started.");

setInterval(autoMineTick, 3000);
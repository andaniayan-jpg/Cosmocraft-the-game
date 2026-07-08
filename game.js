var moneyText = document.getElementById("moneyText");
var iroText = document.getElementById("ironText");
var crystalText = document.getElementById("crystalText");
var goldText = document.getElementById("goldText");
var fuelText = document.getElementById("fuelText");
var storageText = document.getElementById("heatText");
var heatText = document.getElementById("heatText");
var planetName = document.getElementById("planetName");
var planetDescription = document.getElementById("planetDescription");
var planetStatus = document.getElementById("planetStatus");
var planetCircle = document.getElementById("planetCircle");


var messageText = document.getElementById("messageText");
var logBox = document.getElementById("logBox");
var mineBtn = document.getElementById("mineBtn");

var sellBtn = document.getElementById("sellBtn");
var coolBtn = document.getElementById("collBtn");
var refuelBtn = document.getElementById("refuelBtn");

var upgradeDrillBtn = document.getElementById("upgradeDrillBtn");
var upgradeStorageBtn = document.getElementById("upgradeStorageBtn");
var upgradeFuelBtn = document.getElementById("upgradeFuelBtn");
var upgradeAutoMinerBtn = document.getElementById("upgradeAutoMinerBtn");

var drillLevelText = document.getElementById("drillLevelText");
var drillCostText = document.etElementById("drillCostText");
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
var drillLevel = 1;
var drillPower = 1;
var drillCost = 50;
var storageLevel = 1;
var StorageCost = 75;

var fuelLevel = 1;
var fuelMax = 100;
var fuelCost = 100;

var autoMinerLevel = 0;
var autoMinerCost = 150;

var currentPlanet = "Moon";

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
        name: "Mars Base",
        description: "A calm starting planet with basic iron and small crystal deposits",
        ironChance: 80,
        crystalChance: 15,
        goldChances: 5,
        fuelUse: 4,
        heatGain: 6,
        color: "radial-gradient(circle at 30% 30%, #ff9f68, #9d3f20, #2d0f08)"

         
    },

    Europa: {
        name: "Europa Ice Mine",
        description: "A frozen moon with more crystals but less iron.",
        ironChance: 40,
        crystalChance: 55,
        goldChance: 10,
        fuelUse: 5,
        heatGain: 5,
        color: "radial-gradient(circle at 30% 30%, #e0fbfc, #74c0fc, #102a43)"

    },

    Titan: {
        name: "Title deep field",
        description: "A dangerous world with rare gold deposits and high fuel cost",
        ironChance: 30,
        crystalChance: 35,
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

    fuelLevelText.innerText = fuelLevel;
    fuelCostText.innerText = fuelCost;

    autoMinerLevelText.innerText = autoMinerLevel;
    autoMinerCostText.innerText = autoMinerCost;


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

}


if (fuel < planet.fuelUse) {
    showMessage("Not enough fuel. Refuel before mining again");
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


    var earnMoney = iron * 2 + crystal * 5 + gold * gold * 12;
    

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

    heat = heat -25;
    
    if (heat < 0) {
        heat = 0;

    }

    showMessage("Machine colled down.");

    updateScreen();

}

function refuelMachine() {
    if (fuel >= fuelMax) {
        showMessage("Fuel tank is already full.");
        return;

    }

    money = money - 20;
    fuel = fuelMax;

}

showMessage("Fuel refilled.");

updateScreen();

}

function upgrasdeDrill() {
    if (money < drillCost) {
        showMessage("Not enough money to upgrade drill.");
        return;

    }

    money = money - drillCost;
    drillLevel++;
    drillPower++;
    drillCost = drillCost + 50;

    showMessage("Drill upgrade to level " + drillLevel + ".");

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
    
}



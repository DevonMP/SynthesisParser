const express = require('express');
var bodyParser = require('body-parser');
const Recipe = require('./Recipe.js');
const Item = require('./Item.js');
const synthesisMods = require('./ItemSynthesisMods.json');// This file shamelessly taken from poe.db
const app = express();
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded()).use(express.static('public'));

app.post('/itemdata', function(request, response) {
	response.writeHead(200, {'Content-Type': 'application/json'});
	response.end(JSON.stringify(GetPossibleSynthesisMods(new Item(request.body.item), recipes)));
});

app.post('/itemdataahk', function(request, response) {
	var results = GetPossibleSynthesisMods(new Item(request.body.item), recipes)
	response.render('ahkitemdata', {results:results});
});

app.get('/itemdataahk', function(request, response) {
	var results = GetPossibleSynthesisMods(new Item(`Rarity: Rare
	Viper Grinder
	Tenderizer
	--------
	One Handed Mace
	Physical Damage: 54-70 (augmented)
	Elemental Damage: 6-15 (augmented)
	Critical Strike Chance: 5.00%
	Attacks per Second: 1.40
	Weapon Range: 9
	--------
	Requirements:
	Level: 58
	Str: 185 (unmet)
	--------
	Sockets: R-B-R 
	--------
	Item Level: 61
	--------
	10% reduced Enemy Stun Threshold
	--------
	+34 to Strength (fractured)
	14% reduced Enemy Stun Threshold (fractured)
	Adds 5 to 8 Physical Damage
	Adds 6 to 15 Cold Damage
	10% chance to cause Bleeding on Hit
	--------
	Fractured Item`), recipes)
	response.render('ahkitemdata', {results:results});
});

port = process.env.PORT || 3000
app.listen(port)

function GetPossibleSynthesisMods(item, recipes){
	var lastRecipe;
	var wasMatch = false;
	var validRecipes = [];
	var output = [];
	for(var i in recipes){
		var currentRecipe = recipes[i];
		if(currentRecipe.types.includes(item.itemType)){
			validRecipes.push(currentRecipe);
			if( lastRecipe != null && lastRecipe.requiredMod != currentRecipe.requiredMod){
				lastRecipe.TopTier = true;
			}
			lastRecipe = currentRecipe;
		}
	}
	lastRecipe = null;
	var tier = 0;
	validRecipes.reverse();
	for(var i in validRecipes){
		var currentRecipe = validRecipes[i];
		var isMatch = false;
		if(lastRecipe != null && lastRecipe.requiredMod != currentRecipe.requiredMod){
			tier = 0;
			wasMatch = false;
		}
		tier++;
		currentRecipe.Tier = tier;
		for(var x in item.mods){
			var modValue = item.mods[x].value;
			var modText = item.mods[x].modText;
			if(currentRecipe.value < 0){
				modText = modText.replace('reduced','increased').replace('+', '-');
				modValue = modValue * -1;
			}
			if(!wasMatch &&
				modText.match(currentRecipe.requiredMod) &&
				modValue * 3 >= currentRecipe.value
			){
				output.push({recipe:lastRecipe, mod:item.mods[x]});
				wasMatch = true;
			}
		}
		lastRecipe = currentRecipe;
	}

	return output;
}

function loadRecipes(modData){
	var modTemplates = [];
	for(var i in modData){
		modTemplates.push(new Recipe(modData[i]));
	}
	return modTemplates;
}
const recipes = loadRecipes(synthesisMods.data);
recipes.sort(function(a, b){
	if(a.requiredMod.localeCompare(b.requiredMod) == 0){
		return a.value - b.value;
	}
	return a.requiredMod.localeCompare(b.requiredMod);
});
const express = require('express');
var bodyParser = require('body-parser');
const Recipe = require('./Recipe.js');
const Item = require('./Item.js');
const synthesisMods = require('./ItemSynthesisMods.json');
const app = express();
app.use(bodyParser.urlencoded()).use(express.static('public'));

app.post('/itemdata', function(request, response) {
	response.writeHead(200, {'Content-Type': 'application/json'});
	response.end(JSON.stringify(GetPossibleSynthesisMods(new Item(request.body.item), recipes)));
});

port = process.env.PORT || 3000
app.listen(port)

const sampleItem = `Rarity: Rare
Hate Nail
Coral Ring
--------
Requirements:
Level: 38
--------
Item Level: 74
--------
+22 to maximum Life
--------
Adds 8 to 16 Cold Damage to Attacks (fractured)
+62 to Evasion Rating (fractured)
+17 to Dexterity
+35% to Fire Resistance
+11 Life gained on Kill
--------
Fractured Item`;

function GetPossibleSynthesisMods(item, recipes){
	var lastRecipe;
	var wasMatch = false;
	var validRecipes = [];
	var output = [];
	for(var i in recipes){
		var currentRecipe = recipes[i];
		if(currentRecipe.types.includes(item.itemType)){
			validRecipes.push(currentRecipe);
			if( lastRecipe != null && lastRecipe.text != currentRecipe.text){
				lastRecipe.TopTier = true;
			}
			lastRecipe = currentRecipe;
		}
	}
	lastRecipe = null;
	var tier = 0;
	for(var i in validRecipes){
		var currentRecipe = validRecipes[i];
		var isMatch = false;
		if(lastRecipe != null && lastRecipe.text != currentRecipe.text){
			tier = 0;
		}
		tier++;
		
		for(var x in item.mods){
			if(item.mods[x].modText.match(currentRecipe.text) &&
				item.mods[x].value * 3 > currentRecipe.value
			){
				isMatch = true;
			}
		}

		if(wasMatch && !isMatch){
			output.push(currentRecipe);
		}
		wasMatch = isMatch;
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
const myItem = new Item(sampleItem);
const recipes = loadRecipes(synthesisMods.data);
recipes.sort(function(a, b){
	if(a.text.localeCompare(b.text) == 0){
		return a.value - b.value;
	}
	return a.text.localeCompare(b.text);
});
//GetPossibleSynthesisMods(myItem, recipes);
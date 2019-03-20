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
	var mods = GetPossibleSynthesisMods(new Item(request.body.item), recipes)
	response.render('ahkitemdata', {mods:mods});
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
	for(var i in validRecipes){
		var currentRecipe = validRecipes[i];
		var isMatch = false;
		if(lastRecipe != null && lastRecipe.requiredMod != currentRecipe.requiredMod){
			tier = 0;
			wasMatch = false;
		}
		tier++;
		for(var x in item.mods){
			var modValue = item.mods[x].value;
			var modText = item.mods[x].modText;
			if(currentRecipe.value < 0){
				modText = modText.replace('reduced','increased').replace('+', '-');
				modValue = modValue * -1;
			}
			if(!wasMatch &&
				modText.match(currentRecipe.requiredMod) &&
				modValue * 3 <= currentRecipe.value
			){
				output.push(currentRecipe);
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